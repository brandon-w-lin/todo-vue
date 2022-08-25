<template>
  <div class="holder">
    <pre>
      {{ JSON.stringify(todos, null, 2) }}
    </pre>
  </div>
</template>
<script>
export default {
  props: {
    todos: {
      required: true,
      type: Array,
    },
  },
  name: "show-data",
  computed: {
    todos_string() {
      return JSON.stringify(this.todos, null, 2);
    },
  },
};
</script>
<style>
pre {
  border: solid;
  padding: 5px;
}
</style>
