<template>
  <div class="app-container">
    <el-button type="primary" @click="handleAddRoles"> 新增用户 </el-button>

    <el-table :data="userList" style="width: 100%; margin-top: 30px" border>
      <el-table-column align="center" label="Role Key" width="220">
        <template slot-scope="scope">
          {{ scope.row.username }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="Role Name" width="220">
        <template slot-scope="scope">
          {{ scope.row.roles | filterRoles }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="Operations">
        <template slot-scope="scope">
          <el-button type="primary" size="small" @click="handleEdit(scope)">
            编辑权限
          </el-button>
          <el-button type="danger" size="small" @click="handleDelete(scope)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog title="收货地址" :visible.sync="isDialog">
      <el-form :model="user" label-width="80px" label-position="left">
        <el-form-item label="Name">
          <el-input v-model="user.name" placeholder="Role Name" />
        </el-form-item>
        <el-form-item label="Desc">
          <el-input
            v-model="user.description"
            :autosize="{ minRows: 2, maxRows: 4 }"
            type="textarea"
            placeholder="角色描述"
          />
        </el-form-item>
      </el-form>
      <el-tree
        :data="tree"
        show-checkbox
        node-key="id"
        ref="tree"
        :default-expanded-keys="[2]"
        :default-checked-keys="[2]"
        :props="defaultProps"
        @check-change="handleCheckChange"
      >
      </el-tree>

      <div slot="footer" class="dialog-footer">
        <el-button @click="isDialog = false">取 消</el-button>
        <el-button type="primary" @click="isDialog = false">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
// import path from "path";
// import { deepClone } from "@/utils";
import { getUsers } from "@/api/role";

// const defaultRole = {};

export default {
  data() {
    return {
      userList: [], // 用户列表数据
      allRoles: [], // 所有角色
      isDialog: false,
      user: { name: "", description: "" },
      tree: [
        {
          id: 1,
          label: "一级 1",
          children: [
            {
              id: 4,
              label: "二级 1-1",
            },
          ],
        },
        {
          id: 2,
          label: "一级 2",
          children: [
            {
              id: 5,
              label: "二级 2-1",
            },
            {
              id: 6,
              label: "二级 2-2",
            },
          ],
        },
        {
          id: 3,
          label: "一级 3",
          children: [
            {
              id: 7,
              label: "二级 3-1",
            },
            {
              id: 8,
              label: "二级 3-2",
            },
          ],
        },
      ],
      obj:[
        {name: '张三', a: ['admin','jkng','mbhb'], b: ['hbkj','bhjbj','jig','sdf']},
        {name: '王五', a: ['admin','jkng','mbhb'], b: ['hbkj','bhjbj','jig','sdf']},
      ],
      role:[],
      defaultProps: {
        children: "children",
        label: "label",
      },
    };
  },
  computed: {
    routesData() {
      return this.routes;
    },
  },
  filters: {
    filterRoles(val) {
      if (val.length) {
        return val.join(",");
      }
    },
  },
  created() {
    this.getUsers();
  },
  methods: {
    // 设置角色树选中情况
    handleEdit() {
      this.isDialog = true;
    },
    handleAddRoles() {
      this.isDialog = true;
    },
    async getUsers() {
      const res = await getUsers();
      this.userList = res.info.user_roles; //用户列表数据
      this.allRoles = res.info.roles;
    },

    handleDelete() {},
    handleCheckChange(data, checked, indeterminate) {
      console.log(data, checked, indeterminate);
    },
  },
};
</script>

<style lang="scss" scoped>
.app-container {
  .roles-table {
    margin-top: 30px;
  }
  .permission-tree {
    margin-bottom: 30px;
  }
}
</style>
