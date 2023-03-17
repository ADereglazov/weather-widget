export function getWindDirection(value = 0) {
  // Array of wind directions abbreviations have only 16 items: indexes from 0 to 15
  const MAX_INDEX_VALUE = 15;
  // Gradation of wind direction in degree
  const gradation = 22.5;
  const index = +(value / gradation).toFixed(0);

  return index > MAX_INDEX_VALUE ? 0 : index;
}
