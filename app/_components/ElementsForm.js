"use client";

import * as React from "react";
import {
  useStripe,
  useElements,
  PaymentElement,
  Elements,
} from "@stripe/react-stripe-js";

import CustomDonationInput from "./CustomDonationInput";
import StripeTestCards from "./StripeTestCards";

import { formatAmountForDisplay } from "../_utils/stripe-helpers";
import * as config from "@/config";
import getStripe from "../_utils/get-stripejs";
import { createPaymentIntent } from "@/actions/stripe";

function CheckoutForm() {
  const [input, setInput] = React.useState({
    customDonation: Math.round(config.MAX_AMOUNT / config.AMOUNT_STEP),
    cardholderName: "",
  });
  const [paymentType, setPaymentType] = React.useState("");
  const [payment, setPayment] = React.useState({ status: "initial" });
  const [errorMessage, setErrorMessage] = React.useState("");

  const stripe = useStripe();
  const elements = useElements();

  const PaymentStatus = ({ status }) => {
    switch (status) {
      case "processing":
      case "requires_payment_method":
      case "requires_confirmation":
        return <h2>Processing...</h2>;

      case "requires_action":
        return <h2>Authenticating...</h2>;

      case "succeeded":
        return <h2>Payment Succeeded 🥳</h2>;

      case "error":
        return (
          <>
            <h2>Error 😭</h2>
            <p className="error-message">{errorMessage}</p>
          </>
        );

      default:
        return null;
    }
  };

  const handleInputChange = (e) => {
    setInput({
      ...input,
      [e.currentTarget.name]: e.currentTarget.value,
    });

    elements?.update({ amount: input.customDonation * 100 });
  };

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      // Abort if form isn't valid
      if (!e.currentTarget.reportValidity()) return;
      if (!elements || !stripe) return;

      setPayment({ status: "processing" });

      const { error: submitError } = await elements.submit();

      if (submitError) {
        setPayment({ status: "error" });
        setErrorMessage(submitError.message ?? "An unknown error occurred");

        return;
      }

      // Create a PaymentIntent with the specified amount.
      const { client_secret: clientSecret } = await createPaymentIntent(
        new FormData(e.target)
      );

      // Use your card Element with other Stripe.js APIs
      const { error: confirmError } = await stripe.confirmPayment({
        elements,
        clientSecret,
        confirmParams: {
          return_url: `${window.location.origin}/donate-with-elements/result`,
          payment_method_data: {
            billing_details: {
              name: input.cardholderName,
            },
          },
        },
      });

      if (confirmError) {
        setPayment({ status: "error" });
        setErrorMessage(confirmError.message ?? "An unknown error occurred");
      }
    } catch (err) {
      const { message } = err;

      setPayment({ status: "error" });
      setErrorMessage(message ?? "An unknown error occurred");
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <CustomDonationInput
          className="elements-style"
          name="customDonation"
          value={input.customDonation}
          min={config.MIN_AMOUNT}
          max={config.MAX_AMOUNT}
          step={config.AMOUNT_STEP}
          currency={config.CURRENCY}
          onChange={handleInputChange}
        />
        <StripeTestCards />
        <fieldset className="elements-style">
          <legend>Your payment details:</legend>
          {paymentType === "card" ? (
            <input
              placeholder="Cardholder name"
              className="elements-style"
              type="Text"
              name="cardholderName"
              onChange={handleInputChange}
              required
            />
          ) : null}
          <div className="FormRow elements-style">
            <PaymentElement
              onChange={(e) => {
                setPaymentType(e.value.type);
              }}
            />
          </div>
        </fieldset>
        <button
          className="elements-style-background"
          type="submit"
          disabled={
            !["initial", "succeeded", "error"].includes(payment.status) ||
            !stripe
          }
        >
          Donate {formatAmountForDisplay(input.customDonation, config.CURRENCY)}
        </button>
      </form>
      <PaymentStatus status={payment.status} />
    </>
  );
}

export default function ElementsForm() {
  return (
    <Elements
      stripe={getStripe()}
      options={{
        appearance: {
          variables: {
            colorIcon: "#6772e5",
            fontFamily: "Roboto, Open Sans, Segoe UI, sans-serif",
          },
        },
        currency: config.CURRENCY,
        mode: "payment",
        amount: Math.round(config.MAX_AMOUNT / config.AMOUNT_STEP),
      }}
    >
      <CheckoutForm />
    </Elements>
  );
}
