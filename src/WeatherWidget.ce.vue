<template>
  <ManageButton
    class="app-manage-button"
    :is-settings-opened="isSettingsOpened"
    @button-click="onManageButtonClick"
  />
  <SettingsSection
    v-if="isSettingsOpened"
    :lang="lang"
    :units="units"
    :api-url="apiUrl"
    :api-key="apiKey"
    :locations-list="locationsList"
    @delete="onDelete"
    @add-location="addLocation"
    @sorting-locations-list="onSorting"
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

<script setup>
import { ref, computed, onBeforeMount } from "vue";
import { getGeoLocalization } from "@/utils/getGeoLocalization";
import { getWeatherFromGeo } from "@/services/fetchWeather";
import {
  getLocalStorageWeatherData,
  setLocalStorageWeatherData,
} from "@/services/localStorageWeather";
import { getOutdatedItems } from "@/utils/getOutdatedItems";
import ManageButton from "@/components/ManageButton.vue";
import WeatherSection from "@/components/WeatherSection.vue";
import SettingsSection from "@/components/SettingsSection.vue";
import LoadingSpinner from "@/components/LoadingSpinner.vue";

const LANG = import.meta.env.VITE_LANG || "en";
const UNITS = import.meta.env.VITE_UNITS || "metric";
const API_URL = import.meta.env.VITE_API_URL;
const API_KEY = import.meta.env.VITE_API_KEY;

const locationsList = ref([]);
const isSettingsOpened = ref(false);
const isLoading = ref(false);
const errStatus = ref("");

const lang = computed(() => LANG);
const units = computed(() => UNITS);
const apiUrl = computed(() => API_URL);
const apiKey = computed(() => API_KEY);

onBeforeMount(() => {
  locationsList.value = getLocalStorageWeatherData();
  const isEmptyLocationsList = locationsList.value.length === 0;

  if (isEmptyLocationsList) {
    getGeoWeather();
  } else {
    refreshLocalData();
  }
});
async function getGeoWeather() {
  isLoading.value = true;
  const geo = await getGeoLocalization();
  if (geo) {
    const location = await getWeatherData(geo);
    addLocation(location);
  } else {
    errStatus.value = "Oops..., error! Try to update page";
  }
  isLoading.value = false;
}
async function getWeatherData({ lat, lon }) {
  try {
    isLoading.value = true;
    return await getWeatherFromGeo({
      lat,
      lon,
      lang: LANG,
      units: UNITS,
      apiUrl: API_URL,
      apiKey: API_KEY,
    });
  } catch (e) {
    errStatus.value = "Oops... " + e.message + ", try to update page";
  } finally {
    isLoading.value = false;
  }
}
function refreshLocalData() {
  const outdatedElements = getOutdatedItems(locationsList.value);

  for (let index of outdatedElements) {
    getWeatherData({
      lat: locationsList.value[index].coord.lat,
      lon: locationsList.value[index].coord.lon,
    }).then((location) => {
      locationsList.value.splice(index, 1, location);
      setLocalStorageWeatherData(locationsList.value);
    });
  }
}
function addLocation(location) {
  const locationListLength = locationsList.value.length;
  locationsList.value.splice(locationListLength, 0, location);
  setLocalStorageWeatherData(locationsList.value);
  errStatus.value = "";
}
function onSorting(e) {
  locationsList.value = e;
  setLocalStorageWeatherData(locationsList.value);
}
function onDelete(index) {
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
  margin: 0;

  font-weight: bold;
  color: $red;
}

.app-error.app-error--hide {
  display: none;
}
</style>
