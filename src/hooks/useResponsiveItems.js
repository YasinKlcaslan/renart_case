import { useEffect, useState } from "react";

const BREAKPOINTS = [
  { media: "(min-width: 1280px)", value: 4 },
  { media: "(min-width: 1024px)", value: 3 },
  { media: "(min-width: 640px)", value: 2 },
];

export function useResponsiveItems() {
  const [itemsPerView, setItemsPerView] = useState(1);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const resolveValue = () => {
      for (const { media, value } of BREAKPOINTS) {
        if (window.matchMedia(media).matches) {
          return value;
        }
      }
      return 1;
    };

    const update = () => {
      setItemsPerView(resolveValue());
    };

    update();

    const listeners = BREAKPOINTS.map(({ media }) => {
      const mql = window.matchMedia(media);
      const handler = () => update();
      mql.addEventListener("change", handler);
      return { mql, handler };
    });

    return () => {
      listeners.forEach(({ mql, handler }) => {
        mql.removeEventListener("change", handler);
      });
    };
  }, []);

  return itemsPerView;
}
