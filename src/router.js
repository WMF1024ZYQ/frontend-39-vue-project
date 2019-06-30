import Vue from "vue";
import Router from "vue-router";
import Login from "./views/Login.vue";
import Home from "./views/Home.vue";
import User from "./views/user.vue";

Vue.use(Router);

const router = new Router({
  routes: [
    {
      path: "/login",
      component: Login
    },
    {
      path: "/home",
      component: Home,
      children: [
        {
          path: "/user",
          component: User
        }
      ]
    },
    {
      path: "/",
      redirect: "/home"
    }
  ]
});

//路由守卫
router.beforeEach((to, from, next) => {
  if (to.path === "/login") {
    next();
    return;
  }

  if (!localStorage.getItem("token")) {
    router.push("/login");
    return;
  }
  next();
});

export default router;
