import { useCallback, useEffect, useState } from "react";

export function useUpdateFetch<T>(
  request: () => Promise<T>,
  maxUpdate?: number,
): [T | null, (updateNum?: number) => void] {
  const [update, setUpdate] = useState<number>(1);
  const [res, setRes] = useState<T | null>(null);

  useEffect(() => {
    const requestFunc = async () => {
      const response = await request();
      setRes(response);
    };
    if (update > 0 && (!maxUpdate || maxUpdate > update)) requestFunc();
  }, [update, request, maxUpdate]);

  const updateFunc = useCallback(
    (updateNum?: number) => setUpdate(updateNum ? updateNum : update + 1),
    [update],
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
