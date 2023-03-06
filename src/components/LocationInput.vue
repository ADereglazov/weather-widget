<template>
  <form class="location-input" name="location-form" @submit.prevent="onSubmit">
    <label class="location-input__label" for="inputField">Add location</label>
    <div class="location-input__wrapper">
      <input
        id="inputField"
        ref="inputField"
        v-model="newLocationString"
        :class="{
          'location-input__input--error': errStatus,
        }"
        class="location-input__input"
        type="search"
        autocomplete="off"
        name="new-location-input"
        placeholder="Input location"
        :disabled="isLoading"
        @keydown.up.prevent="onKeyArrow"
        @keydown.down.prevent="onKeyArrow"
        @keydown.esc.prevent="foundList = []"
        @input="onInput"
      />
      <SuggestionList
        v-show="foundList.length"
        :list="foundList"
        :search-string="newLocationString"
        :current-focus="currentFocus"
        @suggestion-select="onSuggestionSelect"
      />
      <button
        v-show="newLocationString.length > 0 && !isLoading"
        type="button"
        name="clear"
        :disabled="newLocationString.length === 0"
        :style="{
          backgroundImage: `url(${require('@/assets/icons/close.svg')})`,
        }"
        aria-label="Clear location input"
        class="location-input__button-clear"
        @keydown.enter.prevent="onClickClear"
        @click="onClickClear"
      />
      <button
        class="location-input__button-submit"
        type="submit"
        name="enter"
        aria-label="Add new location"
        :disabled="isSubmitButtonDisabled"
        :style="{
          backgroundImage: `url(${require('@/assets/icons/enter.svg')})`,
        }"
      />
      <LoadingSpinner v-show="isLoading" class="location-input__spinner" />
    </div>
    <span class="location-input__status">{{ errStatus }}</span>
  </form>
</template>

<script setup lang="ts">
import { ref, watchEffect, computed, defineEmits, defineProps } from "vue";
import throttle from "lodash.throttle";
import SuggestionList from "@/components/SuggestionList.vue";
import LoadingSpinner from "@/components/LoadingSpinner.vue";
import {
  getWeatherByCityId,
  IGetWeatherSucceed,
} from "@/services/fetchWeather";
import { TLanguage } from "@/types/languages";
import { TUnits } from "@/types/units";
import { ICitiListItem } from "@/types/cityList";
import { findSuggestionCities } from "@/utils/findSuggestionCities";

const emit = defineEmits(["add-location", "loading"]);

const props = defineProps<{
  lang: TLanguage;
  units: TUnits;
  apiUrl: string;
  apiKey: string;
}>();

const foundList = ref<ICitiListItem[]>([]);
const throttledOnInput = throttle(updateFoundList, 1000);
const inputField = ref<HTMLInputElement | null>(null);
const currentFocus = ref(0);
const selectedSuggestionListItem = ref<ICitiListItem | null>(null);
const newLocationString = ref("");
const errStatus = ref("");
const isLoading = ref(false);

let newLocation: IGetWeatherSucceed | null = null;
let cityId = 0;

watchEffect(() => emit("loading", isLoading.value));

const isSubmitButtonDisabled = computed<boolean>(
  () =>
    newLocationString.value.length === 0 ||
    isLoading.value ||
    !foundList.value.length
);

function onInput() {
  errStatus.value = "";

  const searchString = newLocationString.value.trim();
  if (searchString.length < 3) {
    foundList.value = [];
    return;
  }
  throttledOnInput();
}
function updateFoundList() {
  foundList.value = findSuggestionCities(newLocationString.value);
  currentFocus.value = 0;

  if (foundList.value.length) {
    onSuggestionSelect({
      item: foundList.value[currentFocus.value],
      isClickSuggestionItem: false,
    });
  } else {
    cityId = 0;
    selectedSuggestionListItem.value = null;
  }
}
function onSuggestionSelect({
  item,
  isClickSuggestionItem,
}: {
  item: ICitiListItem;
  isClickSuggestionItem: boolean;
}) {
  cityId = item.id;
  selectedSuggestionListItem.value = item;
  if (isClickSuggestionItem) onSubmit();
}

async function onSubmit() {
  isLoading.value = true;
  foundList.value = [];
  newLocationString.value = `${selectedSuggestionListItem.value?.name}, ${selectedSuggestionListItem.value?.country}`;
  if (cityId) newLocation = await getWeatherData(cityId);

  if (newLocation) {
    emit("add-location", newLocation);
    newLocationString.value = "";
  }

  cityId = 0;
  setTimeout(() => inputField.value?.focus(), 0);
  isLoading.value = false;
}
async function getWeatherData(
  cityId: number
): Promise<IGetWeatherSucceed | null> {
  try {
    const result = await getWeatherByCityId({
      id: cityId,
      lang: props.lang,
      units: props.units,
      apiUrl: props.apiUrl,
      apiKey: props.apiKey,
    });

    if (result.status !== "succeed") {
      const message = `Oops... ${result.message}, try again`;
      errStatus.value = message;
      console.error(message);

      return null;
    }

    return result;
  } catch (e) {
    errStatus.value = "Oops... something went wrong, try to update page";
    console.error(e);

    return null;
  }
}
function onKeyArrow(e: KeyboardEvent) {
  const maxListIndex = foundList.value.length - 1;

  if (e.key === "ArrowDown") {
    currentFocus.value =
      currentFocus.value === maxListIndex ? 0 : currentFocus.value + 1;
  } else if (e.key === "ArrowUp") {
    currentFocus.value =
      currentFocus.value === 0 ? maxListIndex : currentFocus.value - 1;
  }

  onSuggestionSelect({
    item: foundList.value[currentFocus.value],
    isClickSuggestionItem: false,
  });
}
function onClickClear() {
  newLocationString.value = "";
  errStatus.value = "";
  foundList.value = [];
  inputField.value?.focus();
}
</script>
