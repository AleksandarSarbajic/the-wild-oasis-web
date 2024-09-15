import { loadStripe } from "@stripe/stripe-js";

export const bookCabin = async (tourId) => {
  const stripe = await loadStripe(
    "pk_test_51PZ7wRFRiPUJXBu9wSb2k4CiIaXpO7S049D6uDpcZRHzbXr4mk33BcL7fC1hBCD0nKcn5S6KGjzPj3JZbVKevXBc00UyAwTyye"
  );

  try {
    // 1) Get Checkout session
    const response = await axios.get(
      `/api/v1/bookings/checkout-session/${tourId}`
    );
    const session = response.data.session;

    // 2) Redirect to checkout form
    await stripe.redirectToCheckout({
      sessionId: session.id,
    });
  } catch (err) {
    console.log(err);
  }
};
