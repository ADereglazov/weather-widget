<template>
  <section class="weather-point-section">
    <h2 class="weather-point-section__title">London, UK</h2>
    <img
      src="http://openweathermap.org/img/wn/10d@2x.png"
      alt="weather-img"
      class="weather-point-section__img"
    />
    <p>Подробности погоды</p>
  </section>
</template>

<script>
export default {
  name: "WeatherPointSection",
  props: {
    pointName: {
      type: String,
    },
  },
};
</script>

<style lang="less" scoped>
.weather-point-section {
  &__title {
    margin: 0;
    font-size: 15px;
    font-weight: bold;
  }
}
</style>
