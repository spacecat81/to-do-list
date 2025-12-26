export function WritingPencil({ className = '' }: { className?: string }) {
  return (
    <svg 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
      className={className}
    >
      <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
      <path d="m15 5 4 4" />
      <path 
        d="M2 22h6" 
        className="animate-writing"
        strokeDasharray="6"
        strokeDashoffset="6"
      />
      <style>{`
        @keyframes writing {
          0%, 100% { stroke-dashoffset: 6; }
          50% { stroke-dashoffset: 0; }
        }
        .animate-writing {
          animation: writing 1.5s ease-in-out infinite;
        }
      `}</style>
    </svg>
  )
}
