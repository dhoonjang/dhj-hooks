import { RefObject, useCallback, useEffect, useRef } from "react";

export interface CustomEventListenerOptions extends AddEventListenerOptions {
  initExecute?: boolean;
}

export function useWindowEventListener<K extends keyof WindowEventMap>(
  type: K,
  callback: (event?: WindowEventMap[K]) => any,
  options?: CustomEventListenerOptions,
) {
  useEffect(() => {
    if (options && options.initExecute) callback();
    window.addEventListener(type, callback, options);
    return () => window.removeEventListener(type, callback, options);
  }, [callback, options, type]);
}

export function useDocumentEventListener<K extends keyof DocumentEventMap>(
  type: K,
  callback: (event?: DocumentEventMap[K]) => any,
  options?: CustomEventListenerOptions,
) {
  useEffect(() => {
    if (options && options.initExecute) callback();
    document.addEventListener(type, callback, options);
    return () => document.removeEventListener(type, callback, options);
  }, [callback, options, type]);
}

export function useEventListener<T extends HTMLElement = HTMLDivElement>(
  eventName: string,
  handler: (event?: Event) => any,
  ref?: RefObject<T>,
) {
  const savedHandler = useRef<(event?: Event) => any | null>();

  useEffect(() => {
    const targetElement: T | Window = ref?.current || window;

    if (!(targetElement && targetElement.addEventListener)) return;

    if (savedHandler.current !== handler) {
      savedHandler.current = handler;
    }

    const eventListener = (event: Event) => {
      if (!!savedHandler.current) savedHandler.current(event);
    };

    targetElement.addEventListener(eventName, eventListener);

    return () => {
      targetElement.removeEventListener(eventName, eventListener);
    };
  }, [eventName, ref, handler]);
}

export function useOutsideClick(
  callback: (event: MouseEvent) => any,
  ref: React.RefObject<any>,
) {
  const handleOutsideClick = useCallback(
    (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target)) callback(e);
    },
    [callback, ref],
  );

  useEffect(() => {
    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [handleOutsideClick]);
}
