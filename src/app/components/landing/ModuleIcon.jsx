const iconPaths = {
  user: (
    <>
      <circle cx="12" cy="8" r="3.4" />
      <path d="M5 20c0-3.5 3.1-6 7-6s7 2.5 7 6" />
    </>
  ),
  dashboard: (
    <>
      <rect x="3.5" y="3.5" width="7" height="7" rx="1.2" />
      <rect x="13.5" y="3.5" width="7" height="7" rx="1.2" />
      <rect x="3.5" y="13.5" width="7" height="7" rx="1.2" />
      <rect x="13.5" y="13.5" width="7" height="7" rx="1.2" />
    </>
  ),
  layers: (
    <>
      <path d="M12 3.5 3.5 8 12 12.5 20.5 8Z" />
      <path d="M3.5 12 12 16.5 20.5 12" />
      <path d="M3.5 16 12 20.5 20.5 16" />
    </>
  ),
  tag: (
    <>
      <path d="M12.6 3.5H20v7.4L11 20 3.9 12.9Z" />
      <circle cx="16.3" cy="7.7" r="1.3" />
    </>
  ),
  transfer: (
    <>
      <path d="M4 8h13.5M17.5 8 14 4.5M17.5 8 14 11.5" />
      <path d="M20 16H6.5M6.5 16 10 12.5M6.5 16 10 19.5" />
    </>
  ),
  calendar: (
    <>
      <rect x="3.5" y="5" width="17" height="15" rx="1.6" />
      <path d="M3.5 9.5h17M8 3.5v3M16 3.5v3" />
    </>
  ),
  wrench: <path d="M14.5 6.5a3.6 3.6 0 0 0-4.8 4.3L4 16.5 5.5 18l5.7-5.7a3.6 3.6 0 0 0 4.3-4.8l-2.3 2.3-1.7-1.7Z" />,
  audit: (
    <>
      <rect x="5" y="4" width="14" height="17" rx="1.4" />
      <path d="M9 3.5h6v2H9zM8.3 12.3l2 2 4.4-4.4" />
    </>
  ),
  chart: <path d="M4 20V10M10 20V6.5M16 20v-8M20.5 20V4" />,
  bell: (
    <>
      <path d="M6 17v-5.5a6 6 0 0 1 12 0V17l1.8 2.2H4.2Z" />
      <path d="M10.3 20.5a1.9 1.9 0 0 0 3.4 0" />
    </>
  ),
};

export function ModuleIcon({ name }) {
  return (
    <div className="module-icon">
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {iconPaths[name]}
      </svg>
    </div>
  );
}
