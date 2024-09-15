import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import CheckoutForm from "./CheckoutForm";

// Make sure to call `loadStripe` outside of a component’s render to avoid
// recreating the `Stripe` object on every render.
const stripePromise = loadStripe(
  "pk_test_51PZ7wRFRiPUJXBu9wSb2k4CiIaXpO7S049D6uDpcZRHzbXr4mk33BcL7fC1hBCD0nKcn5S6KGjzPj3JZbVKevXBc00UyAwTyye"
);

export default async function Stripe() {
  const session = await auth();

  const options = {
    // passing the client secret obtained from the server
    clientSecret: session.user.guestId,
  };

  return (
    <Elements stripe={stripePromise} options={options}>
      <CheckoutForm />
    </Elements>
  );
}
