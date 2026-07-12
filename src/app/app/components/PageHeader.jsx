export function PageHeader({ eyebrow, title, children, action }) {
  return (
    <div className="mb-8 flex flex-col gap-4 min-[760px]:flex-row min-[760px]:items-end min-[760px]:justify-between">
      <div className="max-w-[720px]">
        <p className="font-mono text-xs uppercase tracking-[0.12em] text-[#4FD1E8]">
          {eyebrow}
        </p>
        <h1 className="mt-2 font-display text-[34px] font-semibold leading-tight">
          {title}
        </h1>
        {children ? (
          <p className="mt-2 text-sm text-[#8B98B4]">{children}</p>
        ) : null}
      </div>

      {action}
    </div>
  );
}
