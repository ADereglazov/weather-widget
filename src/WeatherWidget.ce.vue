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
    :lang="props.lang"
    :units="props.units"
    :apiUrl="props.apiUrl"
    :apiKey="props.apiKey"
    @delete="onDelete"
    @add-location="addLocation"
    @sorting-locations-list="onSorting"
    @loading="isLoadingInSettings = $event"
  />
  <WeatherSection
    v-else
    :locations-list="locationsList"
    class="app-weather-section"
    :class="{ 'app-weather-section--loading': isLoading }"
  />
  <LoadingSpinner v-show="isLoading" class="app-spinner" />
  <div
    :class="{ 'app-error--hide': isSettingsOpened || !errStatus }"
    class="app-error"
  >
    {{ errStatus }}
    <button
      class="app-reload-button"
      type="button"
      aria-label="Reload"
      :style="{
        backgroundImage: `url(${require('@/assets/icons/reload.svg')})`,
      }"
      @click="getInitData"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onBeforeMount } from "vue";
import { getGeoLocalization } from "@/services/getGeoLocalization";
import { getWeatherFromGeo, IGetWeatherSucceed } from "@/services/fetchWeather";
import {
  getLocalStorageWeatherData,
  setLocalStorageWeatherData,
} from "@/services/localStorageWeather";
import { getOutdatedWeatherLocationIndexes } from "@/utils/getOutdatedWeatherLocationIndexes";
import { IWeatherLocationTimestamped } from "@/types/weatherLocation";
import { TLanguage } from "@/types/languages";
import { TUnits } from "@/types/units";
import ManageButton from "@/components/ManageButton.vue";
import WeatherSection from "@/components/WeatherSection.vue";
import SettingsSection from "@/components/SettingsSection.vue";
import LoadingSpinner from "@/components/LoadingSpinner.vue";

const LANG: TLanguage = process.env.VUE_APP_LANG || "en";
const UNITS: TUnits = process.env.VUE_APP_UNITS || "metric";
const API_URL: string = process.env.VUE_APP_API_URL || "";
const API_KEY: string = process.env.VUE_APP_API_KEY || "";

const props = {
  lang: LANG,
  units: UNITS,
  apiUrl: API_URL,
  apiKey: API_KEY,
};
const locationsList = ref<IWeatherLocationTimestamped[]>([]);
const isSettingsOpened = ref<boolean>(false);
const isLoading = ref<boolean>(false);
const isLoadingInSettings = ref<boolean>(false);
const errStatus = ref<string>("");

onBeforeMount(() => {
  getInitData();
});
function getInitData() {
  locationsList.value = getLocalStorageWeatherData();

  if (locationsList.value.length === 0) {
    getGeoWeather();
  } else {
    refreshLocalData();
  }
}
async function getGeoWeather() {
  isLoading.value = true;

  const geo = await getGeoLocalization();
  if (!geo) {
    errStatus.value =
      "Oops..., error! Try to press reload button for update widget";
    isLoading.value = false;
    return;
  }

  let location: IGetWeatherSucceed | null;
  ({ location, message: errStatus.value } = await getWeatherFromGeo(
    geo,
    props
  ));
  if (!location) {
    isLoading.value = false;
    return;
  }

  addLocation(location);
  isLoading.value = false;
}
async function refreshLocalData() {
  const outdatedElements = getOutdatedWeatherLocationIndexes(
    locationsList.value
  );

  const promises = outdatedElements.map((index) =>
    getWeatherFromGeo(locationsList.value[index].coord, props).then(
      (result) => {
        if (!result.location) {
          errStatus.value = result.message;
          return null;
        }

        locationsList.value.splice(index, 1, result.location);
        setLocalStorageWeatherData(locationsList.value);
      }
    )
  );

  isLoading.value = true;

  try {
    await Promise.all(promises);
  } finally {
    isLoading.value = false;
  }
}
function addLocation(location: IWeatherLocationTimestamped) {
  locationsList.value.splice(locationsList.value.length, 0, location);
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
    errStatus.value = "No data! Press reload button or add city in settings";
  }
}
</script>

<style lang="scss">
.app-manage-button {
  position: absolute;
  top: 10px;
  right: 10px;
}

.app-weather-section--loading {
  opacity: 0.3;
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

.app-reload-button {
  margin: 10px auto 0 auto;
}
</style>
