export { default as retry } from "async-retry";

export function sleep(delay: number): Promise<void> {
  return new Promise<void>((resolve) => setTimeout(resolve, delay));
}

export function nextFrame(): Promise<void> {
  return new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));
}

export function concurrentAsync<T>(cbs: ((...args: any[]) => Promise<T>)[], limit = 100) {
  const queue = [...cbs];
  const results: T[] = [];
  const workers = Array.from({ length: limit });

  function cancel() {
    queue.length = 0;
  }

  async function run() {
    while (queue.length) {
      const index = cbs.length - queue.length;
      const next = queue.shift();

      if (next) {
        const result = await next();
        results[index] = result;
      }
    }
  }

  async function promise() {
    await Promise.all(workers.map(run));

    return results;
  }

  return { promise, cancel };
}

export function throttleAsync<Args extends any[], P extends (...args: Args) => Promise<any>>(
  cb: P,
  limit = 100,
) {
  let i = 0;
  const queue: {
    args: Args;
    resolve: (value?: any) => void;
    reject: (err?: Error) => void;
  }[] = [];

  async function run(args: Args) {
    try {
      i++;
      // Await the result so the finally block is called AFTER
      const result = await cb(...args);
      return result;
    } finally {
      i--;
      next();
    }
  }

  function next() {
    if (queue.length) {
      const { args, resolve, reject } = queue.shift()!;

      run(args).then(resolve, reject);
    }
  }

  const throttledCallback = async function concurrentCallback(...args: Args) {
    if (i > limit - 1) {
      return new Promise((resolve, reject) => {
        queue.push({
          args,
          resolve,
          reject,
        });
      });
    }

    return run(args);
  };

  throttledCallback.cancel = () => {
    queue.length = 0;
  };

  return throttledCallback;
}

/**
 * Just a way to say explicitly that the promise is not awaited on purpose
 */
export function dontAwait(promise: Promise<any> | undefined): void {
  promise?.catch(console.error);
}

export function attachAbortSignalToController(
  signal: AbortSignal,
  controller: AbortController,
): AbortController {
  if (signal.aborted) {
    controller.abort(signal.reason);
  } else {
    signal.addEventListener("abort", function () {
      controller.abort(this.reason);
    });
  }

  return controller;
}
