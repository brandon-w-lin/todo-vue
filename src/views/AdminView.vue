<template>
  <div v-if="adminRights">
    <div>
      <button @click="getUsers()">List of users</button>
      <div v-for="user in users" :key="user.id">{{ user.username }}</div>
    </div>
    <div>
      <button @click="getRoles()">List of users by role</button>
      <div v-for="role in roles" :key="role.id">
        <br />
        <b>
          {{ role.name }}
        </b>
        <br />
        <div v-for="user in role.users" :key="user.id">
          {{ user.username }}
        </div>
      </div>
    </div>
  </div>
  <div v-else>You are not authorized to view this resource.</div>
</template>

<script>
// @ is an alias to /src
import axios from "axios";

export default {
  props: { isLoggedIn: Boolean },
  name: "MyAccount",
  data() {
    return {
      config: {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("jwt"),
        },
      },
      adminRights: false,
      users: {},
      roles: {},
    };
  },
  methods: {
    authorization() {
      axios.get("/users/me", this.config).then((response) => {
        const highestRole = Math.max(
          response.data.roles.map((role) => role.id)
        );
        if (highestRole > 1) {
          this.adminRights = true;
        }
      });
    },
    getUsers() {
      axios.get("/users", this.config).then((response) => {
        this.users = response.data;
      });
    },
    getRoles() {
      axios.get("/roles", this.config).then((response) => {
        this.roles = response.data;
      });
    },
  },
  created() {
    this.authorization();
  },
};
</script>
