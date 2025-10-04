export function StarRating({ value }) {
  const safeValue = Number.isFinite(value) ? value : 0;
  const percentage = Math.max(0, Math.min(100, (safeValue / 5) * 100));

  return (
    <div className="flex items-center gap-2">
      <div className="relative flex text-[#f0c14b]">
        <div className="flex text-neutral-200">
          {Array.from({ length: 5 }).map((_, index) => (
            <svg
              key={`base-${index}`}
              viewBox="0 0 24 24"
              className="h-4 w-4"
              fill="currentColor"
            >
              <path d="M12 2l2.89 6.26L22 9.27l-5 4.87L18.18 21 12 17.77 5.82 21 7 14.14l-5-4.87 7.11-1.01z" />
            </svg>
          ))}
        </div>
        <div
          className="absolute inset-0 flex overflow-hidden text-[#f0c14b]"
          style={{ width: `${percentage}%` }}
        >
          {Array.from({ length: 5 }).map((_, index) => (
            <svg
              key={`fill-${index}`}
              viewBox="0 0 24 24"
              className="h-4 w-4"
              fill="currentColor"
            >
              <path d="M12 2l2.89 6.26L22 9.27l-5 4.87L18.18 21 12 17.77 5.82 21 7 14.14l-5-4.87 7.11-1.01z" />
            </svg>
          ))}
        </div>
      </div>
      <span className="font-montserrat text-xs font-medium text-neutral-500">
        {safeValue.toFixed(1)}/5
      </span>
    </div>
  );
}
