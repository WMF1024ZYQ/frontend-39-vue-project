<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 表单 -->
    <el-table :data="roleList" stripe style="width: 100%" ref="rolesTab">
      <el-table-column type="expand">
        <template v-slot="{row}">
          <el-row class="firstRole" v-for="first in row.children" :key="first.id" type="flex">
            <el-col :span="6">
              <el-tag closable @close="delRights(row,first.id)">{{first.authName}}</el-tag>
              <i class="el-icon-arrow-right"></i>
            </el-col>
            <el-col>
              <el-row
                v-for="second in first.children"
                :key="second.id"
                class="secondRole"
                type="flex"
              >
                <el-col :span="6">
                  <el-tag
                    type="success"
                    closable
                    @close="delRights(row,second.id)"
                  >{{second.authName}}</el-tag>
                  <i class="el-icon-arrow-right"></i>
                </el-col>

                <el-col>
                  <el-tag
                    class="threeRole"
                    v-for="three in second.children"
                    :key="three.id"
                    type="warning"
                    closable
                    @close="delRights(row,three.id)"
                  >{{three.authName}}</el-tag>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
        </template>
      </el-table-column>
      <el-table-column type="index"></el-table-column>
      <el-table-column prop="roleName" label="角色名称" width="180"></el-table-column>
      <el-table-column prop="roleDesc" label="描述" width="180"></el-table-column>
      <el-table-column label="操作">
        <template v-slot="{row}">
          <el-button type="primary" icon="el-icon-edit" plain size="mini" @click="editRole(row.id)"></el-button>
          <el-button type="danger" icon="el-icon-delete" plain size="mini" @click="delRole(row.id)"></el-button>
          <el-button
            type="success"
            icon="el-icon-check"
            plain
            size="mini"
            @click="rightsShow(row)"
          >分配权限</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 角色授权 -->
    <el-dialog title="角色授权" :visible.sync="rightsDialogVisible" width="50%">
      <el-tree
        :data="RightsList"
        show-checkbox
        node-key="id"
        default-expand-all
        :default-checked-keys="defaultIds"
        :props="defaultProps"
        ref="rightsTree"
      ></el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="rightsDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editRights">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import axios from "axios";
export default {
  data() {
    return {
      roleList: [],
      rightsDialogVisible: false,
      RightsList: [],
      defaultProps: {
        children: "children",
        label: "authName"
      },
      defaultIds: [],
      rightsId: -1
    };
  },
  methods: {
    //渲染表单
    rolesRender(callback = () => {}) {
      axios({
        url: "/roles"
      }).then(({ data: { data } }) => {
        this.roleList = data;
        callback();
      });
    },
    //提示信息
    promptMessage(message, status) {
      this.$message({
        message: message,
        type: status,
        duration: 1000
      });
    },
    //获取默认选中id
    getSeclectRightsId(row) {
      let level1 = [];
      let level2 = [];
      let level3 = [];
      row.children.forEach(first => {
        level1.push(first.id);
        first.children.forEach(second => {
          level2.push(second.id);
          second.children.forEach(three => {
            level3.push(three.id);
          });
        });
      });
      this.defaultIds = [...level3];
      let levelAll = [...level1, ...level2, ...level3];
      return levelAll;
    },
    //发送修改角色权限请求
    editRightsRequest(id, ids) {
      axios({
        url: `roles/${this.rightsId}/rights`,
        method: "post",
        data: {
          rids: ids
        }
      }).then(({ data: { meta } }) => {
        if (meta.status === 200) {
          this.promptMessage(meta.msg, "success");
          this.rolesRender(() => {
            this.$refs.rolesTab.toggleRowExpansion(
              this.roleList.find(v => (v.id = id)),
              true
            );
          });
          this.rightsDialogVisible = false;
        } else {
          this.promptMessage(meta.msg, "error");
        }
      });
    },
    //权限弹出框
    rightsShow(row) {
      this.rightsId = row.id;
      axios({
        url: "rights/tree"
      }).then(({ data: { data } }) => {
        this.RightsList = data;
        this.getSeclectRightsId(row);
        this.rightsDialogVisible = true;
      });
    },
    //修改权限
    editRights() {
      let ids = [
        ...this.$refs.rightsTree.getCheckedKeys(),
        ...this.$refs.rightsTree.getHalfCheckedKeys()
      ].join();
      axios({
        url: `roles/${this.rightsId}/rights`,
        method: "post",
        data: {
          rids: ids
        }
      }).then(({ data: { meta } }) => {
        if (meta.status === 200) {
          this.promptMessage(meta.msg, "success");
          this.rolesRender();
          this.rightsDialogVisible = false;
        } else {
          this.promptMessage(meta.msg, "error");
        }
      });
    },
    //删除权限
    delRights(row, id) {
      let ids = this.getSeclectRightsId(row)
        .filter(v => v != id)
        .join();
      this.editRightsRequest(row.id, ids);
    },
    editRole(id) {
      window.console.log(id);
    },
    delRole(id) {
      window.console.log(id);
    }
  },
  created() {
    this.rolesRender();
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
.firstRole {
  border-bottom: 1px dashed #ccc;
  margin-bottom: 10px;
}

.firstRole:last-child {
  border: none;
}
.secondRole {
  /* margin-bottom: 10px; */
}

.threeRole {
  margin-right: 10px;
  margin-bottom: 10px;
}
</style>
