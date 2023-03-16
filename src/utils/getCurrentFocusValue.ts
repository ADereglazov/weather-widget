import { ICitiListItem } from "@/types/weatherLocationsList";

export function getCurrentFocusValue(cityId: number, list: ICitiListItem[]) {
  const currentCityIndex = list.findIndex((item) => item.id === cityId);
  return ~currentCityIndex ? currentCityIndex : 0;
}
