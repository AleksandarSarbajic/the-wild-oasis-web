export const metadata = {
  title: "Checkout Session Result",
};

export default function ResultLayout({ children }) {
  return (
    <div className="page-container">
      <h1>Checkout Session Result</h1>
      {children}
    </div>
  );
}
