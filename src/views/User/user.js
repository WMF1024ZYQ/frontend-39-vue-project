/* eslint-disable no-console */
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
      addRoleDialogFormVisible: false,
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
      },
      addRoleModel: {
        username: "",
        rid: 0
      },
      roleList: []
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
            this.promptMessage(meta.msg, "success");
            this.renderUser();
            this.addDialogFormVisible = false;
            this.$refs[rolesName].resetFields();
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
    },
    addRole(id) {
      axios({
        url: `users/${id}`
      }).then(res => {
        this.addRoleModel = res.data.data;
        console.log(this.addRoleModel);
        axios({
          url: "roles"
        }).then(res => {
          this.roleList = res.data.data;
          console.log(this.roleList);
        });
      });
      this.addRoleDialogFormVisible = true;
    },
    async addRoleRequest() {
      let {
        data: { meta }
      } = await axios({
        url: `users/${this.addRoleModel.id}/role`,
        method: "put",
        data: {
          rid: this.addRoleModel.rid
        }
      });
      if (meta.status === 200) {
        this.promptMessage(meta.msg, "success");
        this.addRoleDialogFormVisible = false;
        this.renderUser();
      } else {
        this.promptMessage(meta.msg, "error");
      }
    }
  },
  //钩子函数
  created() {
    this.renderUser();
  }
};
