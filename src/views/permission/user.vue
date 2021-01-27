<template>
  <div class="app-container">
    <el-button type="primary" @click="handleAddRoles"> 新增角色 </el-button>

    <el-table :data="userList" style="width: 100%; margin-top: 30px" border>
      <el-table-column align="center" label="用户名" width="220">
        <template slot-scope="scope">
          {{ scope.row.username }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="角色" width="220">
        <template slot-scope="scope">
          {{ scope.row.roles | filterRoles }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作">
        <template slot-scope="scope">
          <el-button type="primary" size="small" @click="handleEdit(scope.row)">
            编辑角色
          </el-button>
          <!-- <el-button type="danger" size="small" @click="handleDelete(scope)">
            删除
          </el-button> -->
        </template>
      </el-table-column>
    </el-table>

    <el-dialog title="编辑角色" :visible.sync="isDialog">
      <p class="user_name">
        用户名: <span>{{ curUser }}</span>
      </p>
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
      </div>
    </el-dialog>

    <!-- 新增用户 -->
    <el-dialog title="新增角色" :visible.sync="isShow">
      <el-form :model="addRole" label-width="80px" label-position="left">
        <el-form-item label="用户名">
          <el-input v-model.trim="addRole.user" placeholder="请输入用户名" />
        </el-form-item>
        <el-form-item label="角色名">
          <el-input
            v-model.trim="addRole.group[0]"
            placeholder="请输入角色名"
          />
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="isShow = false">取 消</el-button>
        <el-button type="primary" @click="addRolesSure">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getUsers, addRole, deleteRole } from "@/api/role";
import { Message } from "element-ui";
export default {
  name: "RolePermission",
  data() {
    return {
      userList: [], // 用户列表数据
      allRoles: [], // 所有角色
      checkedRoles: [], // 选中的角色
      isDialog: false,
      isShow: false,
      curUser: "",
      addRole: { user: "", group: [] }, //新增角色
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
        let res = await addRole(
          this.$qs.stringify({ user: this.curUser, group: [curRole] })
        );
        if (res.code == 200) {
          Message.success(res.msg);
        }
      } else {
        let res = await deleteRole(
          this.$qs.stringify({ user: this.curUser, group: [curRole] })
        );
        if (res.code == 200) {
          Message.success(res.msg);
        }
      }
      this.getUsers();
    },

    //确认新增用户角色
    async addRolesSure() {
      if (this.addRole.user && this.addRole.group.length) {
        let res = await addRole(this.$qs.stringify(this.addRole));
        if (res.code == 200) {
          Message.success(res.msg);
        }
      } else {
        Message.error("请输入用户名或角色名");
      }
      this.isShow = false;
      this.addRole.user = "";
      this.addRole.group = [];
      this.getUsers();
    },
    // 设置角色树选中情况
    handleEdit(curItem) {
      this.isDialog = true;
      this.checkedRoles = curItem.roles; // 选中的角色
      // 保存当前编辑的对象
      this.curUser = curItem.username;
      this.user = curItem.username;
    },
    handleAddRoles() {
      //新增用户
      this.isShow = true;
    },
    async getUsers() {
      const res = await getUsers();
      this.userList = res.info.user_roles; //用户列表数据
      this.allRoles = res.info.roles;
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
  .user_name {
    padding: 0;
    margin: 0 0 30px;
    font-size: 20px;
    span {
      margin-left: 6px;
    }
  }
}
</style>
