import { useCallback, useRef } from "react"

export const useDebounce = <
  RequestFunc extends (...args: any[]) => Promise<any>
>(
  request: RequestFunc,
  delay = 500
): RequestFunc => {
  const timeoutRef = useRef<NodeJS.Timeout>();

  const handleRequest = useCallback(
    (...args: any[]) => {
      clearTimeout(timeoutRef.current!);

      return new Promise((resolve) => {
        timeoutRef.current = setTimeout(() => resolve(request(...args)), delay);
      });
    },
    [delay, request]
  );

  return handleRequest as RequestFunc;
};
