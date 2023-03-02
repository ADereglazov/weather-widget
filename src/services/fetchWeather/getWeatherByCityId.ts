import {
  IGetWeatherByCityIdParameters,
  IGetWeatherFetchFailed,
  IGetWeatherResult,
  TGetWeatherFetchSucceed,
} from "./types";

export async function getWeatherByCityId({
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
