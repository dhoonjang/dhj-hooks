import {
  RefObject,
  useCallback,
  useEffect,
  useLayoutEffect,
  useState,
} from "react";
import { useOutsideClick } from "./listener";

export const useDomRect = <T extends HTMLElement>(
  ref: RefObject<T>,
): DOMRect | null => {
  const [rect, setRect] = useState(
    ref.current ? ref.current.getBoundingClientRect() : null,
  );

  const handleResize = useCallback(() => {
    if (!ref.current) return;
    setRect(ref.current.getBoundingClientRect());
  }, [ref]);

  useLayoutEffect(() => {
    const element = ref.current;

    if (!element) return;

    handleResize();

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [ref, handleResize]);

  return rect;
};

export function useWindowSize() {
  const isClient = typeof window === "object";

  const getSize = useCallback(() => {
    return {
      width: isClient ? window.innerWidth : undefined,
      height: isClient ? window.innerHeight : undefined,
    };
  }, [isClient]);

  const [windowSize, setWindowSize] = useState(getSize);

  useLayoutEffect(() => {
    if (!isClient) return;

    function handleResize() {
      setWindowSize(getSize());
    }

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [isClient, getSize]);

  return windowSize;
}

export function useQuadrant<T extends HTMLElement>(
  parentRef: React.RefObject<T>,
  cwidth: number,
  cheight: number,
  defaultQuadrant: 1 | 2 | 3 | 4,
) {
  const [quadrant, setQuadrant] = useState<1 | 2 | 3 | 4>(defaultQuadrant);

  const { width, height } = useWindowSize();

  const parentRect = useDomRect(parentRef);

  useLayoutEffect(() => {
    if (parentRect && width && height) {
      let newQuadrant = quadrant;

      if (parentRect.x + cwidth > width) {
        if (newQuadrant === 1) newQuadrant = 4;
        else if (newQuadrant === 2) newQuadrant = 3;
      }

      if (parentRect.y + cheight > height) {
        if (newQuadrant === 3) newQuadrant = 2;
        else if (newQuadrant === 4) newQuadrant = 1;
      }

      setQuadrant(newQuadrant);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [parentRect, width, height, defaultQuadrant, cwidth, cheight]);

  return quadrant;
}

export const useCanvas2D = (
  canvasRef: React.RefObject<HTMLCanvasElement>,
  func: (
    context: CanvasRenderingContext2D,
    ref: HTMLCanvasElement,
    ...data: any
  ) => void,
  data?: any,
) => {
  useEffect(() => {
    const ctx = canvasRef.current?.getContext("2d");
    if (ctx instanceof CanvasRenderingContext2D && canvasRef.current)
      func(ctx, canvasRef.current, data);
  }, [canvasRef, func, data]);
};

export function useToggle<T>(
  ref: React.RefObject<T>,
): [boolean, (b?: boolean) => void] {
  const [state, setState] = useState<boolean>(false);

  useOutsideClick(() => setState(false), ref);

  return [
    state,
    (bool?: boolean) => {
      if (bool) setState(bool);
      else setState(!state);
    },
  ];
}
