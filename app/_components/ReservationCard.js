import { PencilSquareIcon } from "@heroicons/react/24/solid";
import { format, formatDistance, isPast, isToday, parseISO } from "date-fns";
import DeleteReservation from "./DeleteReservation";
import Link from "next/link";
import Image from "next/image";
import CheckoutForm from "./CheckoutForm";

export const formatDistanceFromNow = (dateStr) =>
  formatDistance(parseISO(dateStr), new Date(), {
    addSuffix: true,
  }).replace("about ", "");

function ReservationCard({ booking, onDelete, paying }) {
  const {
    id,
    startDate,
    endDate,
    numNights,
    totalPrice,
    numGuests,
    created_at,
    isPaid,
    cabins: { name, image },
  } = booking;

  return (
    <div className="flex flex-col md:flex-row border border-primary-800">
      {/* Image Section */}
      <div className="relative h-48 md:h-32 w-full md:w-32 aspect-square">
        <Image
          fill
          src={image}
          alt={`Cabin ${name}`}
          className="object-cover border-b md:border-b-0 md:border-r border-primary-800"
          loading="lazy"
        />
      </div>

      <div className="flex-grow px-4 py-3 flex flex-col space-y-2">
        <div className="flex flex-row items-start md:items-center justify-between">
          <h3 className="text-lg md:text-xl font-semibold">
            {numNights} nights in Cabin {name}
          </h3>
          <div className="flex gap-3">
            <Badge
              condition={isPast(new Date(startDate))}
              label="Past"
              bgColor="bg-yellow-800"
              textColor="text-yellow-200"
            />
            <Badge
              condition={!isPast(new Date(startDate))}
              label="Upcoming"
              bgColor="bg-green-600"
              textColor="text-green-200"
            />
            <Badge
              condition={!isPaid && !paying}
              label="UnPaid"
              bgColor="bg-red-700/30"
              textColor="text-red-500"
            />
            <Badge
              condition={isPaid && !paying}
              label="Paid"
              bgColor="bg-[#294230]"
              textColor="text-[#3bb181]"
            />
          </div>
        </div>

        <p className="text-base md:text-lg text-primary-300">
          {format(new Date(startDate), "EEE, MMM dd yyyy")} (
          {isToday(new Date(startDate))
            ? "Today"
            : formatDistanceFromNow(startDate)}
          ) &mdash; {format(new Date(endDate), "EEE, MMM dd yyyy")}
        </p>

        <div className="flex flex-col sm:flex-row gap-3 md:gap-5 mt-auto items-baseline">
          <ReservationInfo totalPrice={totalPrice} numGuests={numGuests} />
          <p className="sm:ml-auto text-xs md:text-sm text-primary-400">
            Booked {format(new Date(created_at), "EEE, MMM dd yyyy, p")}
          </p>
        </div>
      </div>

      <div
        className={`${
          paying
            ? "md:border-l border-primary-800 flex border-t md:border-t-0"
            : "flex md:flex-col border-t md:border-t-0 md:border-l border-primary-800 w-full md:w-[100px]"
        }`}
      >
        {!isPast(startDate) && !paying ? (
          <>
            <Link
              href={`/account/reservations/edit/${id}`}
              className="group flex items-center justify-center gap-2 uppercase text-xs font-bold text-primary-300  border-r-[1px] md:border-b border-primary-800 flex-grow px-2 py-2 hover:bg-accent-600 transition-colors hover:text-primary-900"
            >
              <PencilSquareIcon className="h-4 w-4 md:h-5 md:w-5 text-primary-600 group-hover:text-primary-800 transition-colors" />
              <span>Edit</span>
            </Link>
            <DeleteReservation bookingId={id} onDelete={onDelete} />
          </>
        ) : null}
        {!isPast(startDate) && paying ? (
          <CheckoutForm bookingId={id} data={booking} uiMode="hosted" />
        ) : null}
        {isPast(startDate) && (
          <>
            <DeleteReservation bookingId={id} onDelete={onDelete} />
          </>
        )}
      </div>
    </div>
  );
}

export default ReservationCard;

function Badge({ condition, label, bgColor, textColor }) {
  return condition ? (
    <span
      aria-label={`Reservation status: ${label}`}
      className={`${bgColor} ${textColor} h-6 md:h-7 px-2 md:px-3 uppercase text-xs font-bold flex items-center rounded-sm`}
    >
      {label}
    </span>
  ) : null;
}

function ReservationInfo({ totalPrice, numGuests }) {
  return (
    <div className="flex gap-3">
      <p className="text-lg md:text-xl font-semibold text-accent-400">
        ${totalPrice}
      </p>
      <p className="text-primary-300">&bull;</p>
      <p className="text-base md:text-lg text-primary-300">
        {numGuests} guest{numGuests > 1 && "s"}
      </p>
    </div>
  );
}
