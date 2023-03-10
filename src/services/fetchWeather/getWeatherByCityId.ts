import { IGetWeatherSucceed } from "@/services/fetchWeather";
import { TLanguage } from "@/types/languages";
import { TUnits } from "@/types/units";
import {
  IGetWeatherByCityIdParameters,
  IGetWeatherFetchFailed,
  IGetWeatherResult,
  TGetWeatherFetchSucceed,
} from "./types";
import { dict } from "@/locales";

export async function getWeatherByCityId(
  cityId: number,
  props: {
    lang: TLanguage;
    units: TUnits;
    apiUrl: string;
    apiKey: string;
  }
): Promise<{ location: IGetWeatherSucceed | null; message: string }> {
  try {
    const result = await getWeather({
      id: cityId,
      lang: props.lang,
      units: props.units,
      apiUrl: props.apiUrl,
      apiKey: props.apiKey,
    });

    if (result.status !== "succeed") {
      const message = `${dict[props.lang].oops}, ${result.message}, ${
        dict[props.lang].tryAgain
      }`;
      console.error(message);

      return { location: null, message };
    }

    return { location: result, message: "" };
  } catch (e) {
    const message = `${dict[props.lang].oops}, ${
      dict[props.lang].somethingWentWrong
    }, ${dict[props.lang].tryAgain}`;
    console.error(e);

    return { location: null, message };
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
