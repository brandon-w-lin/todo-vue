<template>
  <div>
    <div>
      <form @submit="createTodo">
        <input
          type="text"
          placeholder="Enter new todos here..."
          v-model="newTodo"
        />
        <button>submit</button>
      </form>
    </div>
    <br />
    <DetectInactivity after="3000" @inactive="handleSyncToServer()" />
    <draggable
      v-model="todos"
      @end="onDragEnd()"
      item-key="id"
      ghost-class="ghost"
      class="list-group"
    >
      <template #item="{ element }">
        <div class="list-group-item grabbable">
          <span
            class="description"
            contenteditable="true"
            @input="onInput(element)"
            :id="`todo-${element.id}`"
          >
            {{ element.description }}
          </span>
        </div>
      </template>
    </draggable>

    <nested-draggable
      :todos="nestedTodos"
      @movedItem="onDragEnd()"
      @onInput="(element, text) => onInput(element, text)"
      @onDelete="(element) => deleteTodo(element)"
    />

    <!-- <ShowData :todos="todos"></ShowData> -->
    <ShowData :todos="nestedTodos"></ShowData>
    <ShowData :todos="flatTodos"></ShowData>
  </div>
</template>

<script>
// @ is an alias to /src
import axios from "axios";
import draggable from "vuedraggable";
import DetectInactivity from "../components/detectInactivity.vue";
import nestedDraggable from "../components/nestedDraggable.vue";
import ShowData from "../components/ShowData.vue";

