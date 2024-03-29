import { dict } from "@/locales";
import { TLanguage, TUnits } from "@/types";
import {
  IGetWeatherByCityNameParameters,
  IGetWeatherFetchByNameSucceed,
  IGetWeatherFetchFailed,
  TGetWeatherFetchByNameSucceed,
  TGetWeatherByNameResult,
} from "./types";

let controller: AbortController;
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
    if (controller) controller.abort();
    controller = new AbortController();

    const result = await getWeather({
      city,
      lang: props.lang,
      units: props.units,
      apiUrl: props.apiUrl,
      apiKey: props.apiKey,
      signal: controller.signal,
    });

    if (result.status !== "succeed") {
      const message = `${dict[props.lang].oops}, ${result.message}, ${
        dict[props.lang].tryAgain
      }`;
      console.error(message);

      return { location: null, message };
    }

    return { location: result, message: "" };
  } catch (e: unknown) {
    console.error(e);

    if (e instanceof Error && e.name === "AbortError") {
      return { location: null, message: "" };
    }

    const message = `${dict[props.lang].oops}, ${
      dict[props.lang].somethingWentWrong
    }, ${dict[props.lang].tryAgain}`;

    return { location: null, message };
  }
}
async function getWeather({
  city = "",
  lang = "en",
  units = "metric",
  apiUrl,
  apiKey,
  signal,
}: IGetWeatherByCityNameParameters): Promise<TGetWeatherByNameResult> {
  const requestUrl = new URL(`${apiUrl}/find`);
  requestUrl.searchParams.set("q", city);
  requestUrl.searchParams.set("type", "like");
  requestUrl.searchParams.set("lang", lang);
  requestUrl.searchParams.set("units", units);
  requestUrl.searchParams.set("appid", apiKey);
  const response = await fetch(requestUrl.toString(), { signal });

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
  };
}
