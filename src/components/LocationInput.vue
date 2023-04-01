<template>
  <div class="location-input">
    <label class="location-input__label" for="inputField">
      {{ dict.addLocation }}
    </label>
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
        :placeholder="dict.inputPlaceholder"
        @blur="isInputFocused = false"
        @focus="isInputFocused = true"
        @keydown.up.prevent="onKeyArrow"
        @keydown.down.prevent="onKeyArrow"
        @keydown.enter="onEnter"
        @input="onInput"
      />
      <SuggestionList
        v-show="foundList.length && isInputFocused"
        :list="foundList"
        :search-string="newLocationString"
        :current-focus="currentFocus"
        @suggestion-select="onSuggestionSelect"
      />
      <button
        v-show="newLocationString.length > 0 && !isLoading"
        type="button"
        name="clear"
        :style="{
          backgroundImage: `url(${require('@/assets/icons/close.svg')})`,
        }"
        :aria-label="dict.clearInput"
        class="location-input__button-clear"
        @click="onClickClear"
      />
      <LoadingSpinner v-show="isLoading" class="location-input__spinner" />
    </div>
    <div class="location-input__status-wrapper">
      <span
        :class="{
          'location-input__status--animated':
            errStatus.length > MAX_STATIC_ERR_TEXT_LENGTH,
        }"
        class="location-input__status"
      >
        {{ errStatus }}
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watchEffect, defineEmits, defineProps, onMounted } from "vue";
import throttle from "lodash.throttle";
import {
  getWeatherByCityId,
  getWeatherByCityName,
  IGetWeatherSucceed,
  IGetWeatherFetchByNameSucceed,
} from "@/services/fetchWeather";
import { TLanguage, TUnits, IWeatherLocation } from "@/types";
import { IDictionary } from "@/locales/types";
import SuggestionList from "@/components/SuggestionList.vue";
import LoadingSpinner from "@/components/LoadingSpinner.vue";

const emit = defineEmits(["add-location", "loading", "suggestion-opened"]);

const props = defineProps<{
  lang: TLanguage;
  units: TUnits;
  apiUrl: string;
  apiKey: string;
  dict: IDictionary;
}>();

const MAX_STATIC_ERR_TEXT_LENGTH = 45;
const MIN_LENGTH_FOR_START_SEARCH = 3;
const foundList = ref<IWeatherLocation[]>([]);
const throttledOnInput = throttle(getInputtedLocation, 1000);
const isInputFocused = ref(false);
const inputField = ref<HTMLInputElement | null>(null);
const currentFocus = ref(0);
const selectedSuggestionListItem = ref<IWeatherLocation | null>(null);
const newLocationString = ref("");
const errStatus = ref("");
const isLoading = ref(false);

onMounted(() => inputField.value?.focus());

watchEffect(() => {
  emit("loading", isLoading.value);
  emit("suggestion-opened", foundList.value.length > 0 && isInputFocused.value);
});

function onInput() {
  errStatus.value = "";
  foundList.value = [];
  selectedSuggestionListItem.value = null;
  if (newLocationString.value.trim().length < MIN_LENGTH_FOR_START_SEARCH) {
    return;
  }
  throttledOnInput();
}
function onSuggestionSelect({
  item,
  isClickSuggestionItem = false,
}: {
  item: IWeatherLocation;
  isClickSuggestionItem?: boolean;
}) {
  selectedSuggestionListItem.value = { ...item };
  if (isClickSuggestionItem) addSelectedLocation(item.id);
}
async function addSelectedLocation(id: number) {
  isLoading.value = true;

  let newWeatherLocation: IGetWeatherSucceed | null;
  ({ location: newWeatherLocation, message: errStatus.value } =
    await getWeatherByCityId(id, props));

  if (newWeatherLocation) {
    emit("add-location", newWeatherLocation);
    newLocationString.value = "";
  }
  foundList.value = [];

  isLoading.value = false;
}
function onEnter() {
  if (!newLocationString.value) {
    return;
  }

  if (selectedSuggestionListItem.value) {
    addSelectedLocation(selectedSuggestionListItem.value.id);
  }
}
async function getInputtedLocation() {
  isLoading.value = true;

  let locationsList: IGetWeatherFetchByNameSucceed | null;
  ({ location: locationsList, message: errStatus.value } =
    await getWeatherByCityName(newLocationString.value.trim(), props));

  if (locationsList?.count) {
    foundList.value = [...locationsList.list];
    selectedSuggestionListItem.value = foundList.value[0];
    currentFocus.value = 0;
  }

  isLoading.value = false;
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
  });
}
function onClickClear() {
  newLocationString.value = "";
  errStatus.value = "";
  foundList.value = [];
  inputField.value?.focus();
}
</script>
