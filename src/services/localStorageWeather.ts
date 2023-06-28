import { testLocalStorage } from "@/utils";
import { IWeatherLocationTimestamped } from "@/types";

export function getLocalStorageWeatherData(): IWeatherLocationTimestamped[] {
  if (!testLocalStorage()) {
    return [];
  }

  const weatherLocationsRaw = localStorage.getItem("weatherLocations") || "";

  if (!weatherLocationsRaw) return [];

  try {
    return JSON.parse(weatherLocationsRaw);
  } catch (e) {
    console.error(e);

    return [];
  }
}
export function setLocalStorageWeatherData(
  value: IWeatherLocationTimestamped[]
) {
  if (testLocalStorage()) {
    localStorage.setItem("weatherLocations", JSON.stringify(value));
  }
}
