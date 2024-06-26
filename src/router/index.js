import { createRouter, createWebHistory } from "vue-router";

const routes = [
  {
    path: "/",
    name: "home",
    component: () => import("../views/Home-view.vue"),
  },
  {
    path: "/login",
    name: "login",
    component: () => import("../views/Login-view.vue"),
  },
  {
    path: "/registration",
    name: "registration",
    component: () => import("../views/Registration-view.vue"),
  },
  {
    path: "/about",
    name: "about",
    component: () => import("../views/About-view.vue"),
  },
  {
    path: "/postLegend",
    name: "postLegend",
    component: () => import("../views/PostLegend-view.vue"),
  },
  {
    path: "/profile/:userId",
    name: "profle",
    component: () => import("../views/Profile-view.vue"),
  },
  {
    path: "/myLegends",
    name: "myLegends",
    component: () => import("../views/MyLegends-view.vue"),
  },
  {
    path: "/room/:roomName",
    name: "room",
    component: () => import("../views/Chat-view.vue"),
    props: true,
  },
  {
    path: "/messages",
    name: "Messages",
    component: () => import("../views/Messages-view.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
