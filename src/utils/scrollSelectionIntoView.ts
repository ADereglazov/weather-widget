export function scrollSelectionIntoView(item: HTMLElement) {
  if (item && item.scrollIntoView) {
    item.scrollIntoView(false);
  }
}
