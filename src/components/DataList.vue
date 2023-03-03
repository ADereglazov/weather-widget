<template>
  <div v-show="list.length && isInputFocused" class="datalist">
    <ul ref="dataList" class="datalist__list">
      <li
        v-for="(item, index) in list"
        :key="item.id"
        :ref="setOptionsRef"
        :class="{
          'datalist__option--active': currentFocus === index,
        }"
        class="datalist__option"
        v-html="modifyMatchText(`${item.name}, ${item.country}`, searchString)"
        @click="onOptionSelect(index)"
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

const emit = defineEmits(["option-select"]);

const props = defineProps<{
  list: ICitiListItem[];
  searchString: string;
  isInputFocused: boolean;
}>();

const currentFocus = ref(0);
const dataList = ref<HTMLUListElement | null>(null);
let optionRefs: HTMLLIElement[] = [];
const setOptionsRef = (el: HTMLLIElement) => {
  if (el) optionRefs.push(el);
};

onBeforeUpdate(() => {
  optionRefs = [];
});

watchEffect(() => {
  const listLength = props.list.length;

  if (listLength && props.isInputFocused) {
    document.addEventListener("keydown", keyHandler);
  } else {
    document.removeEventListener("keydown", keyHandler);
  }

  if (!listLength || listLength <= currentFocus.value) currentFocus.value = 0;
});

function keyHandler(e: KeyboardEvent) {
  const maxListIndex = props.list.length - 1;

  if (e.key === "Enter") {
    onOptionSelect(currentFocus.value);
    return;
  } else if (e.key === "ArrowDown") {
    currentFocus.value =
      currentFocus.value === maxListIndex ? 0 : currentFocus.value + 1;
  } else if (e.key === "ArrowUp") {
    currentFocus.value =
      currentFocus.value === 0 ? maxListIndex : currentFocus.value - 1;
  }
  scrollSelectionIntoView(optionRefs[currentFocus.value]);
}
function onOptionSelect(index: number) {
  emit("option-select", props.list[index]);
}
</script>
