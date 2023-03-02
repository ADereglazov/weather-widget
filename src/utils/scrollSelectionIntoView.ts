export default function scrollSelectionIntoView(item: HTMLLIElement) {
  if (item && item.scrollIntoView) {
    item.scrollIntoView(false);
  }
}
