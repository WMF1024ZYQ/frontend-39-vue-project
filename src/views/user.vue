<template>
  <el-table :data="userList" stripe style="width: 100%">
    <el-table-column prop="username" label="姓名" width="180"></el-table-column>
    <el-table-column prop="email" label="邮箱" width="180"></el-table-column>
    <el-table-column prop="mobile" label="电话"></el-table-column>
    <el-table-column label="用户状态">
      <template v-slot="{row}">
        <el-switch v-model="row.mg_state" active-color="#13ce66" inactive-color="#ff4949"></el-switch>
      </template>
    </el-table-column>
    <el-table-column label="操作">
      <el-button type="primary" icon="el-icon-edit" plain size="mini"></el-button>
      <el-button type="danger" icon="el-icon-delete" plain size="mini"></el-button>
      <el-button type="success" icon="el-icon-check" plain size="mini">分配角色</el-button>
    </el-table-column>
  </el-table>
</template>

<script>
import axios from "axios";
export default {
  data() {
    return {
      userList: []
    };
  },
  created() {
    axios({
      url: "http://localhost:8888/api/private/v1/users",
      params: {
        pagenum: 1,
        pagesize: 5
      },
      headers: { Authorization: localStorage.getItem("token") }
    }).then(({ data: { data } }) => {
      this.userList = data.users;
    });
  }
};
</script>

<style>
el-table {
  overflow: hidden;
}
</style>
