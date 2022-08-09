<template>
  <nav class="navbar navbar-expand-lg navbar-light bg-light">
    <div class="container">
      <router-link to="/todos" class="navbar-brand">Home</router-link>

      <button
        class="navbar-toggler"
        type="button"
        data-toggle="collapse"
        data-target="#navbarSupportedContent"
        aria-controls="navbarSupportedContent"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>

      <div class="collapse navbar-collapse" id="navbarSupportedContent">
        <ul class="navbar-nav mr-auto"></ul>
        <ul class="navbar-nav" v-if="isLoggedIn">
          <li class="nav-item">
            <router-link to="/users/me" class="nav-link"
              >My Account</router-link
            >
          </li>
          <li class="nav-item">
            <router-link to="/login" class="nav-link" @click="$emit('logout')"
              >Log Out</router-link
            >
          </li>
        </ul>
        <ul v-else class="navbar-nav">
          <li class="nav-item">
            <router-link to="/login" class="nav-link">Log In</router-link>
          </li>
          <li class="nav-item">
            <router-link to="/signup" class="nav-link">Sign Up</router-link>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script>
export default {
  props: {
    isLoggedIn: Boolean,
  },
};
</script>
