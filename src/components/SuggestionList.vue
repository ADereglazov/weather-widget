<template>
  <div class="suggestion-list">
    <ul tabindex="-1" class="suggestion-list__list">
      <li
        v-for="(item, index) in list"
        :key="item.id"
        :ref="setSuggestionRef"
        :class="{
          'suggestion-list__item--active': currentFocus === index,
        }"
        class="suggestion-list__item"
        @mousedown.prevent
        @click="onSuggestionSelect(item, true)"
      >
        <span class="suggestion-list__item-name">{{ item.name }}</span>
        <span class="suggestion-list__item-country">{{
          ", " + item.sys.country
        }}</span>
        <span
          :style="{
            backgroundImage: `url(${require('@/assets/icons/flags/' +
              item.sys.country.toLowerCase() +
              '.svg')})`,
          }"
          class="suggestion-list__item-flag"
        ></span>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits, onBeforeUpdate, onUpdated } from "vue";
import { scrollSelectionIntoView } from "@/utils";
import { IWeatherLocation } from "@/types";

let suggestionsRefs: HTMLLIElement[] = [];
const setSuggestionRef = (el: HTMLLIElement) => {
  if (el) suggestionsRefs.push(el);
};

onBeforeUpdate(() => {
  suggestionsRefs = [];
});

onUpdated(() => scrollSelectionIntoView(suggestionsRefs[props.currentFocus]));

const props = defineProps<{
  list: IWeatherLocation[];
  searchString: string;
  currentFocus: number;
}>();

const emit = defineEmits(["suggestion-select"]);

function onSuggestionSelect(
  item: IWeatherLocation,
  isClickSuggestionItem = false
) {
  emit("suggestion-select", { item, isClickSuggestionItem });
}
</script>
