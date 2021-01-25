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
      <el-checkbox-group v-model="checkedRoles" @change="handleCheckChange">
        <el-checkbox
          :label="item"
          :key="index"
          v-for="(item, index) in allRoles"
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
    // 移除操作
    async chanelRole() {
      // 移除操作
      delRoles = () => {
        var chanelRoles = [];

        this.allRoles.forEach((element) => {
          if (!this.checkedRoles.includes(element)) {
            chanelRoles.push(element);
          }
        });

        var delRes = this.userList.filter((item) => {
          if (item.username == this.curUser) {
            item.roles = chanelRoles.slice(0);
          }
        });
        return delRes;
      };

      if (delRoles[0].roles.length) {
        let data1 = await deleteRole(
          this.$qs.stringify({
            user: newUserList[0].username,
            group: newUserList[0].roles,
          })
        );
      }
    },
    // 添加操作
    async addRoules(){

    var addRes = this.userList.filter((item) => {
          if (item.username == this.curUser) {
            // 选中角色的对象
            return (item.roles = this.checkedRoles);
          }
        });

        // 添加操作
        if (addRes[0].roles.length) {
          let data = await addRole(
            this.$qs.stringify({
              user: addRes[0].username,
              group: addRes[0].roles,
            })
          );
        }

    },
    //确认编辑用户角色
    async addRolesSure() {
      
      this.addRoules()
      this.chanelRole()

      // 刷新
      this.getUsers();
      this.isDialog = false;
    },
    // 设置角色树选中情况
    handleEdit(curItem) {
      this.isDialog = true;
      // this.userList.forEach((item) => {
      // if (item.username == curItem.username) {
      this.checkedRoles = curItem.roles; // 选中的角色
      // }
      // });
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
    handleCheckChange(value) {},
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
