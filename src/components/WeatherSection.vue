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
              v-show="!isImgLoaded"
              :style="{
                backgroundImage: `url(${require('@/assets/icons/placeholder.svg')})`,
              }"
              class="weather-section__placeholder"
            />
            <img
              v-show="isImgLoaded"
              :src="`https://openweathermap.org/img/wn/${location.weather[0].icon}@2x.png`"
              alt="weather-img"
              class="weather-section__img"
              @load="onLoadImg"
              @error="onErrorImg"
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
              {{ pressure(location.main.pressure)
              }}{{ dict.pressureUnits[pressureUnit] }}
            </span>
          </span>
          <span>{{ dict.humidity }}: {{ location.main.humidity }}%</span>
          <span>
            {{ dict.visibility }}: {{ visibility(location.visibility) }}
          </span>
        </p>

        <p class="weather-section__updated-info">
          {{ dict.updated }}: {{ updatedDateTime(location.lastUpdated) }}
        </p>
      </SwiperSlide>
    </Swiper>
  </section>
</template>

<script setup lang="ts">
import { ref, defineProps, computed } from "vue";
import { getWindDirection, capitalizeFirstLetter } from "@/utils";
import {
  IWeatherLocationTimestamped,
  TLanguage,
  TUnits,
  TPressureUnit,
} from "@/types";
import { IDictionary } from "@/locales/types";
import SwiperCore, { Pagination, A11y } from "swiper";
import { Swiper, SwiperSlide } from "swiper/vue";

SwiperCore.use([Pagination, A11y]);

const props = defineProps<{
  locationsList: IWeatherLocationTimestamped[];
  lang: TLanguage;
  units: TUnits;
  pressureUnit: TPressureUnit;
  dict: IDictionary;
}>();

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

const isImgLoaded = ref(false);

const multiplier = computed<number>(() =>
  props.pressureUnit === "hPa" ? 1 : 0.75006156
);

const onLoadImg = () => (isImgLoaded.value = true);
const onErrorImg = () => (isImgLoaded.value = false);
function pressure(value: number): string {
  return (value * multiplier.value).toFixed(0);
}
function visibility(value: number): string {
  return value < 1000 ? value + props.dict.meter : value / 1000 + props.dict.km;
}
function updatedDateTime(value: number): string {
  return new Date(value).toLocaleString(props.lang);
}
</script>
