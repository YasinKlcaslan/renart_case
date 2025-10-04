import { NextResponse } from "next/server";
import products from "../../data/products.json";
import {
  DEFAULT_GOLD_PRICE_PER_GRAM,
  OUNCE_TO_GRAM,
  applyFilters,
  computeProduct,
  parseFilters,
} from "../../../lib/products";

const GOLD_PRICE_API_URL = "https://data-asg.goldprice.org/dbXRates/USD";
const GOLD_CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

function getCache() {
  if (!globalThis.__goldPriceCache) {
    globalThis.__goldPriceCache = { timestamp: 0, price: DEFAULT_GOLD_PRICE_PER_GRAM };
  }
  return globalThis.__goldPriceCache;
}

async function fetchGoldPricePerGram() {
  const cache = getCache();
  const now = Date.now();
  if (now - cache.timestamp < GOLD_CACHE_TTL_MS && cache.price) {
    return cache.price;
  }

  try {
    const response = await fetch(GOLD_PRICE_API_URL, {
      headers: {
        "User-Agent": "renart-product-app",
        Accept: "application/json",
      },
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(`Gold price request failed with status ${response.status}`);
    }

    const data = await response.json();
    const ouncePrice = Number(data?.items?.[0]?.xauPrice);

    if (!ouncePrice || Number.isNaN(ouncePrice)) {
      throw new Error("Gold price API returned an invalid value");
    }

    const pricePerGram = ouncePrice / OUNCE_TO_GRAM;
    cache.price = pricePerGram;
    cache.timestamp = now;
    return pricePerGram;
  } catch (error) {
    console.error("Failed to fetch live gold price:", error);
    if (cache.price) {
      return cache.price;
    }
    return DEFAULT_GOLD_PRICE_PER_GRAM;
  }
}

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(request) {
  const goldPricePerGram = await fetchGoldPricePerGram();
  const enhancedProducts = products.map((product) =>
    computeProduct(product, goldPricePerGram)
  );
  const filters = parseFilters(request.nextUrl.searchParams);
  const filteredProducts = applyFilters(enhancedProducts, filters);

  const response = {
    data: filteredProducts.map((product) => ({
      ...product,
      priceUSD: Number(product.priceUSD.toFixed(2)),
      popularityOutOfFive: Number(product.popularityOutOfFive.toFixed(1)),
      colors: Object.keys(product.images),
    })),
    meta: {
      total: enhancedProducts.length,
      count: filteredProducts.length,
      goldPricePerGram: Number(goldPricePerGram.toFixed(2)),
      filters: Object.fromEntries(request.nextUrl.searchParams.entries()),
    },
  };

  return NextResponse.json(response, {
    headers: {
      "Cache-Control": "no-store, must-revalidate",
    },
  });
}
