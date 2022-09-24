<template>
  <div>
    <button id="add-new-button" @click="handleCreateTodo()">New Todo</button>
    <br />
    <DetectInactivity after="3000" @inactive="handleSyncToServer()" />

    <nested-draggable
      :todos="nestedTodos"
      @movedItem="onDragEnd()"
      @onInput="(element, text) => onInput(element, text)"
      @onDelete="(element) => deleteTodo(element)"
    />
  </div>
</template>

<script>
// @ is an alias to /src
import axios from "axios";
import DetectInactivity from "../components/detectInactivity.vue";
import nestedDraggable from "../components/nestedDraggable.vue";

export default {
  name: "TodosIndex",
  components: { DetectInactivity, nestedDraggable },
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
    async handleCreateTodo() {
      const newTodo = await this.createTodo();
      setTimeout(() => {
        document.getElementById("todo-nested-" + newTodo.id).focus();
      }, 50);
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
        return b - a;
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
        .patch("/todos/batch", batch, this.config)
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
      axios.get("/todos", this.config).then((response) => {
        this.todos = response.data;
        this.todos.sort((a, b) => b.order - a.order);
        this.convertToNested();
        this.convertToFlat();
      });
    },
    async createTodo(description) {
      const newTodo = await axios
        .post("/todos/", { description: description }, this.config)
        .then((response) => {
          this.newTodo = null;
          return response.data;
        });
      await this.getTodos();
      return newTodo;
    },
    updateTodo(todo) {
      axios.patch("/todos/" + todo.id, todo, this.config).then((response) => {
        console.log(response);
      });
    },
    deleteTodo(todo) {
      axios.delete("/todos/" + todo.id, this.config).then((response) => {
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
#add-new-button {
  border: solid thin;
  border-color: rgb(183, 183, 183);
  padding: 0.5rem;
  border-radius: 3px;
  width: 100%;
  cursor: pointer;
  text-align: center;
}
</style>
