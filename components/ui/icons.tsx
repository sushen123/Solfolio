export function IconArrowElbow({ className, ...props }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      <path d="M12 19v-5.5a3.5 3.5 0 0 0-3.5-3.5V6.5a3.5 3.5 0 0 1 3.5-3.5h5" />
      <polyline points="12 19 8 15 12 19 16 15" />
    </svg>
  );
}

export function IconPlus({ className, ...props }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  );
}

// Paste this into your @/components/ui/icons.tsx file

export function IconSparkles({
  className,
  ...props
}: React.ComponentProps<'svg'>) {
  return (
    <svg
      fill="none"
      shapeRendering="geometricPrecision"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.5"
      viewBox="0 0 24 24"
      className={className}
      {...props}
    >
      <path d="M12 3v4M12 17v4M21 12h-4M7 12H3" />
      <path d="M16.95 7.05l-2.83 2.83M9.88 14.12l-2.83 2.83" />
      <path d="M7.05 7.05l2.83 2.83M14.12 14.12l2.83 2.83" />
    </svg>
  )

}

// Paste this into your icons file alongside the others

export function IconPlayerStop({
  className,
  ...props
}: React.ComponentProps<'svg'>) {
  return (
    <svg
      fill="none"
      shapeRendering="geometricPrecision"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.5"
      viewBox="0 0 24 24"
      className={className}
      {...props}
    >
      <rect x="5" y="5" width="14" height="14" rx="2" ry="2"></rect>
    </svg>
  );
}