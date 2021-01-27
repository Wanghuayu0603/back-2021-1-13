<template>
  <div class="app-container">
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
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: "success",
        draft: "info",
        deleted: "danger",
      };
      return statusMap[status];
    },
  },
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
      linkList: [],
      apiUrl: this.$route.meta.param + "?",
    };
  },
  created() {
    this.getList();
  },
  methods: {
    getList() {
      this.listLoading = true;

      getList(this.apiUrl, this.listQuery).then((response) => {
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
      });
    },
    // 点击链接，获取数据
    changeLink(url, params) {
      this.apiUrl = `${url}?${params}&`;
      this.listQuery.page = 1;
      this.listQuery.limit = 5;
      this.getList();
    },
  },
};
</script>

<style lang="scss" scoped>
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
</style>
