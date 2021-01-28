<template>
  <div class="app-container">
    <el-button type="primary" @click="handleAddRoles"> 新增权限 </el-button>

    <el-table :data="roleList" style="width: 100%; margin-top: 30px" border>
      <el-table-column align="center" label="角色" width="220">
        <template slot-scope="scope">
          {{ scope.row.role }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="权限" width="220">
        <template slot-scope="scope">
          {{ scope.row.obj | filterRoles(scope.row.role) }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作">
        <template slot-scope="scope">
          <el-button
            type="primary"
            size="small"
            @click="handleEdit(scope.row.role)"
          >
            编辑权限
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog title="编辑权限" :visible.sync="isDialog">
      <p class="user_name">
        角色: <span>{{ curRole }}</span>
      </p>
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
      </div>
    </el-dialog>

    <!-- 新增权限 -->
    <el-dialog title="新增权限" :visible.sync="isShow">
      <el-form :model="addPer" label-width="80px" label-position="left">
        <el-form-item label="角色">
          <el-input v-model.trim="addPer.sub" placeholder="请输入角色名" />
        </el-form-item>
        <el-form-item label="一级权限">
          <el-input
            v-model.trim="addPer.policies[0].obj"
            placeholder="请输入一级权限"
          />
        </el-form-item>
        <el-form-item label="二级权限">
          <el-input
            v-model.trim="addPer.policies[0].act"
            placeholder="请输入二级权限"
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
import { Message } from "element-ui";

export default {
  name: "UserPermission",
  data() {
    return {
      roleList: [], // 用户列表数据
      oneRoles: [],
      twoRoles: [],
      curRole: "",
      isShow: false,
      addPer: { sub: "", policies: [{ obj: "", act: "" }] }, //新增权限
      defaultChecked: [], // 默认选中
      CheckedRolesY: {
        //选中的权限
      },
      CheckedRolesN: {
        //取消的权限
      },
      isDialog: false,
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
      // val ? "" : this.getUsers();
    },
    isShow(val) {
      if (!val) {
        this.addPer.sub = "";
        this.addPer.policies[0].obj = "";
        this.addPer.policies[0].act = "";
      }
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
    // 新增角色权限
    async addRolesSure() {
      if (
        this.addPer.sub &&
        this.addPer.policies[0].obj &&
        this.addPer.policies[0].act
      ) {
        var params = {
          sub: this.addPer.sub,
          policies: JSON.stringify(this.addPer.policies),
        };
        let res = await addPermission(this.$qs.stringify(params));
        if (res.code == 200) {
          Message.success(res.msg);
        }

        setTimeout(() => {
          window.location.reload();
        }, 1400);
      } else {
        Message.error("输入信息不完整");
      }
    },
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
          let res = await addPermission(this.$qs.stringify(this.CheckedRolesY));
          if (res.code == 200) {
            Message.success(res.msg);
          }
        } else {
          this.findChecked(data.id, checked);
          let res = await delPermission(this.$qs.stringify(this.CheckedRolesN));
          if (res.code == 200) {
            Message.success(res.msg);
          }
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
