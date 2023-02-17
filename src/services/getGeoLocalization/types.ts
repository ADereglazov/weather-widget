import { ICoordinates } from "@/types/coordinates";

export type TGetGeoLocalizationResultSucceed = ICoordinates;
export type TGetGeoLocalizationResultFailed = null;

export type TGetGeoLocalizationResult =
  | TGetGeoLocalizationResultSucceed
  | TGetGeoLocalizationResultFailed;
