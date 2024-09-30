import { CheckIcon, XMarkIcon } from "@heroicons/react/24/solid";
import Image from "next/image";
import clsx from "clsx";
import { redirect } from "next/navigation";

function Result({
  status,
  price,
  image,
  customer,
  email,
  phone,
  refNumber,
  currency,
  description,
  date,
}) {
  const statusCheck = "succeeded";

  const statusIcon =
    status === statusCheck ? (
      <CheckIcon className="w-5 text-white" />
    ) : (
      <XMarkIcon className="w-5 text-white" />
    );

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="flex flex-col items-center gap-3 mb-7 text-center">
        <div
          className={clsx(
            "rounded-full p-[0.4rem] relative inline-block mb-4",
            status === statusCheck ? "bg-green-600" : "bg-red-600"
          )}
        >
          {statusIcon}
          <span
            className={clsx(
              "absolute w-16 h-16 rounded-full",
              status === statusCheck ? "bg-green-700/15" : "bg-red-700/15",
              "top-1/2 right-1/2 -translate-y-1/2 translate-x-1/2"
            )}
          />
        </div>
        <h2 className="text-xl font-semibold">
          Payment {status === statusCheck ? "Success!" : "Failed!"}
        </h2>
        <p className="opacity-80">
          Your payment has{" "}
          {status === statusCheck ? "been successfully processed." : "failed."}
        </p>
      </div>

      <div className="bg-[#25282e] p-5 rounded-xl">
        <div className="flex flex-col items-center gap-3">
          <Image
            src={image}
            width={240}
            height={200}
            alt="Product Image"
            className="rounded-xl my-2"
          />
          <p className="text-lg text-center">{description}</p>
        </div>

        {/* Divider */}
        <div className="w-full h-[1.5px] bg-slate-50/10 my-6" />

        {/* Payment Details */}
        <div className="space-y-3">
          <PaymentDetail label="Amount" value={`${price} ${currency}`} />
          <PaymentDetail
            label="Payment status"
            value={
              <span
                className={clsx(
                  "rounded-2xl px-3 py-1 text-sm",
                  status === statusCheck
                    ? "bg-[#294230] text-[#3bb181]"
                    : "bg-red-700/30 text-red-500"
                )}
              >
                {status === statusCheck ? "Success" : "Failed"}
              </span>
            }
          />
          <div className="w-full h-[1.5px] bg-slate-50/10 my-6 inline-block" />

          <PaymentDetail label="Ref Number" value={refNumber} />
          <PaymentDetail label="Payment method" value="Visa 4242" />
          <PaymentDetail label="Date" value={date} />
          <PaymentDetail label="Sender" value={customer} />
          <PaymentDetail label="Email" value={email} />
          <PaymentDetail label="Phone" value={phone} />
        </div>
        <button
          onClick={redirect("/account/reservations")}
          className="w-full mt-8 py-2 rounded-lg inline-block border-primary-100 border text-lg hover:bg-accent-600 hover:border-accent-600"
        >
          Go to reservations
        </button>
      </div>
    </div>
  );
}

function PaymentDetail({ label, value }) {
  return (
    <div className="flex justify-between items-center">
      <span className="font-medium opacity-60">{label}</span>
      <span>{value}</span>
    </div>
  );
}

export default Result;
