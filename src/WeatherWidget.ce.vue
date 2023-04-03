<template>
  <ManageButton
    :disabled="isLoading || isLoadingInSettings"
    :is-settings-opened="isSettingsOpened"
    :dict="dict[mainProps.lang]"
    :class="{ 'app-manage-button--main': !isSettingsOpened }"
    class="app-manage-button"
    @button-click="onManageButtonClick"
  />
  <ReloadButton
    v-show="!isSettingsOpened"
    :disabled="isLoading"
    :dict="dict[mainProps.lang]"
    :class="{ 'app-reload-button-main--reload': reload }"
    class="app-reload-button-main"
    @reload="updateAllWeatherData"
  />
  <SettingsSection
    v-if="isSettingsOpened"
    :locations-list="locationsList"
    :dict="dict[mainProps.lang]"
    :mainProps="mainProps"
    :is-loading="isLoading"
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
    :dict="dict[mainProps.lang]"
    :lang="mainProps.lang"
    :units="mainProps.units"
    :pressure-unit="mainProps.pressureUnit"
    :class="{ 'app-weather-section--loading': isLoading }"
    class="app-weather-section"
  />
  <LoadingSpinner v-show="isLoading" class="app-spinner" />
  <div
    :class="{ 'app-error--hide': isSettingsOpened || !errStatus }"
    class="app-error"
  >
    {{ errStatus }}

    <ReloadButton
      :dict="dict[mainProps.lang]"
      class="app-reload-button"
      @reload="onReload"
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
import {
  getOutdatedWeatherLocationIndexes,
  capitalizeFirstLetter,
} from "@/utils";
import {
  ISettings,
  IProps,
  IWeatherLocationTimestamped,
  ICoordinates,
  COUNTRIES,
  TGeoCountry,
} from "@/types";
import ManageButton from "@/components/ManageButton.vue";
import ReloadButton from "@/components/ReloadButton.vue";
import WeatherSection from "@/components/WeatherSection.vue";
import SettingsSection from "@/components/SettingsSection.vue";
import LoadingSpinner from "@/components/LoadingSpinner.vue";

const API_URL: string = process.env.VUE_APP_API_URL || "";
const API_KEY: string = process.env.VUE_APP_API_KEY || "";

const mainProps = reactive<IProps>({
  lang: "en",
  updatePeriod: 2,
  units: "metric",
  pressureUnit: "mmHg",
  apiUrl: API_URL,
  apiKey: API_KEY,
});
const locationsList = ref<IWeatherLocationTimestamped[]>([]);
const isSettingsOpened = ref(false);
const isLoading = ref(false);
const isLoadingInSettings = ref(false);
const errStatus = ref("");
const reload = ref(false);

onBeforeMount(() => {
  getInitData();
});

function getInitData() {
  const settings: ISettings | null = getLocalStorageSettings();
  if (settings) Object.assign(mainProps, settings);

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
    errStatus.value = `${dict[mainProps.lang].oops}, ${
      dict[mainProps.lang].error
    }! ${capitalizeFirstLetter(dict[mainProps.lang].tryReload)}`;

    isLoading.value = false;
    return;
  }

  await setGeoLanguage(geo);

  let location: IGetWeatherSucceed | null;
  ({ location, message: errStatus.value } = await getWeatherFromGeo(
    geo,
    mainProps
  ));

  if (!location) {
    isLoading.value = false;
    return;
  }

  addLocation(location);
  isLoading.value = false;
}
async function setGeoLanguage(geo: ICoordinates) {
  const { location } = await getWeatherFromGeo(geo, mainProps);

  if (location && location?.sys?.country) {
    const country = location.sys.country.toLowerCase();

    if (COUNTRIES.includes(country as TGeoCountry)) {
      mainProps.lang = country as TGeoCountry;

      setLocalStorageSettings({
        lang: mainProps.lang,
        updatePeriod: mainProps.updatePeriod,
        units: mainProps.units,
        pressureUnit: mainProps.pressureUnit,
      });
    }
  }
}
function refreshAllLocalData() {
  const locationsListIndexes = locationsList.value.map((item, index) => index);
  refreshLocalData(locationsListIndexes);
}
function refreshOutdatedLocalData() {
  const outdatedElements = getOutdatedWeatherLocationIndexes(
    locationsList.value,
    mainProps.updatePeriod
  );
  refreshLocalData(outdatedElements);
}
async function refreshLocalData(indexes: number[]) {
  const promises = indexes.map((index) =>
    getWeatherFromGeo(locationsList.value[index].coord, mainProps).then(
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

  try {
    isLoading.value = true;
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
  locationsList.value = [...value];
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
function onReload() {
  errStatus.value = "";
  getInitData();
}
function updateAllWeatherData() {
  reload.value = true;
  setTimeout(() => (reload.value = false), 500);

  refreshAllLocalData();
}
function changeSettings({
  lang = mainProps.lang,
  updatePeriod = mainProps.updatePeriod,
  units = mainProps.units,
  pressureUnit = mainProps.pressureUnit,
}: ISettings) {
  setLocalStorageSettings({ lang, updatePeriod, units, pressureUnit });
  const updateOutdated = mainProps.updatePeriod !== updatePeriod;

  // Necessary change mainProps.lang, mainProps.units etc.,
  // because it uses for network queries in refreshLocalData() function.
  Object.assign(mainProps, {
    lang,
    updatePeriod,
    units,
    pressureUnit,
  });

  if (updateOutdated) {
    refreshOutdatedLocalData();
  } else {
    refreshAllLocalData();
  }
}
</script>

<style lang="scss">
.app-manage-button {
  position: absolute;
  top: 10px;
  right: 10px;
  z-index: 2;

  &--main {
    background-color: $white;
  }
}

.app-reload-button-main {
  position: absolute;
  bottom: 35px;
  left: 10px;
  z-index: 2;

  width: 14px;
  height: 14px;

  background-color: $white;

  &--reload {
    animation: reload-button-rotate 500ms linear;
  }
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

@keyframes reload-button-rotate {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
