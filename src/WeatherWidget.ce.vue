<template>
  <ManageButton
    class="app-manage-button"
    :disabled="isLoading || isLoadingInSettings"
    :is-settings-opened="isSettingsOpened"
    @button-click="onManageButtonClick"
  />
  <SettingsSection
    v-if="isSettingsOpened"
    :locations-list="locationsList"
    @delete="onDelete"
    @add-location="addLocation"
    @sorting-locations-list="onSorting"
    @loading="isLoadingInSettings = $event"
  />
  <WeatherSection v-else :locations-list="locationsList" />
  <LoadingSpinner v-show="isLoading" class="app-spinner" />
  <p
    :class="{ 'app-error--hide': isSettingsOpened || !errStatus }"
    class="app-error"
  >
    {{ errStatus }}
  </p>
</template>

<script setup lang="ts">
import { ref, onBeforeMount } from "vue";
import { getGeoLocalization } from "@/services/getGeoLocalization";
import { getWeatherFromGeo, IGetWeatherSucceed } from "@/services/fetchWeather";
import {
  getLocalStorageWeatherData,
  setLocalStorageWeatherData,
} from "@/services/localStorageWeather";
import { ICoordinates } from "@/types/coordinates";
import { IWeatherLocationTimestamped } from "@/types/weatherLocation";
import { TLanguage } from "@/types/languages";
import { TUnits } from "@/types/units";
import { getOutdatedWeatherLocationIndexes } from "@/utils/getOutdatedWeatherLocationIndexes";
import ManageButton from "@/components/ManageButton.vue";
import WeatherSection from "@/components/WeatherSection.vue";
import SettingsSection from "@/components/SettingsSection.vue";
import LoadingSpinner from "@/components/LoadingSpinner.vue";

const LANG: TLanguage = process.env.VUE_APP_LANG || "en";
const UNITS: TUnits = process.env.VUE_APP_UNITS || "metric";
const API_URL: string = process.env.VUE_APP_API_URL || "";
const API_KEY: string = process.env.VUE_APP_API_KEY || "";

const locationsList = ref<IWeatherLocationTimestamped[]>([]);
const isSettingsOpened = ref<boolean>(false);
const isLoading = ref<boolean>(false);
const isLoadingInSettings = ref<boolean>(false);
const errStatus = ref<string>("");

onBeforeMount(() => {
  locationsList.value = getLocalStorageWeatherData();

  if (locationsList.value.length === 0) {
    getGeoWeather();
  } else {
    refreshLocalData();
  }
});
async function getGeoWeather() {
  isLoading.value = true;

  const geo = await getGeoLocalization();
  if (!geo) {
    errStatus.value = "Oops..., error! Try to update page";
    isLoading.value = false;
    return;
  }

  const location = await getWeatherData(geo);
  if (!location) {
    isLoading.value = false;
    return;
  }

  addLocation(location);
  isLoading.value = false;
}
async function getWeatherData(
  coordinates: ICoordinates
): Promise<IGetWeatherSucceed | null> {
  try {
    const result = await getWeatherFromGeo({
      coordinates,
      lang: LANG,
      units: UNITS,
      apiUrl: API_URL,
      apiKey: API_KEY,
    });

    if (result.status !== "succeed") {
      const message = `Oops... ${result.message}, try to update page`;
      errStatus.value = message;
      console.error(message);

      return null;
    }

    return result;
  } catch (e) {
    errStatus.value = "Oops... something went wrong, try to update page";
    console.error(e);

    return null;
  }
}
async function refreshLocalData() {
  const outdatedElements = getOutdatedWeatherLocationIndexes(
    locationsList.value
  );

  const promises = outdatedElements.map((index) =>
    getWeatherData(locationsList.value[index].coord).then((location) => {
      if (!location) {
        return null;
      }

      locationsList.value.splice(index, 1, location);
      setLocalStorageWeatherData(locationsList.value);
    })
  );

  isLoading.value = true;

  try {
    await Promise.all(promises);
  } finally {
    isLoading.value = false;
  }
}
function addLocation(location: IWeatherLocationTimestamped) {
  const locationListLength = locationsList.value.length;
  locationsList.value.splice(locationListLength, 0, location);
  setLocalStorageWeatherData(locationsList.value);
  errStatus.value = "";
}
function onSorting(value: IWeatherLocationTimestamped[]) {
  locationsList.value = value;
  setLocalStorageWeatherData(locationsList.value);
}
function onDelete(index: number) {
  locationsList.value.splice(index, 1);
  setLocalStorageWeatherData(locationsList.value);
}
function onManageButtonClick() {
  isSettingsOpened.value = !isSettingsOpened.value;

  if (!isSettingsOpened.value && !locationsList.value.length) {
    errStatus.value = "No data! Update page or add your city in settings";
  }
}
</script>

<style lang="scss">
.app-manage-button {
  position: absolute;
  top: 10px;
  right: 10px;
}

.app-error,
.app-spinner {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.app-error {
  width: 100%;
  max-width: 220px;
  padding: 20px 10px;
  margin: 0;

  font-weight: bold;
  background-color: $white;
  color: $red;
  box-shadow: 2px 2px 10px 0 $black;
}

.app-error.app-error--hide {
  display: none;
}
</style>
