import React from "react";

// Returns the same function without worrying about stale deps
export function useCallbackRef<T extends (...args: any[]) => any>(callback: T): T {
  const callbackRef = React.useRef(callback);

  React.useLayoutEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  return React.useCallback((...args: any[]) => callbackRef.current(...args), []) as T;
}
