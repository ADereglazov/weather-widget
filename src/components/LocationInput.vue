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
  getWeatherByCityName,
  IGetWeatherSucceed,
  IGetWeatherFetchByNameSucceed,
} from "@/services/fetchWeather";
import { TLanguage, TUnits, IWeatherLocation } from "@/types";
import { IDictionary } from "@/locales/types";
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

const foundList = ref<IWeatherLocation[]>([]);
const throttledOnInput = throttle(onSubmit, 1000);
const inputField = ref<HTMLInputElement | null>(null);
const currentFocus = ref(0);
const selectedSuggestionListItem = ref<IWeatherLocation | null>(null);
const newLocationString = ref("");
const errStatus = ref("");
const isLoading = ref(false);

onMounted(() => inputField.value?.focus());

watchEffect(() => emit("loading", isLoading.value));

const isSubmitButtonDisabled = computed<boolean>(
  () => newLocationString.value.length === 0 || isLoading.value
);

function onInput() {
  errStatus.value = "";
  foundList.value = [];
  selectedSuggestionListItem.value = null;
  if (newLocationString.value.trim().length < 3) return;
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
  let newWeatherLocation: IGetWeatherSucceed | null;
  ({ location: newWeatherLocation, message: errStatus.value } =
    await getWeatherByCityId(id, props));

  if (newWeatherLocation) {
    emit("add-location", newWeatherLocation);
    newLocationString.value = "";
  }
  foundList.value = [];
}
async function onSubmit() {
  isLoading.value = true;

  if (selectedSuggestionListItem.value) {
    await addSelectedLocation(selectedSuggestionListItem.value.id);
  } else {
    let locationsList: IGetWeatherFetchByNameSucceed | null;
    ({ location: locationsList, message: errStatus.value } =
      await getWeatherByCityName(newLocationString.value.trim(), props));

    if (locationsList?.count) {
      foundList.value = [...locationsList.list];
      selectedSuggestionListItem.value = foundList.value[0];
      currentFocus.value = 0;
    }
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
  });
}
function onClickClear() {
  newLocationString.value = "";
  errStatus.value = "";
  foundList.value = [];
  inputField.value?.focus();
}
</script>
