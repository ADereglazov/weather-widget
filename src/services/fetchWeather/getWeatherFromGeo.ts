import {
  IGetWeatherFetchFailed,
  TGetWeatherFetchSucceed,
  IGetWeatherFromGeoParameters,
  IGetWeatherResult,
} from "./types";

export async function getWeatherFromGeo({
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
