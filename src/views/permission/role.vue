<template>
  <div class="app-container">
    <el-button type="primary" @click="handleAddRoles"> 新增权限 </el-button>

    <el-table :data="roleList" style="width: 100%; margin-top: 30px" border>
      <el-table-column align="center" label="Role Key" width="220">
        <template slot-scope="scope">
          {{ scope.row.role }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="Role Name" width="220">
        <template slot-scope="scope">
          {{ scope.row.obj | filterRoles(scope.row.role) }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="Operations">
        <template slot-scope="scope">
          <el-button
            type="primary"
            size="small"
            @click="handleEdit(scope.row.role)"
          >
            编辑权限
          </el-button>
          <!-- <el-button type="danger" size="small" @click="handleDelete(scope)">
            删除
          </el-button> -->
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
        :default-expanded-keys="defaultChecked"
        :default-checked-keys="defaultChecked"
        :props="defaultProps"
        @check-change="handleCheckChange"
      >
      </el-tree>

      <div slot="footer" class="dialog-footer">
        <el-button @click="isDialog = false">取 消</el-button>
        <!-- <el-button type="primary" @click="editSure">确 定</el-button> -->
      </div>
    </el-dialog>

    <!-- 新增权限 -->
    <el-dialog title="新增权限" :visible.sync="isShow">
      <el-form :model="addPer" label-width="80px" label-position="left">
        <el-form-item label="Role">
          <el-input v-model="addRole.sub" placeholder="Role Name" />
        </el-form-item>
        <el-form-item label="Permission">
          <el-input
            v-model="addPer.policies[0].obj"
            placeholder="Permission Name"
          />
        </el-form-item>
        <el-form-item label="Permission">
          <el-input
            v-model="addPer.policies[0].act"
            placeholder="Permission Name"
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
import { getUsers, addPermission, delPermission } from "@/api/role";

export default {
  name: "UserPermission",
  data() {
    return {
      roleList: [], // 用户列表数据
      oneRoles: [],
      twoRoles: [],
      curRole: "",
      isShow: true,
      addPer: { sub: "", policies: [{ obj: "", act: "" }] }, //新增权限
      defaultChecked: [], // 默认选中
      CheckedRolesY: {
        //选中的权限
      },
      CheckedRolesN: {
        //取消的权限
      },
      isDialog: false,
      user: { name: "", description: "" },
      tree: [],
      role: [],
      defaultProps: {
        children: "children",
        label: "label",
      },
    };
  },
  watch: {
    isDialog(val) {
      val ? "" : window.location.reload();
      this.CheckedRolesY.sub = this.curRole;
      this.CheckedRolesY.policies = JSON.stringify([
        { obj: item.label, act: ele.label },
      ]);
    },
  },
  filters: {
    filterRoles(val, curRole) {
      return [...new Set(val)].join(",");
    },
  },
  created() {
    this.getUsers();
  },
  methods: {
    addRolesSure() {},
    // 提交编辑
    editSure() {},
    // 设置角色树选中情况
    handleEdit(role) {
      this.isDialog = true;
      this.curRole = role;
      this.getTreeChecked();
    },
    handleAddRoles() {
      this.isShow = true;
    },
    async getUsers() {
      const res = await getUsers();
      this.roleList = res.info.role_policys; //角色列表数据
      this.oneRoles = res.info.obj; // 一级权限
      this.twoRoles = res.info.act; // 一级权限
      this.filterAllRoles(); //整合级别
    },
    // 整合tree格式数据(所有级数据)
    filterAllRoles() {
      var tree = [];

      // 一级
      this.oneRoles.forEach((item, index) => {
        tree.push({
          id: index,
          label: item,
          children: [],
          disabled: true,
        });
      });

      // 二级
      var cur = this.oneRoles.length - 1;
      tree.forEach((item, index) => {
        this.twoRoles.forEach((ele, ind) => {
          cur++;
          item.children.push({
            id: cur,
            label: ele,
          });
        });
      });

      this.tree = tree;
    },
    // 整合tree格式数据(当前角色对应的数级别据)
    filterCurRoles(curRole) {
      var tree = [];
      this.roleList.forEach((item) => {
        if (item.role == curRole) {
          var obj = [...new Set(item.obj)];
          obj.forEach((ele, index) => {
            tree.push({
              label: ele,
              children: [],
            });
            if (item[ele].length) {
              for (var i = 0; i < item[ele].length; i++) {
                tree[index].children.push({
                  label: item[ele][i],
                  children: [],
                });
              }
            }
          });
        }
      });
      return tree;
    },
    // 整合tree，对比，获取默认值
    getTreeChecked() {
      var res = [];

      function filterDefaultVal(objOne, objTwo) {
        for (var i = 0; i < objOne.length; i++) {
          for (var j = 0; j < objTwo.length; j++) {
            if (objOne[i].label == objTwo[j].label) {
              if (objTwo[j].children && objTwo[j].children.length) {
                filterDefaultVal(objOne[i].children, objTwo[j].children);
              } else {
                res.push(objOne[i].id);
              }
            }
          }
        }
        return res;
      }

      this.defaultChecked = filterDefaultVal(
        this.tree,
        this.filterCurRoles(this.curRole)
      );
    },
    async handleCheckChange(data, checked) {
      if (data.id >= this.oneRoles.length) {
        //保证操作的是二级
        if (checked) {
          //新增
          this.findChecked(data.id, checked);
          await addPermission(this.$qs.stringify(this.CheckedRolesY));
        } else {
          this.findChecked(data.id, checked);
          await delPermission(this.$qs.stringify(this.CheckedRolesN));
        }
      }
    },
    // 查找准中的
    findChecked(id, flag) {
      this.tree.forEach((item) => {
        item.children.forEach((ele) => {
          if (ele.id == id) {
            // 保存当前一级label和当前级的label
            if (flag) {
              this.CheckedRolesY.sub = this.curRole;
              this.CheckedRolesY.policies = JSON.stringify([
                { obj: item.label, act: ele.label },
              ]);
            } else {
              this.CheckedRolesN.sub = this.curRole;
              this.CheckedRolesN.policies = JSON.stringify([
                { obj: item.label, act: ele.label },
              ]);
            }
          }
        });
      });
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
