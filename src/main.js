import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import ElementUI from "element-ui";
import axios from "axios";
import "element-ui/lib/theme-chalk/index.css";

import "./assets/css/index.css";

Vue.use(ElementUI);
Vue.config.productionTip = false;

// 添加响应拦截器
axios.interceptors.response.use(
  function(res) {
    if (res.status == 401) {
      router.push("/login");
    }
    return res;
  },
  function(error) {
    // 对响应错误做点什么
    return Promise.reject(error);
  }
);

new Vue({
  router,
  render: h => h(App)
}).$mount("#app");
