import CheckoutForm from "../_components/CheckoutForm";
import ReservationList from "../_components/ReservationList";
import { auth } from "../_lib/auth";
import { getUpcomingUnpaidBookings } from "../_lib/data-service";

export const metadata = {
  title: "Account",
  description: "Your account information",
};

async function Page() {
  const session = await auth();
  const firstName = session?.user?.name.split(" ").at(0);
  const bookings = await getUpcomingUnpaidBookings(session.user.guestId);

  return (
    <div>
      <h2 className="font-semibold text-2xl text-accent-400 mb-7">
        Welcome, {firstName}
      </h2>
      {bookings.length > 0 && (
        <>
          <h2 className="font-semibold text-xl text-accent-400 mb-4">
            Unpaid Reservations
          </h2>
          <ReservationList bookings={bookings} paying={true} />
        </>
      )}
    </div>
  );
}

export default Page;
