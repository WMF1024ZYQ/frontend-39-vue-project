import Vue from "vue";
import Router from "vue-router";
import Login from "./views/Login/Login.vue";
import Home from "./views/Home/Home.vue";
import User from "./views/User/User.vue";
import Role from "./views/Role.vue";
import Rights from "./views/Rights/Rights.vue";
import Goods from "./views/Goods/Goods.vue";
import Categories from "./views/Goods/Categories.vue";
import GoodsAdd from "./views/Goods/Goods-add.vue";
import axios from "axios";
Vue.use(Router);

axios.defaults.baseURL = "http://localhost:8888/api/private/v1/";
axios.defaults.headers.common["Authorization"] = localStorage.getItem("token");

const router = new Router({
  routes: [
    {
      path: "/",
      redirect: "/home"
    },
    {
      path: "/login",
      component: Login
    },
    {
      path: "/home",
      component: Home,
      children: [
        {
          path: "/users",
          component: User
        },
        {
          path: "/roles",
          component: Role
        },
        {
          path: "/rights",
          component: Rights
        },
        {
          path: "/goods",
          component: Goods
        },
        {
          path: "/categories",
          component: Categories
        },
        {
          path: "/goods-add",
          component: GoodsAdd
        }
      ]
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
