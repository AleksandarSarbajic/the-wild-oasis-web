"use client";
import Link from "next/link";
import { useState } from "react";

function NavigationMenu({ session }) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  const handleLinkClick = () => {
    if (window?.innerWidth < 768) {
      setIsOpen(false);
    }
  };
  return (
    <nav className="z-10 text-xl">
      <div className="md:hidden">
        <button
          onClick={toggleMenu}
          className={`${
            isOpen ? "fixed top-6 right-8" : ""
          } focus:outline-none p-2 z-10`}
          aria-label="Toggle menu"
        >
          <svg
            className="w-7 h-7 text-white z-10"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} // X icon when open, hamburger when closed
            />
          </svg>
        </button>
      </div>

      <ul
        className={`${
          isOpen
            ? "flex flex-col gap-3 fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 text-2xl"
            : "hidden"
        } md:flex md:gap-8 items-center transition-all`}
      >
        <li>
          <Link
            onClick={handleLinkClick}
            href="/cabins"
            className="hover:text-accent-400 transition-colors"
          >
            Cabins
          </Link>
        </li>
        <li>
          <Link
            onClick={handleLinkClick}
            href="/about"
            className="hover:text-accent-400 transition-colors"
          >
            About
          </Link>
        </li>
        <li>
          {session?.user?.image ? (
            <Link
              onClick={handleLinkClick}
              href="/account"
              className="hover:text-accent-400 transition-colors flex items-center gap-4"
            >
              <img
                className="h-8 rounded-full"
                src={session.user.image}
                alt={session.user.name}
                referrerPolicy="no-referrer"
              />
              <span>Guest area</span>
            </Link>
          ) : (
            <Link
              onClick={handleLinkClick}
              href="/account"
              className="hover:text-accent-400 transition-colors"
            >
              Guest area
            </Link>
          )}
        </li>
      </ul>

      {/* Overlay for mobile menu */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm"
          onClick={toggleMenu}
        />
      )}
    </nav>
  );
}

export default NavigationMenu;
