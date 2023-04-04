<template>
  <div class="error-alert">
    {{ errStatus }}

    <ReloadButton
      :dict="dict"
      class="error-alert__reload-button"
      @reload="emit('reload')"
    />
  </div>
</template>

<script setup lang="ts">
import { defineEmits, defineProps } from "vue";
import { IDictionary } from "@/locales/types";
import ReloadButton from "@/components/ReloadButton.vue";

const emit = defineEmits(["reload"]);

defineProps<{
  errStatus: string;
  dict: IDictionary;
}>();
</script>
