/**
 * ProductImagePlaceholder Component
 * Clean dark placeholder with Voltify 'V' logo
 * Shown when a featured product has no image
 */
export default function ProductImagePlaceholder() {
  return (
    <div className="h-full w-full flex items-center justify-center bg-gradient-to-b from-voltify-dark/80 to-voltify-dark">
      <div className="flex flex-col items-center gap-4">
        {/* Voltify V Logo */}
        <div className="w-24 h-24 flex items-center justify-center">
          <svg
            viewBox="0 0 100 100"
            className="w-full h-full text-voltify-gold/50"
            fill="currentColor"
          >
            {/* V Letter */}
            <path d="M 20 10 L 50 90 L 80 10 L 65 10 L 50 60 L 35 10 Z" />
          </svg>
        </div>
        {/* Text */}
        <p className="text-xs font-semibold tracking-widest text-voltify-light/40 uppercase">
          No Image
        </p>
      </div>
    </div>
  );
}
