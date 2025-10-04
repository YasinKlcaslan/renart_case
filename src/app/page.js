"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { ProductCard } from "../components/ProductCard";
import { useResponsiveItems } from "../hooks/useResponsiveItems";
import { useSwipeableList } from "../hooks/useSwipeableList";
import { COLOR_LABELS, COLOR_SWATCHES } from "../constants/colors";
import { formatCurrency } from "../lib/format";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [meta, setMeta] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [selectedColors, setSelectedColors] = useState({});

  const itemsPerView = useResponsiveItems();

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/products", { cache: "no-store" });
      if (!response.ok) {
        throw new Error("Products could not be loaded");
      }
      const payload = await response.json();
      setProducts(payload.data ?? []);
      setMeta(payload.meta ?? null);
      setActiveIndex(0);
      setError(null);
    } catch (err) {
      console.error(err);
  setError("Something went wrong. Please try again later.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  useEffect(() => {
    if (!products.length) {
      setSelectedColors({});
      return;
    }
    setSelectedColors((current) => {
      const next = { ...current };
      products.forEach((product) => {
        if (!next[product.name]) {
          next[product.name] =
            product.colors?.[0] ?? Object.keys(product.images)[0];
        }
      });
      return next;
    });
  }, [products]);

  useEffect(() => {
    const maxIndex = Math.max(products.length - itemsPerView, 0);
    if (activeIndex > maxIndex) {
      setActiveIndex(maxIndex);
    }
  }, [itemsPerView, products, activeIndex]);

  const handleColorChange = useCallback((productName, color) => {
    setSelectedColors((current) => ({ ...current, [productName]: color }));
  }, []);

  const maxIndex = Math.max(products.length - itemsPerView, 0);

  const goToPrev = () => {
    setActiveIndex((index) => Math.max(index - 1, 0));
  };

  const goToNext = () => {
    setActiveIndex((index) => Math.min(index + 1, maxIndex));
  };

  const swipeHandlers = useSwipeableList({
    onSwipedLeft: goToNext,
    onSwipedRight: goToPrev,
  });

  const itemWidth = 100 / itemsPerView;

  const cards = useMemo(
    () =>
      products.map((product) => {
        const color =
          selectedColors[product.name] ??
          product.colors?.[0] ??
          Object.keys(product.images)[0];

        const availableColors = product.colors?.length
          ? product.colors
          : Object.keys(product.images ?? {});

        return (
          <div
            key={product.name}
            className="flex-shrink-0 px-3"
            style={{ flexBasis: `${itemWidth}%` }}
          >
            <ProductCard
              product={product}
              color={color}
              availableColors={availableColors}
              onColorChange={(newColor) => handleColorChange(product.name, newColor)}
            />
          </div>
        );
      }),
    [products, selectedColors, itemWidth, handleColorChange]
  );

  const progress = maxIndex === 0 ? 1 : activeIndex / maxIndex;

  return (
    <main className="min-h-screen bg-[#f6f6f6] pb-24">
      <section className="mx-auto flex w-full max-w-7xl flex-col gap-12 px-6 pt-20 sm:px-10 lg:px-12">
        <header className="flex flex-col items-center gap-6 text-center">
          <div className="flex w-full flex-col items-center gap-3">
            <div className="flex w-full max-w-4xl items-center gap-4">
              <div className="h-px flex-grow bg-neutral-300" />
              <h1 className="font-avenir text-3xl font-semibold tracking-wide text-neutral-800 sm:text-4xl">
                Product List
              </h1>
              <div className="h-px flex-grow bg-neutral-300" />
            </div>
            <p className="font-montserrat text-xs uppercase tracking-[0.4em] text-neutral-400">
              Avenir · Book · 45
            </p>
          </div>
          {meta?.goldPricePerGram ? (
            <p className="font-montserrat text-xs text-neutral-500">
              Live gold price: {formatCurrency.format(meta.goldPricePerGram)} / gram
            </p>
          ) : null}
        </header>

        {loading ? (
          <div className="flex h-64 items-center justify-center rounded-3xl border border-dashed border-neutral-200 bg-white/60 text-neutral-500">
            Loading products...
          </div>
        ) : error ? (
          <div className="flex h-64 flex-col items-center justify-center gap-3 rounded-3xl border border-rose-200 bg-rose-50 text-rose-700">
            <p className="font-medium">{error}</p>
            <button
              className="rounded-full border border-neutral-300 px-4 py-2 text-sm text-neutral-700"
              onClick={() => {
                setError(null);
                fetchProducts();
              }}
            >
              Try again
            </button>
          </div>
        ) : products.length === 0 ? (
          <div className="flex h-64 items-center justify-center rounded-3xl border border-neutral-200 bg-white/60 text-neutral-500">
            No products available at the moment.
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            <div className="relative">
              <button
                type="button"
                onClick={goToPrev}
                className="absolute left-0 top-1/2 z-10 hidden -translate-y-1/2 items-center justify-center rounded-full border border-neutral-200 bg-white/90 p-3 text-neutral-600 shadow-lg transition hover:-translate-x-1 hover:text-neutral-900 sm:flex"
                aria-label="Previous products"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-5 w-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 18l-6-6 6-6" />
                </svg>
              </button>
              <button
                type="button"
                onClick={goToNext}
                className="absolute right-0 top-1/2 z-10 hidden -translate-y-1/2 items-center justify-center rounded-full border border-neutral-200 bg-white/90 p-3 text-neutral-600 shadow-lg transition hover:translate-x-1 hover:text-neutral-900 sm:flex"
                aria-label="Next products"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-5 w-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 6l6 6-6 6" />
                </svg>
              </button>

              <div
                className="overflow-hidden"
                {...swipeHandlers}
              >
                <div
                  className="flex -mx-3 transition-transform duration-500 ease-out"
                  style={{ transform: `translateX(-${activeIndex * itemWidth}%)` }}
                >
                  {cards}
                </div>
              </div>
            </div>

            <div className="font-montserrat mx-auto flex w-full max-w-xl flex-col gap-2">
              <div className="flex h-1.5 w-full items-center rounded-full bg-neutral-200">
                <div
                  className="h-full rounded-full bg-neutral-700 transition-all duration-300"
                  style={{ width: `${progress * 100}%` }}
                />
              </div>
              <div className="flex flex-wrap justify-center gap-4 text-xs text-neutral-400">
                <div className="flex items-center gap-2">
                  <span className="h-3 w-3 rounded-full border border-neutral-300 bg-white" />
                  <span>Click</span>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className="h-3 w-3 rounded-full border border-neutral-300"
                    style={{ backgroundColor: COLOR_SWATCHES.yellow }}
                  />
                  <span>
                    {COLOR_LABELS.yellow} ({COLOR_SWATCHES.yellow.toUpperCase()})
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className="h-3 w-3 rounded-full border border-neutral-300"
                    style={{ backgroundColor: COLOR_SWATCHES.white }}
                  />
                  <span>
                    {COLOR_LABELS.white} ({COLOR_SWATCHES.white.toUpperCase()})
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className="h-3 w-3 rounded-full border border-neutral-300"
                    style={{ backgroundColor: COLOR_SWATCHES.rose }}
                  />
                  <span>
                    {COLOR_LABELS.rose} ({COLOR_SWATCHES.rose.toUpperCase()})
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}
