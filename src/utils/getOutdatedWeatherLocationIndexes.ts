import { millisecondsToHours } from "date-fns";
import { IWeatherLocationTimestamped } from "@/types/weatherLocation";
import { TUpdatePeriod } from "@/types";

export function getOutdatedWeatherLocationIndexes(
  list: IWeatherLocationTimestamped[],
  updatePeriod: TUpdatePeriod = 2
): number[] {
  const outdatedList: number[] = [];

  for (let i = 0; i < list.length; i++) {
    const hoursFromLastUpdate = millisecondsToHours(
      Date.now() - list[i].lastUpdated
    );

    if (hoursFromLastUpdate >= updatePeriod) {
      outdatedList.push(i);
    }
  }

  return outdatedList;
}
