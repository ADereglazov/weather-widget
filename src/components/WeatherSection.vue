<template>
  <section class="weather-section">
    <Swiper
      :slides-per-view="1"
      :space-between="30"
      :pagination="{ clickable: true }"
      class="weather-section__swiper"
    >
      <SwiperSlide
        v-for="location in locationsList"
        :key="location.id + location.lastUpdated"
      >
        <div class="weather-section__wrapper-title">
          <h2 class="weather-section__title weather-section__title--name">
            {{ location.name }}
          </h2>
          <h2 class="weather-section__title weather-section__title--country">
            {{ ", " + location.sys.country }}
          </h2>
          <span
            :style="{
              backgroundImage: `url(${require('@/assets/icons/flags/' +
                location.sys.country.toLowerCase() +
                '.svg')})`,
            }"
            class="weather-section__title-flag"
          ></span>
        </div>

        <div class="weather-section__wrapper-main">
          <div class="weather-section__wrapper-img">
            <div
              :style="{
                backgroundImage: `url(${require('@/assets/icons/placeholder.svg')})`,
              }"
              class="weather-section__placeholder"
            />
            <img
              :src="`https://openweathermap.org/img/wn/${location.weather[0].icon}@2x.png`"
              alt="weather-img"
              class="weather-section__img"
              onload="this.style.display = 'block'"
              onerror="this.style.display = 'none'"
            />
          </div>
          <div class="weather-section__temperature">
            <span v-if="location.main.temp > 0">+</span>
            <span>{{ location.main.temp }}</span>
            {{ unitsDict[units].temperature }}
          </div>
        </div>

        <p class="weather-section__wrapper-description">
          {{ dict.feelsLike }}:
          <span v-if="location.main.feels_like > 0">+</span>
          <span>{{ location.main.feels_like }}</span>
          {{ unitsDict[units].temperature }},
          {{ capitalizeFirstLetter(location.weather[0].description) }},
          {{ dict.cloudCover }}: {{ location.clouds.all }}%
        </p>

        <p class="weather-section__wrapper-details">
          <span class="weather-section__details-item">
            <span
              :style="{
                backgroundImage: `url(${require('@/assets/icons/direction.svg')})`,
                transform: `rotate(${location.wind.deg}deg)`,
              }"
              class="weather-section__wrapper-description-icon"
            />
            <span style="margin: 0 5px">
              {{ location.wind.speed }}{{ unitsDict[units].windSpeed }}
            </span>
            {{ dict.windDirections[getWindDirection(location.wind.deg)] }}
          </span>
          <span class="weather-section__details-item">
            <span
              :style="{
                backgroundImage: `url(${require('@/assets/icons/barometer.svg')})`,
              }"
              class="weather-section__wrapper-description-icon"
            />
            <span style="margin-left: 5px">
              {{ (location.main.pressure * multiplier).toFixed(0)
              }}{{ dict.pressureUnits[pressureUnit] }}
            </span>
          </span>
          <span>{{ dict.humidity }}: {{ location.main.humidity }}%</span>
          <span>
            {{ dict.visibility }}: {{ location.visibility / 1000 }}{{ dict.km }}
          </span>
        </p>
        <div class="weather-section__wrapper-updated-info">
          <ReloadButton
            :dict="dict"
            :class="{ 'weather-section__reload-button--reload': reload }"
            class="weather-section__reload-button"
            @reload="onReload"
          />
          <p class="weather-section__updated-info">
            {{ dict.updated }}: {{ updatedDateTime(location.lastUpdated) }}
          </p>
        </div>
      </SwiperSlide>
    </Swiper>
  </section>
</template>

<script setup lang="ts">
import { ref, defineEmits, defineProps, computed } from "vue";
import { getWindDirection, capitalizeFirstLetter } from "@/utils";
import {
  IWeatherLocationTimestamped,
  TLanguage,
  TUnits,
  TPressureUnit,
} from "@/types";
import { IDictionary } from "@/locales/types";
import ReloadButton from "@/components/ReloadButton.vue";
import SwiperCore, { Pagination, A11y } from "swiper";
import { Swiper, SwiperSlide } from "swiper/vue";

SwiperCore.use([Pagination, A11y]);

const emit = defineEmits(["reload"]);

const props = defineProps<{
  locationsList: IWeatherLocationTimestamped[];
  lang: TLanguage;
  units: TUnits;
  pressureUnit: TPressureUnit;
  dict: IDictionary;
}>();

const reload = ref(false);
const unitsDict = {
  standard: {
    temperature: "K",
    windSpeed: props.dict.windSpeed,
  },
  metric: {
    temperature: "\u00B0C",
    windSpeed: props.dict.windSpeed,
  },
  imperial: {
    temperature: "F",
    windSpeed: props.dict.windSpeedImperial,
  },
};

const multiplier = computed<number>(() =>
  props.pressureUnit === "hPa" ? 1 : 0.75006156
);

function updatedDateTime(value: number) {
  return new Date(value).toLocaleString(props.lang);
}
function onReload() {
  reload.value = true;
  setTimeout(() => (reload.value = false), 500);
  emit("reload");
}
</script>
