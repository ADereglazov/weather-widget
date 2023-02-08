<template>
  <section
    v-for="location in locationsList"
    :key="location.id"
    class="weather-point-section"
  >
    <h2 class="weather-point-section__title">
      {{ location.name + ", " + location.sys.country }}
    </h2>

    <div class="weather-point-section__wrapper-main">
      <div class="weather-point-section__wrapper-img">
        <img
          :src="`http://openweathermap.org/img/wn/${location.weather[0].icon}@2x.png`"
          alt="weather-img"
          class="weather-point-section__img"
        />
      </div>
      <div class="weather-point-section__temperature">
        <span>
          {{
            location.main.temp > 0
              ? "+" + location.main.temp
              : location.main.temp
          }}
        </span>
        <sup> o</sup>
        <span>C</span>
      </div>
    </div>

    <p class="weather-point-section__wrapper-description">
      Feels like {{ location.main.feels_like }}<sup>o</sup>C,
      {{
        location.weather[0].description.charAt(0).toUpperCase() +
        location.weather[0].description.slice(1)
      }}, Cloud cover {{ location.clouds.all }}%
    </p>

    <p class="weather-point-section__wrapper-details">
      <span>
        <DirectionIcon
          :style="{ transform: `rotate(${45 + location.wind.deg}deg)` }"
        />
        <span style="margin-left: 10px">{{ location.wind.speed }}m/s </span>
        {{ windDirection(location.wind.deg) }}
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
import windDirection from "@/composables/windDirection";
import DirectionIcon from "@/assets/icons/direction.svg";
import BarometerIcon from "@/assets/icons/barometer.svg";
export default {
  name: "WeatherPointSection",
  components: { DirectionIcon, BarometerIcon },
  props: {
    locationsList: {
      type: Array,
    },
  },
  methods: {
    windDirection,
  },
};
</script>

<style lang="less" scoped>
.weather-point-section {
  padding-bottom: 10px;

  &:last-child {
    padding-bottom: 0;
  }

  & + & {
    padding-top: 10px;
    border-top: 1px solid @black;
  }

  &__title {
    margin: 0;
    font-size: 15px;
    font-weight: bold;
  }

  &__wrapper-main {
    display: flex;
    align-items: center;
    justify-content: space-around;
    margin-bottom: 15px;
  }

  &__wrapper-img {
    position: relative;
    width: 50%;
    padding-top: 50%;
  }

  &__img {
    position: absolute;
    top: 0;
    left: 0;

    display: block;
    width: 100%;
    height: 100%;

    object-fit: cover;
  }

  &__temperature {
    width: 50%;
    font-size: 25px;
    font-weight: bold;
  }

  &__wrapper-description {
    margin-top: 0;
    margin-bottom: 15px;
  }

  &__wrapper-details {
    display: grid;
    gap: 10px;
    grid-template-columns: 1fr 1fr;
    margin: 0;
  }
}
</style>
