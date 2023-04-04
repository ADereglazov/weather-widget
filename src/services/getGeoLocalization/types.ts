import { ICoordinates } from "@/types";

export type TGetGeoLocalizationResultSucceed = ICoordinates;
export type TGetGeoLocalizationResultFailed = null;

export type TGetGeoLocalizationResult =
  | TGetGeoLocalizationResultSucceed
  | TGetGeoLocalizationResultFailed;
