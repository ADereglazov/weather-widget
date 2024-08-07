export function debounce<T extends (...args: never[]) => void>(
  callee: T,
  timeout: number
): (...args: Parameters<T>) => void {
  let lastCall: number | undefined;
  let lastCallTimer: number | undefined;

  return function perform(...args: Parameters<T>): void {
    const previousCall = lastCall;

    lastCall = Date.now();

    if (previousCall && lastCall - previousCall <= timeout) {
      clearTimeout(lastCallTimer);
    }

    lastCallTimer = setTimeout(() => callee(...args), timeout);
  };
}
