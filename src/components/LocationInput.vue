<template>
  <form class="location-input" name="location-form" @submit.prevent="onSubmit">
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
        :aria-label="dict.clearInput"
        class="location-input__button-clear"
        @keydown.enter.prevent="onClickClear"
        @click="onClickClear"
      />
      <button
        class="location-input__button-submit"
        type="submit"
        name="enter"
        :aria-label="dict.addNewLocation"
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
import {
  ref,
  watchEffect,
  computed,
  defineEmits,
  defineProps,
  onMounted,
} from "vue";
import throttle from "lodash.throttle";
import {
  getWeatherByCityId,
  IGetWeatherSucceed,
} from "@/services/fetchWeather";
import { TLanguage, TUnits, ICitiListItem } from "@/types";
import { IDictionary } from "@/locales/types";
import { findSuggestionCities, getCurrentFocusValue } from "@/utils";
import SuggestionList from "@/components/SuggestionList.vue";
import LoadingSpinner from "@/components/LoadingSpinner.vue";

const emit = defineEmits(["add-location", "loading"]);

const props = defineProps<{
  lang: TLanguage;
  units: TUnits;
  apiUrl: string;
  apiKey: string;
  dict: IDictionary;
}>();

const foundList = ref<ICitiListItem[]>([]);
const throttledOnInput = throttle(updateFoundList, 1000);
const inputField = ref<HTMLInputElement | null>(null);
const currentFocus = ref(0);
const cityId = ref(0);
const selectedSuggestionListItem = ref<ICitiListItem | null>(null);
const newLocationString = ref("");
const errStatus = ref("");
const isLoading = ref(false);

onMounted(() => inputField.value?.focus());

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
  /* Если во вновь сформированном списке foundList есть элемент,
   * который был до этого текущим (выбранным с помощью клавиатуры),
   * то выбрать его, найдя его индекс в новом списке.
   */
  currentFocus.value = getCurrentFocusValue(cityId.value, foundList.value);

  if (foundList.value.length) {
    onSuggestionSelect({
      item: foundList.value[currentFocus.value],
      isClickSuggestionItem: false,
    });
  } else {
    cityId.value = 0;
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
  cityId.value = item.id;
  selectedSuggestionListItem.value = item;
  if (isClickSuggestionItem) onSubmit();
}
async function onSubmit() {
  isLoading.value = true;
  foundList.value = [];
  newLocationString.value = selectedSuggestionListItem.value
    ? `${selectedSuggestionListItem.value.name}, ${selectedSuggestionListItem.value.country}`
    : "";

  let newWeatherLocation: IGetWeatherSucceed | null = null;
  if (cityId.value)
    ({ location: newWeatherLocation, message: errStatus.value } =
      await getWeatherByCityId(cityId.value, props));

  if (newWeatherLocation) {
    emit("add-location", newWeatherLocation);
    newLocationString.value = "";
    cityId.value = 0;
  }

  setTimeout(() => inputField.value?.focus(), 0);
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