export default {
  name: "TodosIndex",
  components: { draggable, DetectInactivity, nestedDraggable, ShowData },
  data() {
    return {
      todos: [], // must be an array to work with Draggable
      nestedTodos: [],
      flatTodos: [],
      oldIndex: "",
      newIndex: "",
      config: {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("jwt"),
        },
      },
      newTodo: null,
      needToSyncWithServer: false,
      needingSync: [],
    };
  },
  methods: {
    movedItem() {
      console.log("test");
    },
    handleSyncToServer() {
      console.log("User is inactive. Running inactivity handler");
      // if (this.todos.find((todo) => todo.updateDescription === true)) {
      //   this.syncDescription();
      // }
      if (this.needToSyncWithServer) {
        this.needToSyncWithServer = false;
        this.sync();
      }
    },
    convertToFlat() {
      let output = [];

      function flatten(old_obj, parent_id) {
        let obj = { ...old_obj };

        obj.parent_id = parent_id;

        if (obj.todos.length > 0) {
          obj.todos.forEach((todo) => flatten(todo, obj.id));
        }
        delete obj.todos;
        output.push(obj);
      }
      this.nestedTodos.forEach((todo) => {
        flatten(todo, null);
      });
      console.log("Convert to flat output: ", output);
      this.flatTodos = output;
      return output;
    },
    convertToNested() {
      // create new instances of each object or we will end up modifying the master
      // let flat = this.todos.map((todo) => ({ ...todo }));
      let flat = this.todos;
      flat.forEach((item) => (item.todos = []));

      function checkLeftOvers(leftOvers, possibleParent) {
        for (let i = 0; i < leftOvers.length; i++) {
          if (leftOvers[i].parent_id === possibleParent.id) {
            possibleParent.todos
              ? possibleParent.todos.push(leftOvers[i])
              : (possibleParent.todos = [leftOvers[i]]);
            const addedObj = leftOvers.splice(i, 1);
            checkLeftOvers(leftOvers, possibleParent);
            checkLeftOvers(leftOvers, addedObj[0]);
          }
        }
      }

      function findParent(possibleParents, possibleChild) {
        let found = false;
        for (let i = 0; i < possibleParents.length; i++) {
          if (possibleParents[i].id === possibleChild.parent_id) {
            found = true;
            if (possibleParents[i].todos)
              possibleParents[i].todos.push(possibleChild);
            else possibleParents[i].todos = [possibleChild];
            return true;
          } else if (possibleParents[i].todos)
            found = findParent(possibleParents[i].todos, possibleChild);
        }
        return found;
      }

      const nested = flat.reduce(
        (initial, value, index, original) => {
          if (value.parent_id === null) {
            // check if any of the children are waiting on this node so they can attach to it
            if (initial.unplaced.length)
              checkLeftOvers(initial.unplaced, value);
            initial.nested.push(value);
          } else {
            // parent id exists -> need to find it and attach this node
            let parentFound = findParent(initial.nested, value);
            if (parentFound) {
              checkLeftOvers(initial.unplaced, value);
            } else {
              initial.unplaced.push(value);
            }
          }
          return index < original.length - 1 ? initial : initial.nested;
        },
        { nested: [], unplaced: [] }
      );
      this.nestedTodos = nested;
      return nested;
    },

    sync() {
      this.convertToFlat();
      // get all IDs and sort ascending
      const possible_ids = this.flatTodos.map((todo) => todo.id);
      possible_ids.sort((a, b) => {
        return a - b;
      });
      console.log("Possible IDs: ", possible_ids);
      // create batch update
      const batch = this.flatTodos.map((todo) => ({
        id: todo.id,
        order: possible_ids.shift(),
        description: todo.description,
        completed: todo.completed,
        parent_id: todo.parent_id,
      }));
      console.log("batch: ", batch);
      // send batch update
      axios
        .patch("http://localhost:3000/todos/batch", batch, this.config)
        .then((response) => {
          console.log(response);
        })
        .catch((error) => {
          console.log(error);
        });
    },

    // TRIGGERS FOR SYNC WITH SERVER:
    // CHANGE POSITION
    onDragEnd() {
      console.log("drag end, setting sync with server to true");
      this.needToSyncWithServer = true;
    },

    // CHANGE CONTENT
    onInput(element, text) {
      console.log("Calling onInput in TodosIndex for :", element);
      // let text = document.getElementById("todo-" + element.id).innerText;
      element.description = text;
      this.needToSyncWithServer = true;
      // element.updateDescription = true;
      // todo.updateDescription = true;
    },

    // SINGLE REST ACTIONS (DEPRECATED -> USE BATCH)
    getTodos() {
      axios.get("http://localhost:3000/todos", this.config).then((response) => {
        this.todos = response.data;
        this.todos.sort((a, b) => a.order - b.order);
        this.convertToNested();
        this.convertToFlat();
      });
    },
    createTodo() {
      axios
        .post(
          "http://localhost:3000/todos/",
          { description: this.newTodo },
          this.config
        )
        .then((response) => {
          console.log(response);
          this.newTodo = null;
          this.getTodos();
        });
    },
    updateTodo(todo) {
      axios
        .patch("http://localhost:3000/todos/" + todo.id, todo, this.config)
        .then((response) => {
          console.log(response);
        });
    },
    deleteTodo(todo) {
      axios
        .delete("http://localhost:3000/todos/" + todo.id, this.config)
        .then((response) => {
          console.log(response);
          this.getTodos();
        });
    },
  },
  created() {
    this.getTodos();
    window.addEventListener("beforeunload", () => {
      this.handleSyncToServer();
    });
  },
  watch: {
    todos() {
      console.log("todos changed");
    },
  },
};
</script>

<style>
.ghost {
  opacity: 0.5;
  background: grey;
}

[contenteditable] {
  outline: 0px solid transparent;
}

.grabbable {
  cursor: move;
  cursor: grab;
}
.grabbable:active {
  cursor: grabbing;
}

.description {
  cursor: text;
}
/* .todo {
  text-align: left;
  outline: solid;
  outline-width: thin;
  padding: 5px;
  margin: 10px;
} */

/* .description {
  width: 300px;
  display: inline-block;
} */

/* input[type="text"] {
  outline: none;
  border: none;
  font-family: inherit;
  font-size: inherit;
} */ ;
</style>
