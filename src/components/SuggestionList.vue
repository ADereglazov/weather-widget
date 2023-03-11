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
        v-html="modifyMatchText(`${item.name}, ${item.country}`, searchString)"
        @click="onSuggestionSelect(item, true)"
      />
    </ul>
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits, onBeforeUpdate, onUpdated } from "vue";
import { ICitiListItem } from "@/types";
import { modifyMatchText, scrollSelectionIntoView } from "@/utils";

let suggestionsRefs: HTMLLIElement[] = [];
const setSuggestionRef = (el: HTMLLIElement) => {
  if (el) suggestionsRefs.push(el);
};

onBeforeUpdate(() => {
  suggestionsRefs = [];
});

onUpdated(() => scrollSelectionIntoView(suggestionsRefs[props.currentFocus]));

const props = defineProps<{
  list: ICitiListItem[];
  searchString: string;
  currentFocus: number;
}>();

const emit = defineEmits(["suggestion-select"]);

function onSuggestionSelect(
  item: ICitiListItem,
  isClickSuggestionItem = false
) {
  emit("suggestion-select", { item, isClickSuggestionItem });
}
</script>
