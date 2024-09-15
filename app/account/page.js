import { createCheckoutSession } from "../_lib/actions";
import { auth } from "../_lib/auth";

export const metadata = {
  title: "Account",
  description: "Your account information",
};

async function Page() {
  const session = await auth();
  const firstName = session?.user?.name.split(" ").at(0);
  return (
    <form action={createCheckoutSession}>
      <h2 className="font-semibold text-2xl text-accent-400 mb-7">
        Welcome, {firstName}
      </h2>
      <button>click me</button>
    </form>
  );
}

export default Page;
