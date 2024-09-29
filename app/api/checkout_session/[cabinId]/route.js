import { NextResponse } from "next/server";
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

// This will handle POST requests to the API route
export async function POST(req) {
  try {
    const { origin } = req.headers;

    // Create a Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price_data: {
            unit_amount: 100, // Amount in cents
            currency: "usd",
            product_data: {
              name: "bugga",
              description: "Product description",
              images: [], // You can add image URLs here if needed
            },
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${origin}/?success=true`,
      cancel_url: `${origin}/?canceled=true`,
    });

    // Redirect the client to the Stripe session URL
    return NextResponse.redirect(session.url, 303);
  } catch (err) {
    return NextResponse.json(
      { message: err.message },
      { status: err.statusCode || 500 }
    );
  }
}
