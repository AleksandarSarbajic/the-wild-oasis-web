"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

function ReservationsFilter() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const activeFilter = searchParams.get("filter") ?? "all-reservations";

  function handleFilterClick(filter) {
    if (filter.split(",")[1] === "default")
      router.replace(`${pathname}`, { scroll: false });
    else {
      const params = new URLSearchParams(searchParams);
      params.set("filter", filter.split(",")[0]);
      params.set("field", filter.split(",")[1] ?? "");
      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    }
  }

  return (
    <div className="">
      <select
        className="border border-primary-800 px-4 py-2 bg-primary-700 text-accent-400"
        defaultValue={activeFilter}
        onChange={(e) => {
          handleFilterClick(e.target.value);
        }}
      >
        <option value={["all-reservations", "default"]}>
          All Reservations
        </option>

        <option value={["order", true]}>Start Date Ascending</option>
        <option value={["order", false]}>Start Date descending</option>
        <option value={["date", "upcoming"]}>Upcoming Reservations</option>
        <option value={["date", "past"]}>Past Reservations</option>
        <option value={["isPaid", true]}>Paid Reservations</option>
        <option value={["isPaid", false]}>Unpaid Reservations</option>
      </select>
    </div>
  );
}

export default ReservationsFilter;
