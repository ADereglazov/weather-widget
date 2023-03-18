<template>
  <ManageButton
    :disabled="isLoading || isLoadingInSettings"
    :is-settings-opened="isSettingsOpened"
    :dict="dict[props.lang]"
    class="app-manage-button"
    @button-click="onManageButtonClick"
  />
  <SettingsSection
    v-if="isSettingsOpened"
    :locations-list="locationsList"
    :lang="props.lang"
    :units="props.units"
    :apiUrl="props.apiUrl"
    :apiKey="props.apiKey"
    :dict="dict[props.lang]"
    :class="{ 'app-settings-section--loading': isLoading }"
    class="app-settings-section"
    @change-settings="changeSettings"
    @delete="onDelete"
    @add-location="addLocation"
    @sorting-locations-list="onSorting"
    @loading="isLoadingInSettings = $event"
  />
  <WeatherSection
    v-else
    :locations-list="locationsList"
    :dict="dict[props.lang]"
    :lang="props.lang"
    :units="props.units"
    :class="{ 'app-weather-section--loading': isLoading }"
    class="app-weather-section"
  />
  <LoadingSpinner v-show="isLoading" class="app-spinner" />
  <div
    :class="{ 'app-error--hide': isSettingsOpened || !errStatus }"
    class="app-error"
  >
    {{ errStatus }}
    <button
      type="button"
      :aria-label="dict[props.lang].reload"
      :style="{
        backgroundImage: `url(${require('@/assets/icons/reload.svg')})`,
      }"
      class="app-reload-button"
      @click="getInitData"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onBeforeMount, reactive } from "vue";
import { dict } from "@/locales";
import { getGeoLocalization } from "@/services/getGeoLocalization";
import { getWeatherFromGeo, IGetWeatherSucceed } from "@/services/fetchWeather";
import {
  getLocalStorageWeatherData,
  setLocalStorageWeatherData,
} from "@/services/localStorageWeather";
import {
  getLocalStorageSettings,
  setLocalStorageSettings,
} from "@/services/localStorageSettings";
import { getOutdatedWeatherLocationIndexes } from "@/utils";
import {
  ISettings,
  IWeatherLocationTimestamped,
  TLanguage,
  TUnits,
} from "@/types";
import ManageButton from "@/components/ManageButton.vue";
import WeatherSection from "@/components/WeatherSection.vue";
import SettingsSection from "@/components/SettingsSection.vue";
import LoadingSpinner from "@/components/LoadingSpinner.vue";

const API_URL: string = process.env.VUE_APP_API_URL || "";
const API_KEY: string = process.env.VUE_APP_API_KEY || "";

const props = reactive<{
  lang: TLanguage;
  units: TUnits;
  apiUrl: string;
  apiKey: string;
}>({
  lang: "en",
  units: "metric",
  apiUrl: API_URL,
  apiKey: API_KEY,
});
const locationsList = ref<IWeatherLocationTimestamped[]>([]);
const isSettingsOpened = ref<boolean>(false);
const isLoading = ref<boolean>(false);
const isLoadingInSettings = ref<boolean>(false);
const errStatus = ref<string>("");

onBeforeMount(() => {
  getInitData();
});

function getInitData() {
  const settings: ISettings | null = getLocalStorageSettings();
  if (settings) ({ lang: props.lang, units: props.units } = settings);

  locationsList.value = getLocalStorageWeatherData();
  if (locationsList.value.length === 0) {
    getGeoWeather();
  } else {
    refreshOutdatedLocalData();
  }
}
async function getGeoWeather() {
  isLoading.value = true;

  const geo = await getGeoLocalization();
  if (!geo) {
    const tryText =
      dict[props.lang].tryReload.charAt(0).toUpperCase() +
      dict[props.lang].tryReload.slice(1);

    errStatus.value = `${dict[props.lang].oops}, ${
      dict[props.lang].error
    }! ${tryText}`;

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
function refreshOutdatedLocalData() {
  const outdatedElements = getOutdatedWeatherLocationIndexes(
    locationsList.value
  );
  refreshLocalData(outdatedElements);
}
async function refreshLocalData(indexes: number[]) {
  const promises = indexes.map((index) =>
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
    getInitData();
  }
}
function changeSettings({ lang, units }: ISettings) {
  // At first necessary change props.lang and props.units,
  // because it uses for network queries in refreshLocalData() function.
  props.lang = lang;
  props.units = units;
  const locationsListIndexes = locationsList.value.map((item, index) => index);
  refreshLocalData(locationsListIndexes);
  setLocalStorageSettings({ lang, units });
}
</script>

<style lang="scss">
.app-manage-button {
  position: absolute;
  top: 10px;
  right: 10px;
  z-index: 2;
}

.app-weather-section--loading,
.app-settings-section--loading {
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
  z-index: 2;

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
