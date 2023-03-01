<template>
  <datalist v-show="list.length" class="datalist">
    <option
      v-for="(item, index) in list"
      :key="item.id"
      :value="`${item.name}, ${item.country}`"
      :class="{
        'datalist__option--active': currentFocus === index,
      }"
      class="datalist__option"
      @click="onOptionSelect(index)"
    >
      {{ item.name }}, {{ item.country }}
    </option>
  </datalist>
</template>

<script setup lang="ts">
import { defineEmits, defineProps, ref, watchEffect } from "vue";
import { ICitiListItem } from "@/types/cityList";

const emit = defineEmits(["option-select"]);

const props = defineProps<{
  list: ICitiListItem[];
}>();

const currentFocus = ref(0);

watchEffect(() => {
  if (props.list.length) {
    document.addEventListener("keydown", keyHandler);
  } else {
    currentFocus.value = 0;
    document.removeEventListener("keydown", keyHandler);
  }
});

function keyHandler(e: KeyboardEvent) {
  if (e.key === "ArrowDown") {
    currentFocus.value = Math.min(
      props.list.length - 1,
      currentFocus.value + 1
    );
  } else if (e.key === "ArrowUp") {
    currentFocus.value = Math.max(0, currentFocus.value - 1);
  } else if (e.key === "Enter") {
    onOptionSelect(currentFocus.value);
  }
}
function onOptionSelect(index: number) {
  const item = props.list[index];
  emit("option-select", `${item.name}, ${item.country}`);
}
</script>
