<template>
  <section
    v-for="location in locationsList"
    :key="location.id"
    class="weather-section"
  >
    <h2 class="weather-section__title">
      {{ location.name + ", " + location.sys.country }}
    </h2>

    <div class="weather-section__wrapper-main">
      <div class="weather-section__wrapper-img">
        <img
          :src="`https://openweathermap.org/img/wn/${location.weather[0].icon}@2x.png`"
          alt="weather-img"
          class="weather-section__img"
        />
      </div>
      <div class="weather-section__temperature">
        <span v-if="location.main.temp > 0">+</span>
        <span>{{ location.main.temp }}</span>
        <sup> o</sup>
        <span>C</span>
      </div>
    </div>

    <p class="weather-section__wrapper-description">
      Feels like {{ location.main.feels_like }}<sup>o</sup>C,
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
  </section>
</template>

<script>
import getWindDirection from "@/utils/getWindDirection";
import DirectionIcon from "@/assets/icons/direction.svg";
import BarometerIcon from "@/assets/icons/barometer.svg";
export default {
  name: "WeatherSection",
  components: { DirectionIcon, BarometerIcon },
  props: {
    locationsList: {
      type: Array,
    },
  },
  methods: {
    getWindDirection,
  },
};
</script>
