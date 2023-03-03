<template>
  <div class="suggestion-list">
    <ul class="suggestion-list__list">
      <li
        v-for="(item, index) in list"
        :key="item.id"
        :ref="setSuggestionRef"
        :class="{
          'suggestion-list__option--active': currentFocus === index,
        }"
        class="suggestion-list__item"
        v-html="modifyMatchText(`${item.name}, ${item.country}`, searchString)"
        @click="onSuggestionSelect(index)"
      />
    </ul>
  </div>
</template>

<script setup lang="ts">
import {
  defineEmits,
  defineProps,
  ref,
  watchEffect,
  onBeforeUpdate,
} from "vue";
import { ICitiListItem } from "@/types/cityList";
import modifyMatchText from "@/utils/modifyMatchText";
import scrollSelectionIntoView from "@/utils/scrollSelectionIntoView";

const emit = defineEmits(["suggestion-select"]);

const props = defineProps<{
  list: ICitiListItem[];
  searchString: string;
}>();

const currentFocus = ref(0);

let suggestionsRefs: HTMLLIElement[] = [];
const setSuggestionRef = (el: HTMLLIElement) => {
  if (el) suggestionsRefs.push(el);
};

onBeforeUpdate(() => {
  suggestionsRefs = [];
});

watchEffect(() => {
  const listLength = props.list.length;

  if (listLength) {
    document.addEventListener("keydown", keyHandler);
  } else {
    document.removeEventListener("keydown", keyHandler);
  }

  if (!listLength || listLength <= currentFocus.value) currentFocus.value = 0;
});

function keyHandler(e: KeyboardEvent) {
  const maxListIndex = props.list.length - 1;

  if (e.key === "Enter") {
    onSuggestionSelect(currentFocus.value);
    return;
  } else if (e.key === "ArrowDown") {
    currentFocus.value =
      currentFocus.value === maxListIndex ? 0 : currentFocus.value + 1;
  } else if (e.key === "ArrowUp") {
    currentFocus.value =
      currentFocus.value === 0 ? maxListIndex : currentFocus.value - 1;
  }
  scrollSelectionIntoView(suggestionsRefs[currentFocus.value]);
}
function onSuggestionSelect(index: number) {
  emit("suggestion-select", props.list[index]);
}
</script>
