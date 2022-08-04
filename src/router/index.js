import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import LoginView from "../views/LoginView.vue";
import SignupView from "../views/SignupView.vue";
import TodosIndex from "../views/TodosIndex.vue";
import MyAccount from "../views/MyAccount.vue";
import AdminView from "../views/AdminView.vue";

const routes = [
  {
    path: "/",
    name: "home",
    component: HomeView,
  },
  {
    path: "/login",
    name: "login",
    component: LoginView,
  },
  {
    path: "/signup",
    name: "signup",
    component: SignupView,
  },
  {
    path: "/todos",
    name: "todos-index",
    component: TodosIndex,
  },
  {
    path: "/users/me",
    name: "my-account",
    component: MyAccount,
  },
  {
    path: "/admin",
    name: "admin-view",
    component: AdminView,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
