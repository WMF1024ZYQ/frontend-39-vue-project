<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 步骤条 -->
    <el-steps :active="active" finish-status="success">
      <el-step title="第一步" description="基本信息"></el-step>
      <el-step title="第二步" description="商品图片"></el-step>
      <el-step title="第三步" description="商品内容"></el-step>
    </el-steps>
    <!-- 标签页 -->
    <el-tabs tab-position="left" style="margin-top: 20px" v-model="tabName" @tab-click="tabChange">
      <el-tab-pane label="基本信息" name="basic">
        <el-form ref="catAddTab" label-width="100px" :model="addGoodsModel">
          <el-form-item label="商品名称">
            <el-input v-model="addGoodsModel.goods_name"></el-input>
          </el-form-item>
          <el-form-item label="商品价格">
            <el-input v-model="addGoodsModel.goods_price"></el-input>
          </el-form-item>
          <el-form-item label="商品重量">
            <el-input v-model="addGoodsModel.goods_weight"></el-input>
          </el-form-item>
          <el-form-item label="商品数量">
            <el-input v-model="addGoodsModel.goods_number"></el-input>
          </el-form-item>
          <el-form-item label="商品分类" label-width="100px">
            <el-cascader
              v-model="addGoodsModel.catArr"
              :options="catoptions"
              :props="defaultProps"
              clearable
            ></el-cascader>
          </el-form-item>
          <el-form-item label="是否促销">
            <el-radio v-model="addGoodsModel.is_promote" label="1">是</el-radio>
            <el-radio v-model="addGoodsModel.is_promote" label="0">否</el-radio>
          </el-form-item>
        </el-form>
        <el-button type="primary" @click="next(1, 'pic')">下一步</el-button>
      </el-tab-pane>
      <el-tab-pane label="商品图片" name="pic">
        <el-upload
          class="upload-demo"
          action="http://localhost:8888/api/private/v1/upload"
          :headers="headers"
          list-type="picture-card"
          :on-success="fileRes"
        >
          <el-button size="small" type="primary">点击上传</el-button>
          <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
        </el-upload>
        <el-button type="primary" @click="next(2, 'content')">下一步</el-button>
      </el-tab-pane>
      <el-tab-pane label="商品内容" name="content">
        <quill-editor v-model="addGoodsModel.goods_introduce" ref="myTextEditor"></quill-editor>
        <el-button type="primary" @click="addGoodsRequest">确定</el-button>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import "quill/dist/quill.core.css";
import "quill/dist/quill.snow.css";
import "quill/dist/quill.bubble.css";
import { quillEditor } from "vue-quill-editor";
import axios from "axios";
export default {
  components: {
    quillEditor
  },
  data() {
    return {
      headers: {
        Authorization: localStorage.getItem("token")
      },
      tabName: "basic",
      active: 0,
      addGoodsModel: {
        goods_name: "",
        catArr: [],
        goods_price: 0,
        goods_number: 0,
        goods_weight: 0,
        goods_introduce: "",
        pics: [],
        is_promote: 0
      },
      catoptions: [],
      defaultProps: {
        value: "cat_id",
        label: "cat_name"
      }
    };
  },
  methods: {
    next(index, tabName) {
      this.active = index;
      this.tabName = tabName;
    },
    tabChange(tab) {
      this.active = +tab.index;
      this.tabName = tab.name;
    },
    fileRes(res) {
      this.addGoodsModel.pics.push({
        pic: res.data.tmp_path
      });
    },
    catRequest() {
      axios({
        url: "categories",
        params: {
          type: 3
        }
      }).then(res => {
        this.catoptions = res.data.data;
      });
    },
    addGoodsRequest() {
      let goods = {
        goods_name: this.addGoodsModel.goods_name,
        goods_cat: this.addGoodsModel.catArr.join(),
        goods_price: this.addGoodsModel.goods_price,
        goods_number: this.addGoodsModel.goods_number,
        goods_weight: this.addGoodsModel.goods_weight,
        goods_introduce: this.addGoodsModel.goods_introduce,
        pics: this.addGoodsModel.pics,
        is_promote: this.addGoodsModel.is_promote
      };
      axios({
        url: "goods",
        method: "post",
        data: goods
      }).then(res => {
        if (res.data.meta.status === 201) {
          this.$router.push("/goods");
        }
      });
    }
  },
  created() {
    this.catRequest();
  }
};
</script>

<style>
.ql-container.ql-snow {
  height: 200px;
  margin-bottom: 20px;
}
</style>
