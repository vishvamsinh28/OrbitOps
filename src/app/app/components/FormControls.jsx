export function TextField({ label, name, type = "text", required, ...props }) {
  return (
    <label className="grid gap-2 text-sm text-[#8B98B4]">
      {label}
      <input
        name={name}
        type={type}
        required={required}
        className="rounded-md border border-[rgba(148,168,210,0.2)] bg-[#0D1220] px-3 py-2.5 text-[#E9EDF6]"
        {...props}
      />
    </label>
  );
}

export function SelectField({ label, name, children, required, ...props }) {
  return (
    <label className="grid gap-2 text-sm text-[#8B98B4]">
      {label}
      <select
        name={name}
        required={required}
        className="rounded-md border border-[rgba(148,168,210,0.2)] bg-[#0D1220] px-3 py-2.5 text-[#E9EDF6]"
        {...props}
      >
        {children}
      </select>
    </label>
  );
}

export function FileField({ label, name, accept, ...props }) {
  return (
    <label className="grid gap-2 text-sm text-[#8B98B4]">
      {label}
      <input
        name={name}
        type="file"
        accept={accept}
        className="rounded-md border border-[rgba(148,168,210,0.2)] bg-[#0D1220] px-3 py-2.5 text-[#E9EDF6] file:mr-3 file:rounded-md file:border-0 file:bg-[#FFB020] file:px-3 file:py-1.5 file:font-mono file:text-xs file:text-[#0A0E1A]"
        {...props}
      />
    </label>
  );
}

export function SubmitButton({ children }) {
  return (
    <button type="submit" className="rounded-[7px] bg-[#FFB020] px-4 py-2.5 font-mono text-sm font-medium text-[#0A0E1A]">
      {children}
    </button>
  );
}
