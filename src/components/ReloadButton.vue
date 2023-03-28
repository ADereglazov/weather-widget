<template>
  <button
    :aria-label="dict[props.lang].reload"
    :style="{
      backgroundImage: `url(${require('@/assets/icons/reload.svg')})`,
    }"
    type="button"
    class="reload-button"
    @click="emit('reload')"
  />
</template>

<script setup lang="ts">
import { defineEmits, defineProps } from "vue";
import { TLanguage } from "@/types";
import { IDictionary } from "@/locales/types";

const emit = defineEmits(["reload"]);

const props = defineProps<{
  lang: TLanguage;
  dict: IDictionary;
}>();
</script>
