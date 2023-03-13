<template>
  <div class="select-language">
    <label for="select-language" class="select-language__label">
      {{ dict.selectLanguage }}
    </label>

    <div class="select-language__wrapper">
      <select
        v-model="langModel"
        id="select-language"
        name="language"
        :style="{
          backgroundImage: `url(${require('@/assets/icons/triangle.svg')})`,
        }"
        class="select-language__select"
        @change="onChange"
      >
        <option v-for="item in languages" :key="item.name" :value="item.value">
          {{ item.name }}
        </option>
      </select>

      <div
        class="select-language__tooltip"
        :style="{
          backgroundImage: `url(${require('@/assets/icons/info.svg')})`,
        }"
      >
        <span class="select-language__tooltip-text">
          {{ dict.tooltipText }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineEmits, defineProps, onBeforeMount, ref } from "vue";
import { TLanguage } from "@/types";
import { IDictionary } from "@/locales/types";

const emit = defineEmits(["change-language"]);

const props = defineProps<{
  lang: TLanguage;
  dict: IDictionary;
}>();

onBeforeMount(() => (langModel.value = props.lang));

const langModel = ref<TLanguage>("en");
const languages = [
  { name: "English", value: "en" },
  { name: "Russian", value: "ru" },
];

function onChange() {
  emit("change-language", langModel.value);
}
</script>
