import PrintObject from "@/app/_components/PrintObject";
import Result from "@/app/_components/Result";
import { updateBookingHook } from "@/app/_lib/actions";
import { stripe } from "@/app/_lib/stripe";

export const metadata = {
  title: "Checkout Result",
  description: "Your payment result",
};

export default async function ResultPage({ searchParams }) {
  if (!searchParams.session_id)
    throw new Error("Please provide a valid session_id (`cs_test_...`)");

  const checkoutSession = await stripe.checkout.sessions.retrieve(
    searchParams.session_id,
    {
      expand: ["line_items", "payment_intent"],
    }
  );

  const paymentIntent = checkoutSession.payment_intent;
  updateBookingHook(checkoutSession);

  return (
    <>
      <Result
        image={checkoutSession.metadata.image_url}
        status={paymentIntent.status}
        customer={checkoutSession.customer_details.name}
        email={checkoutSession.customer_details.email}
        phone={checkoutSession.customer_details.phone}
        refNumber={checkoutSession.client_reference_id}
        price={paymentIntent.amount}
        currency={paymentIntent.currency}
        description={checkoutSession.line_items.data[0].description}
        date={new Date(checkoutSession.created * 1000).toDateString()}
      />

      {/* <PrintObject content={checkoutSession} /> */}
    </>
  );
}
