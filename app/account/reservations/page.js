import ReservationList from "@/app/_components/ReservationList";
import ReservationsFilter from "@/app/_components/ReservationsFilter";
import { auth } from "@/app/_lib/auth";
import { getBookings } from "@/app/_lib/data-service";

import Link from "next/link";

export const metadata = {
  title: "Reservations",
  description: "Your reservations",
};

export default async function Page({ searchParams: { filter, field } }) {
  const session = await auth();
  const bookings = await getBookings({
    guestId: session.user.guestId,
    filter,
    field,
  });

  return (
    <div>
      <div className="flex flex-col justify-between items-center mb-7 sm:flex-row gap-3">
        <h2 className="font-semibold text-2xl text-accent-400 ">
          Your reservations
        </h2>
        <ReservationsFilter />
      </div>

      {bookings.length === 0 ? (
        <p className="text-lg">
          You have no reservations yet. Check out our{" "}
          <Link className="underline text-accent-500" href="/cabins">
            luxury cabins &rarr;
          </Link>
        </p>
      ) : (
        <ReservationList bookings={bookings} />
      )}
    </div>
  );
}
