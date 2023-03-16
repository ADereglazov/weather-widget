import { dict } from "@/locales";
import { TLanguage, TUnits } from "@/types";
import {
  IGetWeatherByCityNameParameters,
  IGetWeatherFetchFailed,
  TGetWeatherFetchByNameSucceed,
  TGetWeatherByNameResult,
  IGetWeatherFetchByNameSucceed,
} from "./types";

export async function getWeatherByCityName(
  city: string,
  props: {
    lang: TLanguage;
    units: TUnits;
    apiUrl: string;
    apiKey: string;
  }
): Promise<{
  location: IGetWeatherFetchByNameSucceed | null;
  message: string;
}> {
  try {
    const result = await getWeather({
      city,
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
  city = "",
  lang = "en",
  units = "metric",
  apiUrl,
  apiKey,
}: IGetWeatherByCityNameParameters): Promise<TGetWeatherByNameResult> {
  const requestUrl = new URL(`${apiUrl}/find/`);
  requestUrl.searchParams.set("q", city);
  requestUrl.searchParams.set("type", "like");
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

  const responseJson: TGetWeatherFetchByNameSucceed = await response.json();

  return {
    ...responseJson,
    status: "succeed",
    lastUpdated: Date.now(),
  };
}
