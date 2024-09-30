"use client";

import {
  differenceInDays,
  isPast,
  isSameDay,
  isWithinInterval,
} from "date-fns";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { useState, useEffect } from "react";
import { useReservation } from "./ReservationContext";

function isAlreadyBooked(range, datesArr) {
  return (
    range.from &&
    range.to &&
    datesArr.some((date) =>
      isWithinInterval(date, { start: range.from, end: range.to })
    )
  );
}

function DateSelector({ settings, cabin, bookedDates }) {
  const { range, setRange, resetRange, hasBreakfast } = useReservation();
  const breakfastPrice = hasBreakfast === "true" ? 200 : 0;

  const displayRange = isAlreadyBooked(range, bookedDates) ? {} : range;

  const { regularPrice, discount } = cabin;
  const numNights = differenceInDays(displayRange.to, displayRange.from);
  const cabinPrice = numNights * (regularPrice - discount);

  const { minBookingLength, maxBookingLength } = settings;

  const [numberOfMonths, setNumberOfMonths] = useState(2);

  // Adjust number of months displayed based on screen size
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setNumberOfMonths(1); // Screen size below 'md'
      } else {
        setNumberOfMonths(2); // Screen size above 'md'
      }
    };

    handleResize(); // Set the initial value
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="flex flex-col justify-between">
      <DayPicker
        className="pt-12 place-self-center pb-12"
        mode="range"
        onSelect={setRange}
        selected={displayRange}
        min={minBookingLength + 1}
        max={maxBookingLength}
        fromMonth={new Date()}
        fromDate={new Date()}
        toYear={new Date().getFullYear() + 5}
        captionLayout="dropdown"
        numberOfMonths={numberOfMonths}
        disabled={(curDate) =>
          isPast(curDate) ||
          bookedDates.some((date) => isSameDay(date, curDate))
        }
      />

      <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-between gap-3 lg:gap-0 px-8 bg-accent-500 text-primary-800 lg:h-[72px] py-2 lg:py-0">
        <div className="flex items-baseline gap-6">
          <p className="flex gap-2 items-baseline">
            {discount > 0 ? (
              <>
                <span className="text-2xl">${regularPrice - discount}</span>
                <span className="line-through font-semibold text-primary-700">
                  ${regularPrice}
                </span>
              </>
            ) : (
              <span className="text-2xl">${regularPrice}</span>
            )}
            <span>/night</span>
          </p>
          {numNights ? (
            <p className="bg-accent-600 px-3 py-2 text-2xl">
              <span>&times;</span> <span>{numNights}</span>
            </p>
          ) : null}
        </div>
        <div className="flex justify-center items-center gap-3">
          {numNights ? (
            <>
              <p>
                <span className="text-lg font-bold uppercase">Total</span>{" "}
                <span className="text-2xl font-semibold">
                  ${cabinPrice + breakfastPrice}
                </span>
              </p>
            </>
          ) : null}
          {range.from || range.to ? (
            <button
              className="border border-primary-800 py-2 px-4 text-sm font-semibold"
              onClick={resetRange}
            >
              Clear
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export default DateSelector;
