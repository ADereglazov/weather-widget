import { testLocalStorage } from "@/utils/testLocalStorage";
import { IWeatherLocationTimestamped } from "@/types/weatherLocation";

export function getLocalStorageWeatherData(): IWeatherLocationTimestamped[] {
  if (!testLocalStorage()) {
    return [];
  }

  const weatherLocationsRaw = localStorage.getItem("weatherLocations") || "";

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
