import React from "react";

import { useCallbackRef } from "./useCallbackRef";
import { useIsMounted } from "./useIsMounted";

export type AsyncFunction = (...args: any[]) => Promise<any>;

export type AsyncState<T> =
  | {
      loading: boolean;
      error?: undefined;
      data?: undefined;
    }
  | {
      loading: true;
      error?: Error | undefined;
      data?: T;
    }
  | {
      loading: false;
      error: Error;
      data?: undefined;
    }
  | {
      loading: false;
      error?: undefined;
      data: T;
    };

type StateFromAsyncFunction<T extends AsyncFunction> = AsyncState<Awaited<ReturnType<T>>>;

type ResetStateFunction<T extends AsyncFunction> = (
  defaultState?: StateFromAsyncFunction<T>,
) => void;

type CancelFunction = () => void;

export type AsyncFnReturn<T extends AsyncFunction = AsyncFunction> = [
  StateFromAsyncFunction<T> & { reset: ResetStateFunction<T>; cancel: CancelFunction },
  T,
];

export function useAsyncFn<T extends AsyncFunction>(
  fn: T,
  initialState: StateFromAsyncFunction<T> = { loading: false },
): AsyncFnReturn<T> {
  const lastCallId = React.useRef(0);
  const isMounted = useIsMounted();
  const [state, set] = React.useState<StateFromAsyncFunction<T>>(initialState);

  const callback = useCallbackRef((...args: Parameters<T>): ReturnType<T> => {
    const callId = ++lastCallId.current;

    set((prevState) => ({ ...prevState, loading: true }));

    return fn(...args).then(
      (data) => {
        if (isMounted() && callId === lastCallId.current) {
          set({ data, loading: false });
        }

        return data;
      },
      (error) => {
        if (isMounted() && callId === lastCallId.current) {
          set({ error, loading: false });
        }

        throw error;
      },
    ) as ReturnType<T>;
  });

  const reset = React.useCallback(
    (defaultState = { loading: false } as StateFromAsyncFunction<T>) => {
      set(defaultState);
    },
    [],
  );

  const cancel = React.useCallback(() => {
    lastCallId.current++;
    set({ loading: false });
  }, []);

  return [
    {
      ...state,
      cancel,
      reset,
    },
    callback as unknown as T,
  ];
}
