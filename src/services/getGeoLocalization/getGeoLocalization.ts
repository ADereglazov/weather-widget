import { ipFind } from "@/services/ipFind";
import { geoFind } from "@/services/geoFind";
import { TGetGeoLocalizationResult } from "./types";

export async function getGeoLocalization(): Promise<TGetGeoLocalizationResult> {
  try {
    const geoFindResult = await geoFind();

    return geoFindResult;
  } catch (e) {
    console.error(e);
  }

  try {
    const ipFindResult = await ipFind();

    return ipFindResult;
  } catch (e) {
    console.error(e);
  }

  return null;
}
