const navigationItems = [
  { href: "#modules", label: "Modules" },
  { href: "#lifecycle", label: "Lifecycle" },
  { href: "#roles", label: "Roles" },
  { href: "#workflow", label: "Workflow" },
];

export function HeaderNavigation() {
  return (
    <div className="hidden items-center gap-[34px] text-sm text-[#8B98B4] min-[961px]:flex">
      {navigationItems.map(({ href, label }) => (
        <a key={href} href={href} className="transition-colors hover:text-[#E9EDF6]">
          {label}
        </a>
      ))}
    </div>
  );
}
