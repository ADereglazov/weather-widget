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

<script>
import DeleteIcon from "@/assets/icons/delete.svg";

export default {
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
};
</script>
