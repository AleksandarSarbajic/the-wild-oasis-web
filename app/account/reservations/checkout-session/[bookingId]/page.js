"use client";
import React from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";

const stripePromise = loadStripe(
  "pk_test_51PZ7wRFRiPUJXBu9wSb2k4CiIaXpO7S049D6uDpcZRHzbXr4mk33BcL7fC1hBCD0nKcn5S6KGjzPj3JZbVKevXBc00UyAwTyye"
);
export default function Page() {
  return (
    <Elements
      stripe={stripePromise}
      options={{ mode: "payment", amount: 0, currency: "eur" }}
    ></Elements>
  );
}
