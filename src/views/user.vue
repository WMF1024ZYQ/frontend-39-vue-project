<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 搜索栏 -->
    <el-row type="flex" :gutter="20">
      <el-col :span="8">
        <el-input
          placeholder="请输入内容"
          class="input-with-select"
          v-model="query"
          @keyup.enter.native="querySearchUser"
        >
          <el-button slot="append" icon="el-icon-search" @click="querySearchUser"></el-button>
        </el-input>
      </el-col>
      <el-col>
        <el-button type="success" plain @click="addUserModal">添加用户</el-button>
      </el-col>
    </el-row>

    <!-- 表格 -->
    <el-table :data="userList" stripe style="width: 100%">
      <el-table-column prop="username" label="姓名" width="180"></el-table-column>
      <el-table-column prop="email" label="邮箱" width="180"></el-table-column>
      <el-table-column prop="mobile" label="电话"></el-table-column>
      <el-table-column label="用户状态">
        <template v-slot="{row}">
          <el-switch
            v-model="row.mg_state"
            active-color="#13ce66"
            inactive-color="#ff4949"
            @change="editState(row)"
          ></el-switch>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template v-slot="{row}">
          <el-button type="primary" icon="el-icon-edit" plain size="mini" @click="editUser(row.id)"></el-button>
          <el-button type="danger" icon="el-icon-delete" plain size="mini" @click="delUser(row.id)"></el-button>
          <el-button type="success" icon="el-icon-check" plain size="mini">分配角色</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      background
      layout="prev, pager, next"
      :total="total"
      :page-size="pagesize"
      @current-change="onchangePage"
      :current-page="pagenum"
    ></el-pagination>
    <!-- 添加用户 -->
    <el-dialog title="添加用户" :visible.sync="addDialogFormVisible">
      <el-form :model="user" :rules="rules" ref="addRuleForm">
        <el-form-item label="用户名" label-width="100px" prop="username">
          <el-input v-model="user.username" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="密码" label-width="100px" prop="password">
          <el-input v-model="user.password" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" label-width="100px" prop="email">
          <el-input v-model="user.email" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="手机" label-width="100px" prop="mobile">
          <el-input v-model="user.mobile" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addDialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUserRequest('addRuleForm')">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 修改用户信息 -->
    <el-dialog title="修改用户信息" :visible.sync="editDialogFormVisible">
      <el-form :model="editUserModel" :rules="rules" ref="addRuleForm">
        <el-form-item label="用户名" label-width="100px">
          <el-tag type="info" v-text="editUserModel.username"></el-tag>
        </el-form-item>

        <el-form-item label="邮箱" label-width="100px" prop="email">
          <el-input v-model="editUserModel.email" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="手机" label-width="100px" prop="mobile">
          <el-input v-model="editUserModel.mobile" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editDialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUserRequest('addRuleForm')">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import axios from "axios";
export default {
  data() {
    return {
      userList: [],
      total: 0,
      pagenum: 1,
      pagesize: 3,
      query: "",
      addDialogFormVisible: false,
      editDialogFormVisible: false,
      user: {
        username: "",
        password: "",
        email: "",
        mobile: ""
      },
      editUserModel: {
        id: 0,
        username: "",
        email: "",
        mobile: ""
      },
      rules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          {
            min: 5,
            max: 12,
            message: "长度在 5 到 12 个字符",
            trigger: "change"
          }
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          {
            min: 6,
            max: 15,
            message: "长度在 6 到 15 个字符",
            trigger: "change"
          }
        ],
        email: [
          {
            pattern: /\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/,
            message: "email格式不正确",
            trigger: "blur"
          }
        ],
        mobile: [
          {
            pattern: /^(0|86|17951)?(13[0-9]|15[012356789]|166|17[3678]|18[0-9]|14[57])[0-9]{8}$/,
            message: "手机格式不正确",
            trigger: "blur"
          }
        ]
      }
    };
  },
  methods: {
    // 渲染用户列表
    renderUser() {
      axios({
        url: "/users",
        params: {
          query: this.query,
          pagenum: this.pagenum,
          pagesize: this.pagesize
        }
      }).then(({ data: { data } }) => {
        this.userList = data.users;
        this.total = data.total;
      });
    },
    //页面变更
    onchangePage(pagenum) {
      this.pagenum = pagenum;
      this.renderUser();
    },
    //搜索
    querySearchUser() {
      this.pagenum = 1;
      this.renderUser();
    },
    //提示信息
    promptMessage(message, status) {
      this.$message({
        message: message,
        type: status
      });
    },
    //修改用户状态
    editState(row) {
      axios({
        url: `users/${row.id}/state/${row.mg_state}`,
        method: "put"
      }).then(({ data: { meta } }) => {
        if (meta.status === 200) {
          this.promptMessage(meta.msg, "success");
        } else {
          this.promptMessage(meta.msg, "error");
          row.mg_state = !row.mg_state;
        }
      });
    },
    //删除用户
    async delUser(id) {
      try {
        await this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        });

        let {
          data: { meta }
        } = await axios({
          url: `users/${id}`,
          method: "delete"
        });

        if (meta.status === 200) {
          this.promptMessage(meta.msg, "success");
          this.renderUser();
        } else {
          this.promptMessage(meta.msg, "error");
        }
      } catch (error) {
        this.promptMessage("已取消删除", "info");
      }
    },
    //添加用户框
    addUserModal() {
      this.addDialogFormVisible = true;
    },
    //添加用户
    async addUserRequest(rolesName) {
      try {
        let valid = await this.$refs[rolesName].validate();
        if (valid) {
          let {
            data: { meta }
          } = await axios({
            url: "users",
            method: "post",
            data: this.user
          });
          if (meta.status === 201) {
            this.addDialogFormVisible = false;
            this.$refs[rolesName].resetFields();
            this.promptMessage(meta.msg, "success");
          }
        } else {
          return false;
        }
      } catch (error) {
        this.promptMessage("请将信息填写完整", "error");
      }
    },
    //打开修改用户框
    editUser(id) {
      axios({
        url: `users/${id}`,
        method: "get"
      }).then(res => {
        this.editUserModel = res.data.data;
      });
      this.editDialogFormVisible = true;
    },
    //修改用户
    editUserRequest(rolesName) {
      this.$refs[rolesName].validate(valid => {
        if (valid) {
          axios({
            url: `users/${this.editUserModel.id}`,
            method: "put",
            data: {
              email: this.editUserModel.email,
              mobile: this.editUserModel.mobile
            }
          }).then(({ data: { meta } }) => {
            if (meta.status === 200) {
              this.editDialogFormVisible = false;
              this.renderUser();
            }
          });
        }
      });
    }
  },
  //钩子函数
  created() {
    this.renderUser();
  }
};
</script>

<style>
.el-breadcrumb {
  height: 50px;
  line-height: 50px !important;
  font-size: 16px !important;
  background-color: #d4dae0;
  padding-left: 10px;
}
</style>
