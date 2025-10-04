import { COLOR_LABELS, COLOR_SWATCHES } from "../constants/colors";

export function ColorDots({ productName, selectedColor, onSelect, colors }) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-2">
        {colors.map((color) => (
          <button
            key={`${productName}-${color}`}
            type="button"
            aria-label={`${COLOR_LABELS[color] ?? color} seç`}
            onClick={() => onSelect(color)}
            className={`h-4 w-4 rounded-full border border-white shadow transition focus:outline-none focus:ring-2 focus:ring-neutral-300 ${
              selectedColor === color ? "ring-2 ring-offset-2 ring-offset-white" : ""
            }`}
            style={{ backgroundColor: COLOR_SWATCHES[color] ?? "#f0f0f0" }}
          />
        ))}
      </div>
      <span className="font-montserrat text-xs font-medium text-neutral-500">
        {COLOR_LABELS[selectedColor] ?? selectedColor}
      </span>
    </div>
  );
}
