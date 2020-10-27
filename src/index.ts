import { useCallback, useEffect, useLayoutEffect, useState } from "react";

export const useTimeout = () => {
  const [to, setTo] = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (to) clearTimeout(to);
    };
  }, [to]);

  return (callback: (...args: any[]) => void, ms: number) => {
    const to = setTimeout(callback, ms);
    setTo(to);
  };
};

export const useToggle = <T>(
  ref: React.RefObject<T>
): [boolean, (b?: boolean) => void] => {
  const [state, setState] = useState<boolean>(false);

  useOutsideClick(() => setState(false), ref);

  return [
    state,
    (bool?: boolean) => {
      if (bool) setState(bool);
      else setState(!state);
    },
  ];
};

export const useKeyDown = (callback: (event: Event) => any) => {
  useEffect(() => {
    window.addEventListener("keydown", callback);
    return () => window.removeEventListener("keydown", callback);
  }, [callback]);
};

export const useKeyUp = (callback: (event: Event) => any) => {
  useEffect(() => {
    window.addEventListener("keyup", callback);
    return () => window.removeEventListener("keyup", callback);
  }, [callback]);
};

export const useScroll = (callback: (event: Event) => void) => {
  useEffect(() => {
    document.addEventListener("scroll", callback);
    return () => document.removeEventListener("scroll", callback);
  }, [callback]);
};

export const useFullscreenChange = (callback: () => void) => {
  useEffect(() => {
    callback();
    document.addEventListener("fullscreenchange", callback);
    return () => document.removeEventListener("fullscreenchange", callback);
  }, [callback]);
};

export const useOutsideClick = (
  callback: (event: MouseEvent) => any,
  ref: React.RefObject<any>
) => {
  const handleOutsideClick = useCallback(
    (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target)) callback(e);
    },
    [callback, ref]
  );

  useEffect(() => {
    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [handleOutsideClick]);
};

export const useWindowSize = () => {
  const isClient = typeof window === "object";

  function getSize() {
    return {
      width: isClient ? window.innerWidth : undefined,
      height: isClient ? window.innerHeight : undefined,
      isSemi: window.innerWidth <= 1560,
    };
  }

  const [windowSize, setWindowSize] = useState(getSize);

  useEffect(() => {
    if (!isClient) return;

    function handleResize() {
      setWindowSize(getSize());
    }

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
    // eslint-disable-next-line
  }, []);

  return windowSize;
};

export const useQuadrant = (
  parentRef: React.RefObject<any>,
  cwidth: number,
  cheight: number,
  defaultQuadrant: number
) => {
  const [quadrant, setQuadrant] = useState(defaultQuadrant);

  const { width, height } = useWindowSize();

  useLayoutEffect(() => {
    if (parentRef.current && width && height) {
      let newQuadrant = defaultQuadrant;
      const { x, y } = parentRef.current.getBoundingClientRect();

      if (x + cwidth > width) {
        if (newQuadrant === 1) newQuadrant = 4;
        else if (newQuadrant === 2) newQuadrant = 3;
      }

      if (y + cheight > height) {
        if (newQuadrant === 3) newQuadrant = 2;
        else if (newQuadrant === 4) newQuadrant = 1;
      }

      setQuadrant(newQuadrant);
    }
  }, [parentRef, width, height, defaultQuadrant, cwidth, cheight]);

  return quadrant;
};
