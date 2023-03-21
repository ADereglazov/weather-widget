<template>
  <div class="select-language">
    <label for="select-language" class="select-language__label">
      {{ dict.selectLanguage }}
    </label>

    <select
      v-model="langModel"
      id="select-language"
      name="language"
      :disabled="disabled"
      :style="{
        backgroundImage: `url(${require('@/assets/icons/triangle.svg')})`,
      }"
      class="select-language__select"
      @change="onChange"
    >
      <option v-for="item in LANGUAGES" :key="item" :value="item">
        {{ dict.languages[item] }}
      </option>
    </select>
  </div>
</template>

<script setup lang="ts">
import { defineEmits, defineProps, onBeforeMount, ref } from "vue";
import { LANGUAGES, TLanguage } from "@/types";
import { IDictionary } from "@/locales/types";

const emit = defineEmits(["change-language"]);

const props = defineProps<{
  lang: TLanguage;
  dict: IDictionary;
  disabled: boolean;
}>();

onBeforeMount(() => (langModel.value = props.lang));

const langModel = ref<TLanguage>("en");

function onChange() {
  emit("change-language", langModel.value);
}
</script>
