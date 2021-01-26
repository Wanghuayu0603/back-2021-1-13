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
          <el-button type="primary" size="small" @click="handleEdit(scope.row)">
            编辑角色
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
      </el-form>
      <el-checkbox-group v-model="checkedRoles">
        <el-checkbox
          :label="item"
          :key="index"
          v-for="(item, index) in allRoles"
          @change="(val) => checkedChange(val, item)"
        ></el-checkbox>
      </el-checkbox-group>
      <div slot="footer" class="dialog-footer">
        <el-button @click="isDialog = false">取 消</el-button>
        <el-button type="primary" @click="addRolesSure">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getUsers, addRole, deleteRole } from "@/api/role";

export default {
  name: "RolePermission",
  data() {
    return {
      userList: [], // 用户列表数据
      allRoles: [], // 所有角色
      checkedRoles: [], // 选中的角色
      isDialog: false,
      user: { name: "" },
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
    async checkedChange(flag, curRole) {
      if (flag) {
        // 选中状态
        await addRole(
          this.$qs.stringify({ user: this.curUser, group: [curRole] })
        );
      } else {
        await deleteRole(
          this.$qs.stringify({ user: this.curUser, group: [curRole] })
        );
      }
      this.getUsers();
    },

    //确认编辑用户角色
    async addRolesSure() {
      // 刷新
    },
    // 设置角色树选中情况
    handleEdit(curItem) {
      this.isDialog = true;
      this.checkedRoles = curItem.roles; // 选中的角色
      // 保存当前编辑的对象
      this.curUser = curItem.username;
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
