<template>
  <footer class="settings-section-footer">
    <input
      v-model="inputModel"
      id="settings-toggle"
      type="checkbox"
      name="additional-settings"
      class="settings-section-footer__additional-settings-input visually-hidden"
      @keydown.enter="inputModel = !inputModel"
    />
    <label
      for="settings-toggle"
      class="settings-section-footer__additional-settings-label"
      :style="inputModel ? labelStyles.additional : labelStyles.base"
    >
      {{ inputModel ? dict.baseSettings : dict.additionalSettings }}
    </label>
  </footer>
</template>

<script setup lang="ts">
import { defineProps, defineEmits, computed } from "vue";
import { IDictionary } from "@/locales/types";

const emit = defineEmits(["toggle-settings"]);

const props = defineProps<{
  model: boolean;
  dict: IDictionary;
}>();

const labelStyles = {
  base: {
    backgroundImage: `url(${require("@/assets/icons/right.svg")})`,
    backgroundPosition: "right",
    paddingRight: "20px",
  },
  additional: {
    backgroundImage: `url(${require("@/assets/icons/left.svg")})`,
    backgroundPosition: "left",
    paddingLeft: "20px",
  },
};

const inputModel = computed<boolean>({
  get: () => props.model,
  set: (value) => emit("toggle-settings", value),
});
</script>
