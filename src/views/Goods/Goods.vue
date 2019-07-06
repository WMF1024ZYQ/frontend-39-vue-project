<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 添加按钮 -->
    <el-row>
      <el-button type="success" plain @click="$router.push('/goods-add')">添加商品</el-button>
    </el-row>
    <!-- 表格 -->
    <el-table :data="goodsList" stripe style="width: 100%">
      <el-table-column type="index"></el-table-column>
      <el-table-column prop="goods_name" label="商品名称" width="180"></el-table-column>
      <el-table-column prop="goods_price" label="商品价格" width="180"></el-table-column>
      <el-table-column prop="goods_weight" label="商品重量"></el-table-column>
      <el-table-column prop="add_time" label="创建时间"></el-table-column>
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
  </div>
</template>

<script>
import axios from "axios";
export default {
  data() {
    return {
      goodsList: [],
      pagenum: 1,
      pagesize: 5,
      total: 0
    };
  },
  methods: {
    async goodsRender() {
      let res = await axios({
        url: "goods",
        params: {
          pagenum: this.pagenum,
          pagesize: this.pagesize
        }
      });
      this.goodsList = res.data.data.goods;
      this.total = res.data.data.total;
    },
    currentChange(page) {
      this.pagenum = page;
      this.goodsRender();
    }
  },
  created() {
    this.goodsRender();
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
  margin-bottom: 10px;
}
</style>
