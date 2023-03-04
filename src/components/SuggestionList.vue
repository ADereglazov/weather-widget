<template>
  <div class="suggestion-list">
    <ul class="suggestion-list__list">
      <li
        v-for="(item, index) in list"
        :key="item.id"
        :ref="setSuggestionRef"
        :class="{
          'suggestion-list__item--active': currentFocus === index,
        }"
        class="suggestion-list__item"
        v-html="modifyMatchText(`${item.name}, ${item.country}`, searchString)"
        @click="onSuggestionSelect(index, true)"
      />
    </ul>
  </div>
</template>

<script setup lang="ts">
import {
  defineEmits,
  defineProps,
  ref,
  watch,
  computed,
  onBeforeUpdate,
  onUpdated,
} from "vue";
import { ICitiListItem } from "@/types/cityList";
import modifyMatchText from "@/utils/modifyMatchText";
import scrollSelectionIntoView from "@/utils/scrollSelectionIntoView";

const emit = defineEmits(["suggestion-select"]);

const props = defineProps<{
  list: ICitiListItem[];
  searchString: string;
}>();

const listLength = computed(() => props.list.length);

const currentFocus = ref(0);

let suggestionsRefs: HTMLLIElement[] = [];
const setSuggestionRef = (el: HTMLLIElement) => {
  if (el) suggestionsRefs.push(el);
};

onBeforeUpdate(() => {
  suggestionsRefs = [];
});

onUpdated(() => {
  if (listLength.value) {
    onSuggestionSelect(currentFocus.value);
    document.addEventListener("keydown", keyHandler);
  } else {
    currentFocus.value = 0;
    document.removeEventListener("keydown", keyHandler);
  }
});

watch(listLength, (newVal, oldVal) => {
  if (newVal < oldVal) {
    currentFocus.value = 0;
  }
});

function keyHandler(e: KeyboardEvent) {
  const maxListIndex = props.list.length - 1;

  if (e.key === "ArrowDown") {
    currentFocus.value =
      currentFocus.value === maxListIndex ? 0 : currentFocus.value + 1;
  } else if (e.key === "ArrowUp") {
    currentFocus.value =
      currentFocus.value === 0 ? maxListIndex : currentFocus.value - 1;
  }
  onSuggestionSelect(currentFocus.value);
  scrollSelectionIntoView(suggestionsRefs[currentFocus.value]);
}
function onSuggestionSelect(index: number, isClickSuggestionItem = false) {
  const item = props.list[index];
  emit("suggestion-select", { item, isClickSuggestionItem });
}
</script>
