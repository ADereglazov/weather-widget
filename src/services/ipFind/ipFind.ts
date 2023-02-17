import { IIpFindData, TIpFindResult } from "./types";

export function ipFind(): Promise<TIpFindResult> {
  return fetch("https://ipapi.co/json/")
    .then((response) => response.json())
    .then((data: IIpFindData) => {
      return {
        lat: data.latitude,
        lon: data.longitude,
      };
    })
    .catch((e) => {
      console.error(e);

      throw e;
    });
}
