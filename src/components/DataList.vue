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
      tabindex="0"
      @focus="currentFocus = index"
      @click="onOptionSelect"
      @keydown.enter.prevent="onOptionSelect"
    >
      {{ item.name }}, {{ item.country }}
    </option>
  </datalist>
</template>

<script setup lang="ts">
import { defineEmits, defineProps, ref, watchEffect } from "vue";
import { OptionEvent } from "@/types/events";
import { ICitiListItem } from "@/types/cityList";

const emit = defineEmits(["option-select"]);

const props = defineProps<{
  list: ICitiListItem[];
  isLostFocus: boolean;
}>();

const currentFocus = ref<number>(-1);

watchEffect(() => {
  if (!props.list.length) currentFocus.value = -1;
});

watchEffect(() => {
  if (props.isLostFocus) currentFocus.value = -1;
});

function onOptionSelect(e: OptionEvent) {
  emit("option-select", e.target.value);
}
</script>
