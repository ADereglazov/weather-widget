import { defineCustomElement } from "vue";
import WeatherWidget from "./WeatherWidget.ce.vue";
import "./assets/main.css";

const vueCustomElement = defineCustomElement(WeatherWidget);

customElements.define("weather-widget", vueCustomElement);
