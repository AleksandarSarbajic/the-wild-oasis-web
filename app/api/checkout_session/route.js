const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

export default async function POST(req, res) {
  if (req.method === "POST") {
    try {
      const session = await stripe.checkout.sessions.create({
        line_items: [
          {
            price_data: {
              unit_amount: 100,
              currency: "usd",
              product_data: {
                name: "bugga",
                description: `nigga`,
                images: [],
              },
            },
            quantity: 1,
          },
        ],
        mode: "payment",
        success_url: `${req.headers.origin}/?success=true`,
        cancel_url: `${req.headers.origin}/?canceled=true`,
      });
      res.redirect(303, session.url);
    } catch (err) {
      res.status(err.statusCode || 500).json(err.message);
    }
  } else {
    res.setHeader("Allow", "POST");
    res.status(405).end("Method Not Allowed");
  }
}
