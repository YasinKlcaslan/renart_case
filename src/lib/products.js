export const OUNCE_TO_GRAM = 31.1034768;
export const DEFAULT_GOLD_PRICE_PER_GRAM = 75;

export function computePopularity(popularityScore) {
  const normalized = Math.round(popularityScore * 50) / 10;
  return Number(normalized.toFixed(1));
}

export function computeProduct(product, goldPrice) {
  const priceUSD = (product.popularityScore + 1) * product.weight * goldPrice;

  return {
    ...product,
    priceUSD,
    popularityOutOfFive: computePopularity(product.popularityScore),
  };
}

export function toNumber(value) {
  if (value === null || value === undefined || value === "") {
    return undefined;
  }
  const num = Number(value);
  return Number.isNaN(num) ? undefined : num;
}

export function parseFilters(searchParams) {
  if (!searchParams) {
    return {};
  }

  return {
    minPrice: toNumber(searchParams.get("minPrice")),
    maxPrice: toNumber(searchParams.get("maxPrice")),
    minPopularity: toNumber(searchParams.get("minPopularity")),
    maxPopularity: toNumber(searchParams.get("maxPopularity")),
  };
}

export function applyFilters(items, filters = {}) {
  const {
    minPrice,
    maxPrice,
    minPopularity,
    maxPopularity,
  } = filters;

  return items.filter((product) => {
    if (minPrice !== undefined && product.priceUSD < minPrice) {
      return false;
    }
    if (maxPrice !== undefined && product.priceUSD > maxPrice) {
      return false;
    }
    if (
      minPopularity !== undefined &&
      product.popularityOutOfFive < minPopularity
    ) {
      return false;
    }
    if (
      maxPopularity !== undefined &&
      product.popularityOutOfFive > maxPopularity
    ) {
      return false;
    }
    return true;
  });
}
