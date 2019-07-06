/* eslint-disable no-console */
import axios from "axios";

export default {
  data() {
    return {
      rightsList: []
    };
  },
  methods: {
    loginOut() {
      localStorage.removeItem("token");
      this.$router.push("/login");
    },
    async renderRightList() {
      let {
        data: { data }
      } = await axios({
        url: "menus"
      });
      this.rightsList = data;
    }
  },
  created() {
    this.renderRightList();
  }
};
