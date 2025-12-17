export function AquarelaPlaceholder() {
  return (
    <svg
      viewBox="0 0 400 500"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-full"
      preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        <linearGradient id="wash" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#FFF6DD" />
          <stop offset="100%" stopColor="#F5C76A" />
        </linearGradient>

        <filter id="blur">
          <feGaussianBlur stdDeviation="18" />
        </filter>
      </defs>

      {/* Mancha principal */}
      <path
        d="M70 120
           C20 200, 40 360, 160 420
           C300 480, 380 340, 350 220
           C330 120, 180 60, 70 120Z"
        fill="url(#wash)"
        filter="url(#blur)"
        opacity="0.9"
      />

      {/* Mancha secundária */}
      <path
        d="M140 80
           C100 160, 140 260, 260 300
           C340 330, 360 220, 300 140
           C260 80, 180 40, 140 80Z"
        fill="#F5C76A"
        filter="url(#blur)"
        opacity="0.35"
      />
    </svg>
  )
}
