import { useRef } from "react";

export function useSwipeableList({ onSwipedLeft, onSwipedRight }) {
  const swipeState = useRef({
    isSwiping: false,
    startX: 0,
  });

  const getPoint = (event) => {
    if (event.touches && event.touches.length > 0) {
      return event.touches[0].clientX;
    }
    if (event.changedTouches && event.changedTouches.length > 0) {
      return event.changedTouches[0].clientX;
    }
    return event.clientX;
  };

  const onPointerDown = (event) => {
    if (event.target?.closest?.("button")) {
      swipeState.current = { isSwiping: false, startX: 0 };
      return;
    }
    swipeState.current = {
      isSwiping: true,
      startX: getPoint(event),
    };
  };

  const onPointerEnd = (event) => {
    if (!swipeState.current.isSwiping) return;
    const delta = getPoint(event) - swipeState.current.startX;
    swipeState.current = { isSwiping: false, startX: 0 };

    if (Math.abs(delta) < 40) return;
    if (delta < 0) {
      onSwipedLeft?.();
    } else {
      onSwipedRight?.();
    }
  };

  return {
    onPointerDown,
    onPointerUp: onPointerEnd,
    onTouchStart: onPointerDown,
    onTouchEnd: onPointerEnd,
  };
}
