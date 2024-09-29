"use client";

import ReservationCard from "./ReservationCard";
import { deleteReservation, updateBookingHook } from "../_lib/actions";

import { useOptimistic } from "react";

function ReservationList({ bookings, paying }) {
  const [optimisticBookings, optimisticDelete] = useOptimistic(
    bookings,
    (curBookings, bookingId) => {
      return curBookings.filter((booking) => booking.id !== bookingId);
    }
  );

  async function handleDelete(bookingId) {
    optimisticDelete(bookingId);
    await deleteReservation(bookingId);
  }

  return (
    <ul className="space-y-6">
      <button onClick={() => updateBookingHook()}>update</button>
      {optimisticBookings.map((booking) => (
        <ReservationCard
          booking={booking}
          key={booking.id}
          onDelete={handleDelete}
          paying={paying}
        />
      ))}
    </ul>
  );
}

export default ReservationList;
