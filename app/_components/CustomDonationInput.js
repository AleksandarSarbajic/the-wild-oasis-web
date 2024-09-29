import { formatAmountForDisplay } from "../_utils/stripe-helpers";

export default function CustomDonationInput({
  name,
  min,
  max,
  currency,
  step,
  onChange,
  value,
  className,
}) {
  return (
    <label>
      Custom donation amount ({formatAmountForDisplay(min, currency)}-
      {formatAmountForDisplay(max, currency)}):
      <input
        type="range"
        name={name}
        min={min}
        max={max}
        step={step}
        onChange={onChange}
        value={value}
        className={className}
      ></input>
    </label>
  );
}
