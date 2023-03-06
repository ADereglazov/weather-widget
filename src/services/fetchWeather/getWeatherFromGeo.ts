import { ICoordinates } from "@/types/coordinates";
import { TLanguage } from "@/types/languages";
import { TUnits } from "@/types/units";
import {
  IGetWeatherFetchFailed,
  TGetWeatherFetchSucceed,
  IGetWeatherFromGeoParameters,
  IGetWeatherResult,
  IGetWeatherSucceed,
} from "./types";

export async function getWeatherFromGeo(
  coordinates: ICoordinates,
  props: {
    lang: TLanguage;
    units: TUnits;
    apiUrl: string;
    apiKey: string;
  }
): Promise<{ location: IGetWeatherSucceed | null; message: string }> {
  try {
    const result = await getWeather({
      coordinates,
      lang: props.lang,
      units: props.units,
      apiUrl: props.apiUrl,
      apiKey: props.apiKey,
    });

    if (result.status !== "succeed") {
      const message = `Oops... ${result.message}, try to press reload button for update widget`;
      console.error(message);

      return { location: null, message };
    }

    return { location: result, message: "" };
  } catch (e) {
    const message =
      "Oops... something went wrong, try to press reload button for update widget";
    console.error(e);

    return { location: null, message };
  }
}
async function getWeather({
  coordinates,
  lang = "en",
  units = "metric",
  apiUrl,
  apiKey,
}: IGetWeatherFromGeoParameters): Promise<IGetWeatherResult> {
  const requestUrl = new URL(apiUrl);
  requestUrl.searchParams.set("lat", String(coordinates.lat));
  requestUrl.searchParams.set("lon", String(coordinates.lon));
  requestUrl.searchParams.set("lang", lang);
  requestUrl.searchParams.set("units", units);
  requestUrl.searchParams.set("appid", apiKey);

  const response = await fetch(requestUrl.toString());

  if (!response.ok) {
    const responseJson: IGetWeatherFetchFailed = await response.json();

    return {
      status: "failed",
      message: responseJson.message || "",
    };
  }

  const responseJson: TGetWeatherFetchSucceed = await response.json();

  return {
    ...responseJson,
    status: "succeed",
    lastUpdated: Date.now(),
  };
}
