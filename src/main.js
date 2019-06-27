import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";

import "./assets/css/index.css";

Vue.config.productionTip = false;
Vue.use(ElementUI);

router.beforeEach((to, from, next) => {
  if (to.path === "/login") {
    next();
    return;
  }

  if (!localStorage.getItem("token")) {
    router.push("/login");
  }
  next();
});
new Vue({
  router,
  render: h => h(App)
}).$mount("#app");
