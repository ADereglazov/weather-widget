let isLocalStorageAvailable: boolean;

export function testLocalStorage() {
  if (isLocalStorageAvailable !== undefined) {
    return isLocalStorageAvailable;
  }

  isLocalStorageAvailable = test();
  return isLocalStorageAvailable;
}
function test() {
  const test = "test";
  try {
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    return true;
  } catch (e) {
    return false;
  }
}
