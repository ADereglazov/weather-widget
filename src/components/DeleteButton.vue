<template>
  <button
    class="delete-button"
    type="button"
    name="delete"
    aria-label="Delete item"
    @click="onClick"
  >
    <DeleteIcon class="delete-button__icon" />
  </button>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import DeleteIcon from "@/components/icons/DeleteIcon.vue";

export default defineComponent({
  name: "DeleteButton",
  components: { DeleteIcon },
  emits: ["delete"],
  setup(props, { emit }) {
    function onClick() {
      emit("delete");
    }

    return {
      onClick,
    };
  },
});
</script>
