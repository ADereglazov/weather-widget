import { millisecondsToHours } from "date-fns";
import { IWeatherLocationTimestamped } from "@/types/weatherLocation";

const UPDATE_PERIOD_IN_HOURS: number =
  process.env.VUE_APP_UPDATE_PERIOD_IN_HOURS || 2;

export function getOutdatedWeatherLocationIndexes(
  list: IWeatherLocationTimestamped[]
): number[] {
  const outdatedList: number[] = [];

  for (let i = 0; i < list.length; i++) {
    const hoursFromLastUpdate = millisecondsToHours(
      Date.now() - list[i].lastUpdated
    );

    if (hoursFromLastUpdate >= UPDATE_PERIOD_IN_HOURS) {
      outdatedList.push(i);
    }
  }

  return outdatedList;
}
