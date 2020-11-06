import {
  RefObject,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";

export * from "./component";

export interface CustomEventListenerOptions extends AddEventListenerOptions {
  initExecute?: boolean;
}

export interface IApiReturn {
  success: boolean;
  error?: any;
}

export function useUpdateFetch<T extends IApiReturn>(
  request: () => Promise<T>,
  maxUpdate?: number
): [T | null, (updateNum?: number) => void] {
  const [update, setUpdate] = useState<number>(1);
  const [res, setRes] = useState<T | null>(null);

  useEffect(() => {
    const requestFunc = async () => {
      const response = await request();
      if (response.success) setRes(response);
    };
    if (update > 0 && (!maxUpdate || maxUpdate > update)) requestFunc();
  }, [update, request, maxUpdate]);

  const updateFunc = useCallback(
    (updateNum?: number) => setUpdate(updateNum ? updateNum : update + 1),
    [update]
  );

  return [res, updateFunc];
}

export function useTimeout() {
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
}

export function useToggle<T>(
  ref: React.RefObject<T>
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

export function useWindowEventListener<K extends keyof WindowEventMap>(
  type: K,
  callback: (event?: WindowEventMap[K]) => any,
  options?: boolean | CustomEventListenerOptions
) {
  useEffect(() => {
    if (options && typeof options !== "boolean" && options.initExecute)
      callback();
    window.addEventListener(type, callback, options);
    return () => window.removeEventListener(type, callback, options);
  }, [callback, options, type]);
}

export function useDocumentEventListener<K extends keyof DocumentEventMap>(
  type: K,
  callback: (event?: DocumentEventMap[K]) => any,
  options?: boolean | CustomEventListenerOptions
) {
  useEffect(() => {
    if (options && typeof options !== "boolean" && options.initExecute)
      callback();
    document.addEventListener(type, callback, options);
    return () => document.removeEventListener(type, callback, options);
  }, [callback, options, type]);
}

export function useEventListener<T extends HTMLElement = HTMLDivElement>(
  eventName: string,
  handler: (event: any) => any,
  element?: RefObject<T>
) {
  // Create a ref that stores handler
  const savedHandler = useRef<(event: any) => any | null>();
  useEffect(() => {
    // Define the listening target
    const targetElement: T | Window = element?.current || window;
    if (!(targetElement && targetElement.addEventListener)) {
      return;
    }
    // Update saved handler if necessary
    if (savedHandler.current !== handler) {
      savedHandler.current = handler;
    }
    // Create event listener that calls handler function stored in ref
    const eventListener = (event: Event) => {
      // eslint-disable-next-line no-extra-boolean-cast
      if (!!savedHandler?.current) {
        savedHandler.current(event);
      }
    };
    targetElement.addEventListener(eventName, eventListener);
    // Remove event listener on cleanup
    return () => {
      targetElement.removeEventListener(eventName, eventListener);
    };
  }, [eventName, element, handler]);
}

export function useOutsideClick(
  callback: (event: MouseEvent) => any,
  ref: React.RefObject<any>
) {
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
}

export function useWindowSize() {
  const isClient = typeof window === "object";

  function getSize() {
    return {
      width: isClient ? window.innerWidth : undefined,
      height: isClient ? window.innerHeight : undefined,
      isSemi: window.innerWidth <= 1560,
    };
  }

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return windowSize;
}

export function useQuadrant(
  parentRef: React.RefObject<any>,
  cwidth: number,
  cheight: number,
  defaultQuadrant: number
) {
  const [quadrant, setQuadrant] = useState(defaultQuadrant);

  const { width, height } = useWindowSize();

  useLayoutEffect(() => {
    if (parentRef.current && width && height) {
      let newQuadrant = quadrant;
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [parentRef, width, height, defaultQuadrant, cwidth, cheight]);

  return quadrant;
}

export function useClientRect<T = Element>(): [
  DOMRect | null,
  (node: T) => void
] {
  const [rect, setRect] = useState<DOMRect | null>(null);

  const ref: (node: T) => void = useCallback((node: T) => {
    if (node !== null && node instanceof Element)
      setRect(node.getBoundingClientRect());
  }, []);

  return [rect, ref];
}

export const useCanvas = (
  canvasRef: React.RefObject<HTMLCanvasElement>,
  func: (
    context: CanvasRenderingContext2D,
    ref: HTMLCanvasElement,
    ...data: any
  ) => void,
  data?: any
) => {
  useEffect(() => {
    const ctx = canvasRef.current?.getContext("2d");
    if (ctx instanceof CanvasRenderingContext2D && canvasRef.current)
      func(ctx, canvasRef.current, data);
  }, [canvasRef, func, data]);
};
