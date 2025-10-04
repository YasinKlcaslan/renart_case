import { COLOR_LABELS, COLOR_SWATCHES } from "../constants/colors";

export function ColorDots({
  productName,
  selectedColor,
  onSelect,
  colors = [],
}) {
  const availableColors = Array.isArray(colors) ? colors : [];
  const safeLabel = COLOR_LABELS[selectedColor] ?? selectedColor ?? "Unknown";

  const handleSelect = (color) => {
    if (typeof onSelect === "function") {
      onSelect(color);
    }
  };

  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-2">
        {availableColors.length > 0 ? (
          availableColors.map((color) => (
            <button
              key={`${productName}-${color}`}
              type="button"
              aria-label={`Select ${COLOR_LABELS[color] ?? color}`}
              onClick={() => handleSelect(color)}
              className={`h-4 w-4 rounded-full border border-white shadow transition focus:outline-none focus:ring-2 focus:ring-neutral-300 ${
                selectedColor === color
                  ? "ring-2 ring-offset-2 ring-offset-white"
                  : ""
              }`}
              style={{ backgroundColor: COLOR_SWATCHES[color] ?? "#f0f0f0" }}
            />
          ))
        ) : (
          <span className="font-montserrat text-xs text-neutral-400">
            No color options available.
          </span>
        )}
      </div>
      <span className="font-montserrat text-xs font-medium text-neutral-500">
        {safeLabel}
      </span>
    </div>
  );
}
