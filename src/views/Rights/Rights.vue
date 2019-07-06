<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 表单 -->
    <el-table :data="rightsList" stripe style="width: 100%">
      <el-table-column type="index"></el-table-column>
      <el-table-column prop="authName" label="权限名称" width="180"></el-table-column>
      <el-table-column prop="path" label="路径" width="180"></el-table-column>
      <el-table-column label="层级" width="180">
        <template v-slot="{row}">
          <span>{{row.level | levelRights}}</span>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import axios from "axios";
export default {
  data() {
    return {
      rightsList: []
    };
  },
  methods: {
    rightsRender() {
      axios({
        url: "rights/list"
      }).then(({ data: { data } }) => {
        this.rightsList = data;
      });
    }
  },
  created() {
    this.rightsRender();
  },
  filters: {
    levelRights(key) {
      switch (key) {
        case "0":
          return "一级";
        case "1":
          return "二级";
        case "2":
          return "三级";
      }
    }
  }
};
</script>

<style scoped>
.el-breadcrumb {
  height: 50px;
  line-height: 50px !important;
  font-size: 16px !important;
  background-color: #d4dae0;
  padding-left: 10px;
}
</style>
