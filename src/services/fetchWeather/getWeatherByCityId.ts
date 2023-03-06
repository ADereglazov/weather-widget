import { IGetWeatherSucceed } from "@/services/fetchWeather";
import { TLanguage } from "@/types/languages";
import { TUnits } from "@/types/units";
import {
  IGetWeatherByCityIdParameters,
  IGetWeatherFetchFailed,
  IGetWeatherResult,
  TGetWeatherFetchSucceed,
} from "./types";

export async function getWeatherByCityId(
  cityId: number,
  props: {
    lang: TLanguage;
    units: TUnits;
    apiUrl: string;
    apiKey: string;
  }
): Promise<{ result: IGetWeatherSucceed | null; message: string }> {
  try {
    const result = await getWeather({
      id: cityId,
      lang: props.lang,
      units: props.units,
      apiUrl: props.apiUrl,
      apiKey: props.apiKey,
    });

    if (result.status !== "succeed") {
      const message = `Oops... ${result.message}, try again`;
      console.error(message);

      return { result: null, message };
    }

    return { result, message: "" };
  } catch (e) {
    const message = "Oops... something went wrong, try again";
    console.error(e);

    return { result: null, message };
  }
}
async function getWeather({
  id,
  lang = "en",
  units = "metric",
  apiUrl,
  apiKey,
}: IGetWeatherByCityIdParameters): Promise<IGetWeatherResult> {
  const requestUrl = new URL(apiUrl);
  requestUrl.searchParams.set("id", String(id));
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
