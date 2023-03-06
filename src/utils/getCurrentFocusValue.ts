import { ICitiListItem } from "@/types/cityList";

export function getCurrentFocusValue(cityId: number, list: ICitiListItem[]) {
  const currentCityIndex = list.findIndex((item) => item.id === cityId);
  return ~currentCityIndex ? currentCityIndex : 0;
}
