<template>
  <section class="weather-section">
    <div
      v-for="location in locationsList"
      :key="location.id"
      class="weather-section-wrapper"
    >
      <h2 class="weather-section__title">
        {{ location.name + ", " + location.sys.country }}
      </h2>

      <div class="weather-section__wrapper-main">
        <div class="weather-section__wrapper-img">
          <div class="weather-section__placeholder">
            <PlaceholderIcon />
          </div>
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
          <DirectionIcon
            :style="{ transform: `rotate(${45 + location.wind.deg}deg)` }"
          />
          <span style="margin-left: 10px">{{ location.wind.speed }}m/s </span>
          {{ getWindDirection(location.wind.deg) }}
        </span>
        <span>
          <BarometerIcon />
          <span style="margin-left: 10px">{{ location.main.pressure }}hPa</span>
        </span>
        <span>Humidity: {{ location.main.humidity }}%</span>
        <span>Visibility: {{ location.visibility / 1000 }}km</span>
      </p>
    </div>
  </section>
</template>

<script setup lang="ts">
import { defineProps } from "vue";
import getWindDirection from "@/utils/getWindDirection";
import DirectionIcon from "@/components/icons/DirectionIcon.vue";
import BarometerIcon from "@/components/icons/BarometerIcon.vue";
import PlaceholderIcon from "@/components/icons/PlaceholderIcon.vue";
import { IWeatherLocationTimestamped } from "@/types/weatherLocation";

defineProps<{
  locationsList: IWeatherLocationTimestamped[];
}>();
</script>
