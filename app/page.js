import Image from "next/image";
import bg from "@/public/bg.png";
import Link from "next/link";

export default function Page() {
  return (
    <div className="mt-24">
      <Image
        src={bg}
        alt="Mountains and forests with two cabins"
        fill
        quality={80}
        placeholder="blur"
        className="object-cover object-bottom"
      />

      <div className="relative text-center">
        <h1 className="text-5xl sm:text-8xl text-primary-50 mb-10 tracking-tight font-normal break-all">
          Welcome to paradise.
        </h1>
        <Link
          href="/cabins"
          className="bg-accent-500 px-8 py-6 text-primary-800 text-lg font-semibold hover:bg-accent-600 transition-all"
        >
          Explore luxury cabins
        </Link>
      </div>
    </div>
  );
}
