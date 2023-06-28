import { testLocalStorage } from "@/utils";
import { ISettings } from "@/types";

export function getLocalStorageSettings() {
  if (!testLocalStorage()) {
    return null;
  }

  const settingsRaw = localStorage.getItem("settings") || "";

  if (!settingsRaw) return null;

  try {
    return JSON.parse(settingsRaw);
  } catch (e) {
    console.error(e);

    return null;
  }
}
export function setLocalStorageSettings(value: ISettings) {
  if (testLocalStorage()) {
    localStorage.setItem("settings", JSON.stringify(value));
  }
}
