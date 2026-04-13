const iconClass = 'h-5 w-5 shrink-0'

export function IconApple({ className = iconClass }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M12 6.528V3a1 1 0 0 1 1-1h0" />
      <path d="M18.237 21A15 15 0 0 0 22 11a6 6 0 0 0-10-4.472A6 6 0 0 0 2 11a15.1 15.1 0 0 0 3.763 10 3 3 0 0 0 3.648.648 5.5 5.5 0 0 1 5.178 0A3 3 0 0 0 18.237 21" />
    </svg>
  )
}

export function IconAndroid({ className = iconClass }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M17.523 2.226l1.392-1.903a.45.45 0 0 0-.108-.63.45.45 0 0 0-.63.107L16.71 1.895A6.96 6.96 0 0 0 12 .5a6.96 6.96 0 0 0-4.71 1.396L5.823.8a.45.45 0 0 0-.63-.108.45.45 0 0 0-.108.63l1.392 1.904A7.015 7.015 0 0 0 3 8.5h18a7.015 7.015 0 0 0-3.477-6.274zM8.5 6a1 1 0 1 1 0-2 1 1 0 0 1 0 2zm7 0a1 1 0 1 1 0-2 1 1 0 0 1 0 2zM3 10v8a1 1 0 0 0 1 1h1v3.5a1.5 1.5 0 0 0 3 0V19h8v3.5a1.5 1.5 0 0 0 3 0V19h1a1 1 0 0 0 1-1v-8H3zm-2.5.5a1.5 1.5 0 0 1 3 0v6a1.5 1.5 0 0 1-3 0v-6zm22 0a1.5 1.5 0 0 1 3 0v6a1.5 1.5 0 0 1-3 0v-6z" />
    </svg>
  )
}

export function IconWindows({ className = iconClass }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M0 3.449L9.75 2.1v9.451H0m10.949-9.602L24 0v11.4H10.949M0 12.6h9.75v9.451L0 20.699M10.949 12.6H24V24l-12.9-1.801" />
    </svg>
  )
}
