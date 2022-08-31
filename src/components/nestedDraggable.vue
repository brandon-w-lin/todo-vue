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
        <div class="item">
          <!-- The text-input-container, invisible items, and text-input classes are needed to disallow text selection from outside of the text area. See https://stackoverflow.com/questions/34354085/clicking-outside-a-contenteditable-div-stills-give-focus-to-it-->
          <div class="text-input-container">
            <span class="invisible">&#8203;</span>
            <div class="text-input">
              <div
                contenteditable="true"
                @blur="onInput(element)"
                :id="`todo-nested-${element.id}`"
              >
                {{ element.description }}
              </div>
            </div>
            <span class="invisible">&#8203;</span>
          </div>
        </div>
        <nested-draggable
          class="item-sub"
          :todos="element.todos"
          @movedItem="$emit('movedItem')"
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
  emits: ["movedItem", "onInput"],
  components: {
    draggable,
  },
  name: "nested-draggable",
  methods: {
    onInput(element) {
      let text = document.getElementById("todo-nested-" + element.id).innerText;
      this.$emit("onInput", element, text);
      // element.description = text;
      // console.log(element.description);
      // this.needToSyncWithServer = true;
      // element.updateDescription = true;
      // todo.updateDescription = true;
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

div.text-input-container {
  -webkit-user-select: none;
}
.invisible {
  visibility: hidden;
}

div.text-input {
  display: inline-block;
}
div.text-input:focus-within {
  background-color: cornsilk;
}
</style>
