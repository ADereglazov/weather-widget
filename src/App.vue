<template>
  <ManageButton
    class="app-settings-button"
    :is-settings-opened="isSettingsOpened"
    @button-click="onManageButtonClick"
  />
  <SettingsSection
    v-if="isSettingsOpened"
    :api-url="apiUrl"
    :api-key="apiKey"
    :locations-list="locationsList"
    class="app-settings-section"
    @delete="onDelete"
    @add-location="addLocation"
    @change-locations-list="onChange"
  />
  <WeatherSection v-else :locations-list="locationsList" />
  <LoadingSpinner v-show="isLoading" class="app-settings-spinner" />
  <p
    :class="{ 'app-settings-error--hide': isSettingsOpened || !errStatus }"
    class="app-settings-error"
  >
    {{ errStatus }}
  </p>
</template>

<script setup>
import { ref, computed, onBeforeMount } from "vue";
import { millisecondsToHours } from "date-fns";
import { getGeoLocalization } from "@/utils/getGeoLocalization";
import { getWeatherFromGeo } from "@/services/fetchWeather";
import {
  getLocalStorageWeatherData,
  setLocalStorageWeatherData,
} from "@/services/localStorageWeather";
import ManageButton from "@/components/ManageButton.vue";
import WeatherSection from "@/components/WeatherSection.vue";
import SettingsSection from "@/components/SettingsSection.vue";
import LoadingSpinner from "@/components/LoadingSpinner.vue";

const API_URL = import.meta.env.VITE_API_URL;
const API_KEY = import.meta.env.VITE_API_KEY;

const locationsList = ref([]);
const isSettingsOpened = ref(false);
const isLoading = ref(false);
const errStatus = ref("");

const apiUrl = computed(() => API_URL);
const apiKey = computed(() => API_KEY);

onBeforeMount(() => {
  locationsList.value = getLocalStorageWeatherData();

  if (locationsList.value.length === 0) {
    getGeoLocalization().then((res) => {
      if (res) {
        getWeatherData(res).then((location) => addLocation(location));
      } else {
        errStatus.value = "Oops..., error! Try to update page";
      }
    });
  } else {
    updateLocalData();
  }
});
async function getWeatherData({ lat, lon }) {
  try {
    isLoading.value = true;
    return getWeatherFromGeo({ lat, lon }, API_URL, API_KEY);
  } catch (e) {
    errStatus.value = "Oops... " + e.message + ", try to update page";
  } finally {
    isLoading.value = false;
  }
}
function updateLocalData() {
  for (let i = 0; i < locationsList.value.length; i++) {
    const hours = millisecondsToHours(
      Date.now() - +locationsList.value[i]?.lastUpdated
    );

    if (hours >= 2) {
      getWeatherData({
        lat: locationsList.value[i].coord.lat,
        lon: locationsList.value[i].coord.lon,
      }).then((res) => {
        locationsList.value[i] = { ...res };
        setLocalStorageWeatherData(locationsList.value);
      });
    }
  }
}
function addLocation(location) {
  const locationListLength = locationsList.value.length;
  locationsList.value.splice(locationListLength, 0, location);
  setLocalStorageWeatherData(locationsList.value);
  errStatus.value = "";
}
function onChange(e) {
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

<style lang="scss" scoped>
.app-settings-button {
  position: absolute;
  top: 10px;
  right: 10px;
}

.app-settings-error,
.app-settings-spinner {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.app-settings-error {
  width: 100%;
  padding: 0 30px;
  margin: 0;

  font-weight: bold;
  color: $red;

  &--hide {
    display: none;
  }
}
</style>
