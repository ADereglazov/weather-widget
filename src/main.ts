import { defineCustomElement } from "vue";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import WeatherWidget from "./WeatherWidget.ce.vue";
import "./assets/styles/main.css";

const vueCustomElement = defineCustomElement(WeatherWidget);

customElements.define("weather-widget", vueCustomElement);
