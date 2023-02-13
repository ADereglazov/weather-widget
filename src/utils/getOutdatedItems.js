import { millisecondsToHours } from "date-fns";

const UPDATE_PERIOD_IN_HOURS = 2;

export function getOutdatedItems(list = []) {
  const outdatedList = [];

  for (let i = 0; i < list.length; i++) {
    const hoursFromLastUpdate = millisecondsToHours(
      Date.now() - +list[i]?.lastUpdated
    );

    if (hoursFromLastUpdate >= UPDATE_PERIOD_IN_HOURS) {
      outdatedList.push(i);
    }
  }

  return outdatedList;
}
