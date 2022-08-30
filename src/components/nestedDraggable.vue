<template>
  <draggable
    class="dragArea"
    tag="ul"
    :list="todos"
    :group="{ name: 'g1' }"
    item-key="description"
    @end="$emit('movedItem')"
  >
    <template #item="{ element }">
      <li>
        <p>{{ element.description }}</p>
        <nested-draggable :todos="element.todos" @movedItem="movedItem" />
      </li>
    </template>
  </draggable>
</template>
<script>
import draggable from "vuedraggable";
export default {
  props: {
    todos: {
      required: true,
      type: Array,
    },
  },
  emits: ["movedItem"],
  components: {
    draggable,
  },
  name: "nested-draggable",
  methods: {
    movedItem() {
      this.$emit("movedItem");
    },
  },
};
</script>
<style scoped>
.dragArea {
  min-height: 50px;
  outline: 1px dashed;
}
</style>
