export function Panel({ children, className = "" }) {
  return (
    <section
      className={`rounded-[8px] border border-[rgba(148,168,210,0.14)] bg-[#111725] p-5 ${className}`}
    >
      {children}
    </section>
  );
}
