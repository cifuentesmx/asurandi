import { Boom } from "@hapi/boom";

export const delay = (ms: number) => delayCancellable(ms).delay;

export const delayCancellable = (ms: number) => {
  const stack = new Error().stack;
  let timeout: NodeJS.Timeout;
  let reject: (error: any) => void;
  const delay: Promise<void> = new Promise((resolve, _reject) => {
    timeout = setTimeout(resolve, ms + Math.floor(Math.random() * 500));
    reject = _reject;
  });
  const cancel = () => {
    clearTimeout(timeout);
    reject(
      new Boom("Cancelled", {
        statusCode: 500,
        data: {
          stack,
        },
      })
    );
  };

  return { delay, cancel };
};
