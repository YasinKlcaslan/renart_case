import Image from "next/image";
import { ColorDots } from "./ColorDots";
import { StarRating } from "./StarRating";
import { formatCurrency } from "../lib/format";

export function ProductCard({ product, color, availableColors, onColorChange }) {
  const imageUrl = product.images[color] ?? Object.values(product.images)[0];

  return (
    <article className="flex h-full flex-col gap-4 rounded-3xl border border-neutral-200 bg-white p-6 shadow-[0_12px_30px_rgba(0,0,0,0.05)] transition hover:-translate-y-1 hover:shadow-[0_16px_40px_rgba(0,0,0,0.08)]">
      <div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-neutral-100">
        <Image
          src={imageUrl}
          alt={`${product.name} - ${color}`}
          fill
          className="object-cover object-center"
          sizes="(min-width: 1280px) 20vw, (min-width: 1024px) 26vw, (min-width: 640px) 45vw, 80vw"
        />
      </div>
      <div className="flex flex-col gap-2">
        <h3 className="font-avenir text-sm font-semibold tracking-wide text-neutral-800">
          {product.name}
        </h3>
        <p className="font-montserrat text-sm text-neutral-500">
          {formatCurrency.format(product.priceUSD)} USD
        </p>
      </div>
      <ColorDots
        productName={product.name}
        selectedColor={color}
        onSelect={onColorChange}
        colors={availableColors}
      />
      <StarRating value={product.popularityOutOfFive} />
    </article>
  );
}
