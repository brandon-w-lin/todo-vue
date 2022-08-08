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
    <DetectInactivity after="3000" @inactive="handleInactivity()" />
    <draggable
      v-model="todos"
      @start="onDragStart()"
      @end="onDragEnd()"
      item-key="id"
      ghost-class="ghost"
      class="list-group"
    >
      <!-- For some reason, this MUST be called element -->
      <template #item="{ element }">
        <div class="list-group-item">
          <span
            contenteditable="true"
            @input="onInput(element)"
            :id="`todo-${element.id}`"
          >
            {{ element.description }}
          </span>
          <span class="fa fa-times close" @click="deleteTodo(element)">x</span>
        </div>
      </template>
    </draggable>
  </div>
</template>

<script>
// @ is an alias to /src
import axios from "axios";
import draggable from "vuedraggable";
import DetectInactivity from "../components/detectInactivity.vue";

export default {
  name: "TodosIndex",
  components: { draggable, DetectInactivity },
  data() {
    return {
      todos: [], // must be an array to work with Draggable
      oldIndex: "",
      newIndex: "",
      config: {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("jwt"),
        },
      },
      newTodo: null,
      needToSyncWithServer: false,
      editsQueue: {
        updates: {},
      },
    };
  },
  methods: {
    onInput(element) {
      let text = document.getElementById("todo-" + element.id).innerText;
      element.description = text;
      element.updateDescription = true;
      // todo.updateDescription = true;
    },
    handleInactivity() {
      console.log("User is inactive. Running inactivity handler");
      if (this.todos.find((todo) => todo.updateDescription === true)) {
        this.syncDescription();
      }
      if (this.needToSyncWithServer) {
        this.needToSyncWithServer = false;
        this.syncOrder();
      }
    },
    syncOrder() {
      console.log("Client is out of sync with server, running sync service");
      const batch_order = this.createBatch_Order();
      // console.log(batch_order);
      axios
        .patch(
          "http://localhost:3000/todos/batch/order",
          batch_order,
          this.config
        )
        .then((response) => {
          console.log(response);
        })
        .catch((error) => {
          console.log(error);
        });
    },
    syncDescription() {
      console.log("Client is out of sync with server, running sync service");
      const batch_description = this.createBatch_Description();
      console.log(batch_description);
      axios
        .patch(
          "http://localhost:3000/todos/batch/description",
          batch_description,
          this.config
        )
        .then((response) => {
          console.log(response);
          this.todos.forEach((todo) => (todo.updateDescription = false));
        })
        .catch((error) => {
          console.log(error);
        });
    },
    createBatch_Order() {
      // First get IDs in the array
      const possible_ids = this.todos.map((todo) => todo.id);

      // Sort them
      possible_ids.sort();

      // create batch order and return
      const batch = this.todos.map((todo) => ({
        id: todo.id,
        order: possible_ids.shift(),
      }));
      return batch;
    },

    createBatch_Description() {
      // First get list of id's that were changed
      const changed_todos = this.todos.filter(
        (todo) => todo.updateDescription === true
      );
      const batch = changed_todos.map((todo) => ({
        id: todo.id,
        description: todo.description,
      }));
      console.log(batch);
      return batch;
      // console.log(changed_todos);
    },

    // RELATING TO DRAGGABLE
    onDragStart() {
      // this.needToSyncWithServer = true;
    },
    onDragEnd() {
      this.needToSyncWithServer = true;
    },

    handleEdit(todo) {
      todo.update = false;
      this.updateTodo(todo);
    },

    // REST ACTIONS
    getTodos() {
      axios.get("http://localhost:3000/todos", this.config).then((response) => {
        this.todos = response.data;
        this.todos.sort((a, b) => a.order - b.order);
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
} */
</style>
