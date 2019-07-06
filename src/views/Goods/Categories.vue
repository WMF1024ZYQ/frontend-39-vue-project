<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 添加按钮 -->
    <el-row>
      <el-button type="success" plain @click="addCategories">添加分类</el-button>
    </el-row>
    <!-- 表格 -->
    <el-table :data="categoriesList" stripe style="width: 100%">
      <el-table-tree-column
        file-icon="el-icon-document"
        folder-icon="el-icon-folder"
        prop="cat_name"
        label="分类名称"
        width="400"
        levelKey="cat_level"
        parentKey="cat_pid"
        treeKey="cat_id"
        :indentSize="20"
        child-key="children"
      ></el-table-tree-column>
      <el-table-column label="是否有效" width="180">
        <template v-slot="{row}">{{row.cat_deleted ? '否' : '是'}}</template>
      </el-table-column>
      <el-table-column prop="cat_level" label="层级" width="180"></el-table-column>
      <el-table-column label="操作">
        <el-button type="primary" icon="el-icon-edit" plain size="mini"></el-button>
        <el-button type="danger" icon="el-icon-delete" plain size="mini"></el-button>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-pagination
      background
      layout="prev, pager, next"
      :total="total"
      :page-size="pagesize"
      :current-page="pagenum"
      @current-change="currentChange"
    ></el-pagination>
    <!-- 分配角色 -->
    <el-dialog title="添加分类" :visible.sync="addCategoriesDialogFormVisible">
      <el-form ref="categoriesTab" label-width="100px" :model="addCategoriesModel">
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="addCategoriesModel.cat_name"></el-input>
        </el-form-item>

        <el-form-item label="父级名称" label-width="100px" prop="parentArr">
          <el-cascader
            v-model="addCategoriesModel.parentArr"
            :options="categoriesListLevel2"
            :props="defaultProps"
            clearable
          ></el-cascader>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addCategoriesDialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCatRequest">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
 
 <script>
import axios from "axios";
const ElTreeGrid = require("element-tree-grid");

export default {
  components: {
    [ElTreeGrid.name]: ElTreeGrid
  },
  data() {
    return {
      categoriesList: [],
      pagenum: 1,
      pagesize: 5,
      total: 0,
      addCategoriesDialogFormVisible: false,
      categoriesListLevel2: [],
      defaultProps: {
        value: "cat_id",
        label: "cat_name",
        checkStrictly: true
      },
      addCategoriesModel: {
        cat_name: "",
        parentArr: []
      }
    };
  },
  methods: {
    //渲染
    async categoriesRender() {
      let res = await axios({
        url: "categories",
        params: {
          type: 3,
          pagenum: this.pagenum,
          pagesize: this.pagesize
        }
      });
      this.categoriesList = res.data.data.result;
      this.total = res.data.data.total;
    },
    //分页
    currentChange(page) {
      this.pagenum = page;
      this.goodsRender();
    },
    //打开添加框
    addCategories() {
      this.addCategoriesDialogFormVisible = true;
      axios({
        url: "categories",
        params: {
          type: 2
        }
      }).then(res => {
        this.categoriesListLevel2 = res.data.data;
      });
    },
    //发送添加请求
    addCatRequest() {
      let cat_name = this.addCategoriesModel.cat_name;
      let cat_level = this.addCategoriesModel.parentArr.length;
      let cat_pid = this.addCategoriesModel.parentArr.pop();

      axios({
        url: "categories",
        method: "post",
        data: {
          cat_pid,
          cat_name,
          cat_level
        }
      }).then(res => {
        if (res.data.meta.status === 201) {
          this.addCategoriesDialogFormVisible = false;
          this.$refs["categoriesTab"].resetFields();
          this.promptMessage(res.data.meta.msg, "success");
          // this.categoriesRender();
        } else {
          this.promptMessage(res.data.meta.msg, "error");
        }
      });
    },
    //提示信息
    promptMessage(message, status) {
      this.$message({
        message: message,
        type: status,
        duration: 1000
      });
    }
  },
  created() {
    this.categoriesRender();
  }
};
</script>

<style >
.el-breadcrumb {
  height: 50px;
  line-height: 50px !important;
  font-size: 16px !important;
  background-color: #d4dae0;
  padding-left: 10px;
  margin-bottom: 10px;
}
</style>
