"use server";

import { revalidatePath } from "next/cache";
import { auth, signIn, signOut } from "./auth";
import { supabase } from "./supabase";
import { getBookings } from "./data-service";
import { redirect } from "next/navigation";

import { headers } from "next/headers";

import { CURRENCY } from "../_config";
import { formatAmountForStripe } from "../_utils/stripe-helpers";
import { stripe } from "./stripe";

export async function createCheckoutSession(data, bookingData) {
  const bookingItem = {
    quantity: 1,

    price_data: {
      currency: CURRENCY,
      product_data: {
        name: `${bookingData.numNights} nights in Cabin ${bookingData.cabins.name}`,
        description: `${bookingData.numGuests} guest${
          bookingData.numNights > 1 && "s"
        }`,
        images: [bookingData.cabins.image],
      },
      unit_amount: formatAmountForStripe(bookingData.totalPrice, CURRENCY),
    },
  };
  const ui_mode = data.get("uiMode");

  const origin = headers().get("origin");

  const checkoutSession = await stripe.checkout.sessions.create({
    mode: "payment",
    submit_type: "pay",
    metadata: {
      image_url: bookingData.cabins.image, // Custom field for storing image URL
      cabin_name: bookingData.cabins.name, // Additional metadata (optional)
    },
    phone_number_collection: {
      enabled: true,
    },
    client_reference_id: bookingData.id,

    line_items: [bookingItem],
    ...(ui_mode === "hosted" && {
      success_url: `${origin}/account/result?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/account`,
    }),
    ...(ui_mode === "embedded" && {
      return_url: `${origin}/donate-with-embedded-checkout/result?session_id={CHECKOUT_SESSION_ID}`,
    }),
    ui_mode,
  });

  return {
    client_secret: checkoutSession.client_secret,
    url: checkoutSession.url,
  };
}

export async function createPaymentIntent(data) {
  const paymentIntent = await stripe.paymentIntents.create({
    amount: formatAmountForStripe(Number(data.get("customDonation")), CURRENCY),
    automatic_payment_methods: { enabled: true },
    currency: CURRENCY,
  });

  return { client_secret: paymentIntent.client_secret };
}

export async function updateGuest(formData) {
  const session = await auth();
  if (!session) throw new Error("You must be logged in");
  const nationalID = formData.get("nationalID");
  const [nationality, countryFlag] = formData.get("nationality").split("%");

  if (!/^[a-zA-Z0-9]{6,12}$/.test(nationalID))
    throw new Error("Please provie a valid national ID");

  const updateData = { nationality, countryFlag, nationalID };
  const { error } = await supabase
    .from("guests")
    .update(updateData)
    .eq("id", session.user.guestId);

  if (error) {
    console.error(error);
    throw new Error("Guest could not be updated");
  }

  revalidatePath("/account/profile");
}

export async function createBooking(bookingData, formData) {
  const session = await auth();
  const hasBreakfast = formData.get("hasBreakfast");
  if (!session) throw new Error("You must be logged in");
  const newBooking = {
    ...bookingData,
    guestId: session.user.guestId,
    numGuests: Number(formData.get("numGuests")),
    observations: formData.get("observations").slice(0, 1000),
    totalPrice: bookingData.cabinPrice + (hasBreakfast === "true" ? 200 : 0),
    extrasPrice: hasBreakfast === "true" ? 200 : 0,
    isPaid: false,
    hasBreakfast: hasBreakfast,
    status: "unconfirmed",
  };
  const { error } = await supabase.from("bookings").insert([newBooking]);

  if (error) {
    throw new Error("Booking could not be created");
  }

  revalidatePath(`/cabins/${bookingData.cabinId}`);

  redirect("/cabins/thankyou");
}

export async function deleteReservation(bookingId) {
  const session = await auth();
  if (!session) throw new Error("You must be logged in");

  const guestBookings = await getBookings(session.user.guestId);
  const guestBookingsIds = guestBookings.map((booking) => booking.id);

  if (!guestBookingsIds.includes(bookingId))
    throw new Error("You are not authorized to delete this booking");

  const { error } = await supabase
    .from("bookings")
    .delete()
    .eq("id", bookingId);

  if (error) {
    console.error(error);
    throw new Error("Booking could not be deleted");
  }
  revalidatePath("/account/reservations");
}

export async function updateBooking(formData) {
  const bookingId = Number(formData.get("bookingId"));

  // 1) Authentication
  const session = await auth();
  if (!session) throw new Error("You must be logged in");

  // 2) Authorization
  const guestBookings = await getBookings(session.user.guestId);
  const guestBookingIds = guestBookings.map((booking) => booking.id);

  if (!guestBookingIds.includes(bookingId))
    throw new Error("You are not allowed to update this booking");

  // 3) Building update data
  const updateData = {
    numGuests: Number(formData.get("numGuests")),
    observations: formData.get("observations").slice(0, 1000),
  };

  // 4) Mutation
  const { error } = await supabase
    .from("bookings")
    .update(updateData)
    .eq("id", bookingId)
    .select()
    .single();

  // 5) Error handling
  if (error) throw new Error("Booking could not be updated");

  // 6) Revalidation
  revalidatePath(`/account/reservations/edit/${bookingId}`);
  revalidatePath("/account/reservations");

  // 7) Redirecting
  redirect("/account/reservations");
}

export async function updateBookingHook(booking) {
  try {
    const { data, error } = await supabase
      .from("bookings")
      .update({ isPaid: true, status: "checked-in" })
      .eq("id", booking.client_reference_id)
      .select()
      .single();

    if (error) {
      console.error("Booking update error:", error);
      throw new Error(`Booking could not be updated: ${error.message}`);
    }

    return data;
  } catch (err) {
    throw new Error(`An unexpected error occurred: ${err.message}`);
  }
}

export async function signInAction() {
  await signIn("google", { redirectTo: "/account" });
}
export async function signOutAction() {
  await signOut({ redirectTo: "/" });
}
