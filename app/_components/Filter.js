"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

function Filter() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const activeFilter = searchParams.get("capacity") ?? "all";

  function handleFilterClick(filter) {
    const params = new URLSearchParams(searchParams);
    params.set("capacity", filter);
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  }

  return (
    <div className="border border-primary-800 flex">
      <Button
        filter="all"
        handleFilterClick={handleFilterClick}
        activeFilter={activeFilter}
      >
        All cabins
      </Button>
      <Button
        filter="small"
        handleFilterClick={handleFilterClick}
        activeFilter={activeFilter}
      >
        1&mdash;3 guests
      </Button>
      <Button
        filter="medium"
        handleFilterClick={handleFilterClick}
        activeFilter={activeFilter}
      >
        4&mdash;7 guests
      </Button>
      <Button
        filter="large"
        handleFilterClick={handleFilterClick}
        activeFilter={activeFilter}
      >
        8&mdash;12 guests
      </Button>
    </div>
  );
}

function Button({ filter, handleFilterClick, activeFilter, children }) {
  return (
    <button
      className={`px-4 py-2 hover:bg-primary-700 ${
        filter === activeFilter ? "bg-primary-700 text-primary-50" : ""
      }`}
      onClick={() => handleFilterClick(filter)}
    >
      {children}
    </button>
  );
}

export default Filter;
