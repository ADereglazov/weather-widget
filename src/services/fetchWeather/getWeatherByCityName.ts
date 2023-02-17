import {
  IGetWeatherByCityNameParameters,
  IGetWeatherFetchFailed,
  IGetWeatherResult,
  TGetWeatherFetchSucceed,
} from "./types";

export async function getWeatherByCityName({
  city = "",
  lang = "en",
  units = "metric",
  apiUrl,
  apiKey,
}: IGetWeatherByCityNameParameters): Promise<IGetWeatherResult> {
  const requestUrl = new URL(apiUrl);
  requestUrl.searchParams.set("q", city);
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
