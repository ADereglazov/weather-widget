import { ICoordinates } from "@/types";
import { TGeoFindResult } from "./types";

export function geoFind(): Promise<TGeoFindResult> {
  return new Promise((resolve, reject) => {
    const success: PositionCallback = (position) => {
      const latitude = position.coords.latitude;
      const longitude = position.coords.longitude;

      const location: ICoordinates = {
        lat: latitude,
        lon: longitude,
      };
      resolve(location);
    };

    const error: PositionErrorCallback = (geolocationPositionError) => {
      reject(geolocationPositionError);
    };

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(success, error);
    } else {
      reject(
        new Error("Failed to find geo: navigator.geolocation is not available")
      );
    }
  });
}
