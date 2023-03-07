import cityList from "@/assets/city-list.min.json";
import { ICitiListItem } from "@/types/cityList";

export function findSuggestionCities(input: string) {
  const searchString = input
    .trim()
    .toLowerCase()
    .replace(
      /(\w+) (\w+)/,
      (match: string, firstWord: string, secondWord: string) =>
        `${firstWord}, ${secondWord}`
    );

  return cityList.filter((item: ICitiListItem) =>
    `${item.name}, ${item.country}`.toLowerCase().includes(searchString)
  );
}
