"use client";

import React from "react";

import { useWindows } from "./context";

type RenderComponentCallback<T, P> = (
  res: (res?: T) => void,
  rej: (reason?: any) => void,
  props: P,
) => React.ReactNode;

interface AsyncWindowOptions {
  closeOnUnmount?: boolean;
}

export function useAsyncWindow<T, P = any>(
  renderComponent: RenderComponentCallback<T, P>,
  options: AsyncWindowOptions = {},
) {
  const { setWindows } = useWindows();
  const renderComponentRef = React.useRef(renderComponent);
  const close = React.useRef<Function>();
  const { closeOnUnmount = true } = options;

  React.useEffect(() => {
    renderComponentRef.current = renderComponent;
  }, [renderComponent]);

  React.useEffect(() => {
    return () => {
      if (closeOnUnmount && close.current) {
        close.current();
      }
    };
  }, [closeOnUnmount]);

  const showComponent = React.useCallback(
    async (props: P) => {
      let result: T;
      const id = `${Date.now()}`;

      try {
        result = await new Promise<T>((resolve, reject) => {
          const component = renderComponentRef.current(resolve as any, reject, props);
          setWindows((windows) => ({ ...windows, [id]: component }));

          close.current = resolve;
        });
      } finally {
        setWindows((windows) => {
          const newWindows = { ...windows };
          delete newWindows[id];
          return newWindows;
        });
      }

      return result;
    },
    [setWindows],
  );

  return showComponent;
}

export function useCloseAllAsyncWindows() {
  const { setWindows } = useWindows();

  return React.useCallback(() => {
    setWindows({});
  }, [setWindows]);
}
