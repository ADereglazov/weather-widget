<template>
  <section
    v-for="location in locationsList"
    :key="location.id"
    class="weather-point-section"
  >
    <h2 class="weather-point-section__title">
      {{ location.name + ", " + location.sys.country }}
    </h2>
    <div class="weather-point-section__wrapper">
      <div style="position: relative; width: 50%; padding-top: 50%">
        <img
          :src="`http://openweathermap.org/img/wn/${location.weather[0].icon}@2x.png`"
          alt="weather-img"
          class="weather-point-section__img"
        />
      </div>
      <div class="weather-point-section__temperature" style="width: 50%">
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
    <p>
      Feels like {{ location.main.feels_like }}
      <sup> o</sup>
      <span>C, </span>
      <span>
        {{
          location.weather[0].description.charAt(0).toUpperCase() +
          location.weather[0].description.slice(1)
        }}
      </span>
    </p>
    <p>
      <span style="display: inline-flex; align-items: center; width: 50%">
        <DirectionIcon
          :style="{
            display: 'inline-block',
            transform: `rotate(${45 + location.wind.deg}deg)`,
          }"
        />
        <span style="margin-left: 10px">{{ location.wind.speed }} m/s</span>
      </span>
      <span style="display: inline-flex; align-items: center; width: 50%">
        <BarometerIcon style="margin-right: 10px" />
        {{ location.main.pressure }}hPa
      </span>
    </p>
    <p>
      <span style="display: inline-flex; align-items: center; width: 50%">
        Humidity: {{ location.main.humidity }}%
      </span>
      <span style="display: inline-flex; align-items: center; width: 50%">
        Visibility: {{ location.visibility / 1000 }}km
      </span>
    </p>
    <hr style="margin: 0" />
  </section>
</template>

<script>
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
};
</script>

<style lang="less" scoped>
.weather-point-section {
  & + & {
    margin-top: 10px;
  }

  &__title {
    margin: 0;
    font-size: 15px;
    font-weight: bold;
  }

  &__wrapper {
    display: flex;
    align-items: center;
    justify-content: space-around;
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
    font-size: 25px;
    font-weight: bold;
  }
}
</style>
