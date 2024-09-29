"use client";

import React, { useState } from "react";

import * as config from "../_config";
import { createCheckoutSession } from "../_lib/actions";

export default function CheckoutForm({ uiMode, data: bookingData }) {
  const [loading] = useState(false);
  const [input, setInput] = useState({
    customDonation: Math.round(config.MAX_AMOUNT / config.AMOUNT_STEP),
  });

  const handleInputChange = (e) =>
    setInput({
      ...input,
      [e.currentTarget.name]: e.currentTarget.value,
    });

  const formAction = async (data) => {
    console.log(data, bookingData);
    const { url } = await createCheckoutSession(data, bookingData);

    window.location.assign(url);
  };

  return (
    <form
      action={formAction}
      className="w-full flex justify-center items-center"
    >
      <input type="hidden" name="uiMode" value={uiMode} />

      <button
        className="flex items-center justify-center gap-2 uppercase text-xs font-bold text-primary-300 w-full h-full  border-r-[1px] md:border-b border-primary-800 flex-grow px-2 py-2 hover:bg-accent-600 transition-colors hover:text-primary-900"
        type="submit"
        disabled={loading}
      >
        Pay Now
      </button>
    </form>
  );
}
