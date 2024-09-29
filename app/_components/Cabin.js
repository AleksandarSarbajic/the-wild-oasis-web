import { EyeSlashIcon, MapPinIcon, UsersIcon } from "@heroicons/react/24/solid";
import Image from "next/image";
import TextExpander from "./TextExpander";

function Cabin({ cabin }) {
  const { name, maxCapacity, image, description } = cabin;

  return (
    <div className="grid grid-cols-1 grid-rows-2 md:grid-rows-1 md:grid-cols-[3fr_4fr] gap-2 md:gap-20 border border-primary-800 py-3 px-6 md:px-10 mb-12 md:mb-24">
      {/* Image Section */}
      <div className="relative scale-100 md:scale-[1.15] -translate-x-0 md:-translate-x-3 mb-6 md:mb-0">
        <Image
          src={image}
          alt={`Cabin ${name}`}
          fill
          className="object-cover w-full h-full"
        />
      </div>

      {/* Text Section */}
      <div>
        <h3 className="text-accent-100 font-black text-4xl md:text-5xl lg:text-7xl mb-3 md:mb-5 translate-x-[-10%] md:translate-x-[-254px] bg-primary-950 p-4 md:p-6 pb-1 w-[110%] md:w-[150%]">
          Cabin {name}
        </h3>

        <p className="text-base md:text-lg text-primary-300 mb-6 md:mb-10">
          <TextExpander>{description}</TextExpander>
        </p>

        <ul className="flex flex-col gap-2 md:gap-4 mb-5 md:mb-7">
          <li className="flex gap-2 md:gap-3 items-center">
            <UsersIcon className="h-5 w-5 text-primary-600" />
            <span className="text-base md:text-lg">
              For up to <span className="font-bold">{maxCapacity}</span> guests
            </span>
          </li>
          <li className="flex gap-2 md:gap-3 items-center">
            <MapPinIcon className="h-5 w-5 text-primary-600" />
            <span className="text-base md:text-lg">
              Located in the heart of the{" "}
              <span className="font-bold">Dolomites</span> (Italy)
            </span>
          </li>
          <li className="flex gap-2 md:gap-3 items-center">
            <EyeSlashIcon className="h-5 w-5 text-primary-600" />
            <span className="text-base md:text-lg">
              Privacy <span className="font-bold">100%</span> guaranteed
            </span>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default Cabin;
