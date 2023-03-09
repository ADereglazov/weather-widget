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
        <h2 class="weather-section__title">
          {{ location.name + ", " + location.sys.country }}
        </h2>

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
            <sup> o</sup>C
          </div>
        </div>

        <p class="weather-section__wrapper-description">
          Feels like <span v-if="location.main.feels_like > 0">+</span>
          <span>{{ location.main.feels_like }}</span>
          <sup> o</sup>C,
          {{
            location.weather[0].description.charAt(0).toUpperCase() +
            location.weather[0].description.slice(1)
          }}, Cloud cover {{ location.clouds.all }}%
        </p>

        <p class="weather-section__wrapper-details">
          <span>
            <span
              :style="{
                backgroundImage: `url(${require('@/assets/icons/direction.svg')})`,
                transform: `rotate(${location.wind.deg}deg)`,
              }"
              class="weather-section__wrapper-description-icon"
            />
            <span style="margin-left: 10px">{{ location.wind.speed }}m/s </span>
            {{ getWindDirection(location.wind.deg) }}
          </span>
          <span>
            <span
              :style="{
                backgroundImage: `url(${require('@/assets/icons/barometer.svg')})`,
              }"
              class="weather-section__wrapper-description-icon test"
            />
            <span style="margin-left: 10px"
              >{{ location.main.pressure }}hPa</span
            >
          </span>
          <span>Humidity: {{ location.main.humidity }}%</span>
          <span>Visibility: {{ location.visibility / 1000 }}km</span>
        </p>
      </SwiperSlide>
    </Swiper>
  </section>
</template>

<script setup lang="ts">
import { defineProps } from "vue";
import { getWindDirection } from "@/utils";
import { IWeatherLocationTimestamped } from "@/types/weatherLocation";

import SwiperCore, { Pagination, A11y } from "swiper";
import { Swiper, SwiperSlide } from "swiper/vue";

defineProps<{
  locationsList: IWeatherLocationTimestamped[];
}>();

SwiperCore.use([Pagination, A11y]);
</script>
