import { testLocalStorage } from "@/utils/testLocalStorage";

export function getLocalStorageWeatherData() {
  if (testLocalStorage()) {
    return JSON.parse(localStorage.getItem("weatherLocations")) || [];
  }
}
export function setLocalStorageWeatherData(value) {
  if (testLocalStorage()) {
    localStorage.setItem("weatherLocations", JSON.stringify(value));
  }
}
