<template>
  <div class="app-container">
    <!-- form -->
    <el-form ref="form" :model="form" label-width="80px">
      <div :key="ind" v-for="(item, ind) in formList">
        <el-form-item
          v-if="item.prop == 'input'"
          style="width: 30%; display: flex"
          :label="item.name"
        >
          <el-input
            :disabled="item.disable"
            v-model="form[item.key]"
            placeholder=""
          ></el-input>
        </el-form-item>

        <el-form-item
          v-if="item.prop == 'date'"
          :label="item.name"
          style="width: 40%; display: flex"
        >
          <el-date-picker
            type="date"
            placeholder="选择日期"
            v-model="form[item.key]"
            :disable="item.disable"
            format="yyyy 年 MM 月 dd 日"
            value-format="timestamp"
            style="width: 100%"
          ></el-date-picker>
        </el-form-item>

        <el-form-item
          v-if="item.prop == 'date_time'"
          :label="item.name"
          style="width: 40%; display: flex"
        >
          <el-time-picker
            placeholder="选择时间"
            v-model="form[item.key]"
            :disable="item.disable"
            style="width: 100%"
            format="HH 时 mm 分钟 ss 秒"
            value-format="timestamp"
          ></el-time-picker>
        </el-form-item>
      </div>

      <el-button
        style="width: 28%; height: 40px; margin-top: 10px"
        type="primary"
        @click="submitForm"
        >查询</el-button
      >
    </el-form>

    <!-- link -->
    <div class="link_box">
      <p v-for="(item, index) in linkList" :key="index">
        {{ item.name }}：
        <el-button type="primary" @click="changeLink(item.prop, item.param)"
          >查询</el-button
        >
      </p>
    </div>

    <!-- table -->
    <el-table
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%"
    >
      <el-table-column
        align="center"
        v-for="(item, index) in listLabel"
        :key="index"
        :label="item.name"
      >
        <template slot-scope="scope">
          <span>{{ scope.row[item.prop] }}</span>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.limit"
      @pagination="getList"
    />
  </div>
</template>

<script>
import { getList } from "@/api/table";
import Pagination from "@/components/Pagination";

export default {
  name: "Table",
  components: { Pagination },
  filters: {},
  data() {
    return {
      list: null,
      listLabel: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 5,
      },
      form: {},
      linkList: [],
      formList: [], //form列表
      apiUrl: this.$route.meta.param + "?",
    };
  },
  created() {
    this.getList();
  },
  methods: {
    // 去除空键值对
    filterForm() {
      for (var key in this.form) {
        if (this.form[key] === "" || this.form[key] == null) {
          delete this.form[key];
        }
      }
    },
    // 表单
    submitForm() {
      // 重置当前页数
      this.listQuery.page = 1;

      // 去除空键值对
      this.filterForm();
      this.getList();
    },

    getList() {
      this.listLoading = true;

      var formParams = "";
      if (JSON.stringify(this.form) == "{}") {
        formParams = "";
      } else {
        // 去除空键值对
        this.filterForm();
        formParams = this.$qs.stringify(this.form);
      }

      getList(this.apiUrl, this.listQuery, formParams).then((response) => {
        let { info } = response;
        // 分页和表格数据
        this.list = info.data;
        this.total = Number(info.page.count);
        this.listLoading = false;
        this.listLabel = info.data_tr;
        this.listQuery.page = info.page.page;
        this.listQuery.limit = info.page.page_limit;

        // 链接数据
        this.linkList = info.link;

        // 表单数据
        var obj = {};
        info.form.forEach((item) => {
          if (item.prop == "date" || item.prop == "date_time") {
            item.param ? (obj[item.key] = item.param + "000") : "";
          } else {
            obj[item.key] = item.param;
          }
        });
        this.form = JSON.parse(JSON.stringify(obj));
        this.formList = info.form;
      });
    },
    // 点击链接，获取数据
    changeLink(url, params) {
      this.apiUrl = `${url}?${params}&`;
      this.listQuery.page = 1;
      this.getList();
    },
  },
};
</script>

<style lang="scss" >
.edit-input {
  padding-right: 100px;
}
.cancel-btn {
  position: absolute;
  right: 15px;
  top: 10px;
}
.link_box {
  margin-bottom: 30px;
  font-size: 16px;
  font-weight: 600;
  display: flex;
  align-items: center;
  flex-flow: wrap;
  height: 110px;
  overflow-y: scroll;
  p {
    text-align: left;
    width: 20%;
  }
}
.el-button {
  padding: 8px 16px !important;
}
.el-form-item .el-form-item__label {
  text-align: left !important;
  width: 120px !important;
}
</style>
