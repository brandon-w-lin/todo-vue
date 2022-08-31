<template>
  <draggable
    class="item-container"
    tag="ul"
    :list="todos"
    :group="{ name: 'g1' }"
    item-key="description"
    @end="$emit('movedItem')"
    ghost-class="ghost"
  >
    <template #item="{ element }">
      <div>
        <p class="item">{{ element.description }}</p>
        <nested-draggable
          class="item-sub"
          :todos="element.todos"
          @movedItem="movedItem"
        />
      </div>
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
  computed: {
    dragOptions() {
      return {
        animation: 0,
        group: "description",
        disabled: false,
        ghostClass: "ghost",
      };
    },
  },
};
</script>
<style scoped>
.dragArea {
  min-height: 50px;
  outline: 1px solid;
}

.item-container {
  /* max-width: 20rem; */
  margin: 0;
}
.item {
  padding: 1rem;
  margin: 0.1rem;
  border: solid black 1px;
  background-color: #fefefe;
}
.item-sub {
  margin: 0 0 0 1rem;
}

.ghost {
  opacity: 0.5;
  background: grey;
}
</style>
