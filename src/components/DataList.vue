<template>
  <datalist v-show="list.length" class="datalist">
    <option
      v-for="(item, index) in props.list"
      :key="item.id"
      :ref="`option-${index}`"
      :value="`${item.name}, ${item.country}`"
      :class="{
        'datalist__option--active': currentFocus === index,
      }"
      class="datalist__option"
      tabindex="0"
      @click="onOptionSelect"
      @keydown.enter.prevent="onOptionSelect"
    >
      {{ item.name }}, {{ item.country }}
    </option>
  </datalist>
</template>

<script setup lang="ts">
import { defineEmits, defineProps, ref, watch } from "vue";
import { OptionEvent } from "@/types/events";
import { ICitiListItem } from "@/types/cityList";

const emit = defineEmits(["option-select"]);

const props = defineProps<{
  list: ICitiListItem[];
}>();

const currentFocus = ref<number>(-1);

watch(props.list, () => {
  if (!props.list.length) currentFocus.value = -1;
});

function onOptionSelect(e: OptionEvent) {
  emit("option-select", e.target.value);
}
</script>
