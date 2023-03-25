import { TDirection, DIRECTIONS } from "@/types";

export function getWindDirection(value = 0): TDirection {
  // Array of wind directions abbreviations have only 16 items: indexes from 0 to 15
  const MAX_INDEX_VALUE = 15;
  // Gradation of wind direction in degree
  const gradation = 22.5;
  // Calculate element's index for wind directions array
  let index = +((value % 360) / gradation).toFixed(0);
  index = index > MAX_INDEX_VALUE ? 0 : index;

  return DIRECTIONS[index];
}
