<template>
  <div v-if="isLoggedIn">
    <div>Username: {{ user.username }}</div>
    <div>Email: {{ user.email }}</div>
    <div>Member since: {{ user.createdAt.slice(0, 10) }}</div>
    <!-- {{ user }} -->
  </div>
  <div v-else>
    You are not logged in.

    <router-link to="/login">Login</router-link>
    |
    <router-link to="/signup">Signup</router-link>
  </div>
</template>

<script>
// @ is an alias to /src
import axios from "axios";

export default {
  props: { isLoggedIn: Boolean },
  name: "MyAccount",
  data() {
    return {
      user: {},
      config: {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("jwt"),
        },
      },
    };
  },
  methods: {
    getMyAccountInfo() {
      axios.get("/users/me", this.config).then((response) => {
        this.user = response.data;
      });
    },
  },
  created() {
    this.getMyAccountInfo();
  },
};
</script>
