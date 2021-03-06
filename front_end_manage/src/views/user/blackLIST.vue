<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input :placeholder="$t('user.name')" v-model="listQuery.id" style="width: 150px;" class="filter-item" @keyup.enter.native="handleFilter"/>
      <el-input :placeholder="$t('user.telephone')" v-model="listQuery.telephone" style="width: 200px;margin-left: 10px" class="filter-item" @keyup.enter.native="handleFilter"/>
      <el-input :placeholder="$t('user.IDnumber')" v-model="listQuery.IDnumber" style="width: 250px;margin-left: 10px" class="filter-item" @keyup.enter.native="handleFilter"/>

      <el-select v-model="listQuery.type" :placeholder="$t('user.type')" clearable style="width: 120px; margin-left: 10px" class="filter-item">
        <el-option v-for="item in typeOptions()" :key="item.key" :label="item.label"  :value="item.key"/>
      </el-select>

      <el-button v-waves class="filter-item" style="margin-left: 10px" type="primary" icon="el-icon-search" @click="handleFilter">{{ $t('table.search') }}</el-button>
      <el-button v-waves :loading="downloadLoading" class="filter-item" type="primary" icon="el-icon-download" @click="handleDownload">{{ $t('table.export') }}</el-button>
    </div>

    <el-table
      v-loading="listLoading"
      :key="tableKey"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;">

      <el-table-column :label="$t('user.name')"  align="center" width="270px">
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>

      <el-table-column :label="$t('user.telephone')" min-width="220px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.telephone }}</span>
        </template>
      </el-table-column>

      <el-table-column :label="$t('user.type')" width="345px" align="center">
        <template slot-scope="scope">
          <span>{{ toUserType(scope.row.type) }}</span>
        </template>
      </el-table-column>

      <el-table-column :label="$t('table.actions')" align="center" width="370" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button   style="width:100px;"   type="primary" @click="checkList(scope.row.telephone)">{{ $t('user.detail') }}
          </el-button>
          <el-button  style="width:100px;" type="warning" @click="outBlack(scope.row.userId)">{{ $t('user.blackListOut') }}
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

  </div>

</template>

<script>
import { outOfBlacklist } from "@/api/user";
import { fetchUserList } from "@/api/user";
import waves from "@/directive/waves"; // Waves directive
import { parseTime } from "@/utils";
import Pagination from "@/components/Pagination"; // Secondary package based on el-pagination

const calendarTypeOptions = [
  { key: "CN", display_name: "China" },
  { key: "US", display_name: "USA" },
  { key: "JP", display_name: "Japan" },
  { key: "EU", display_name: "Eurozone" }
];

// arr to obj ,such as { CN : "China", US : "USA" }
const calendarTypeKeyValue = calendarTypeOptions.reduce((acc, cur) => {
  acc[cur.key] = cur.display_name;
  return acc;
}, {});

export default {
  name: "ComplexTable",
  components: { Pagination },
  directives: { waves },
  data() {
    return {
      redirect: "/item/all",
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,

      listQuery: {
        page: 1,
        limit: 20,
        id: undefined,
        telephone: undefined,
        IDnumber: undefined,
        type: "",
        blackOrnot: 0
      },
      typeOptions: () => {
        return [
          { label: this.$t("user.type_0"), key: "0" },
          { label: this.$t("user.type_1"), key: "1" }
        ];
      },
      temp: {
        id: "myn",
        telephone: "18800000000",
        IDnumber: "2016011111",
        type: "1"
      },
      downloadLoading: false
    };
  },
  created() {
    this.getList();
  },
  methods: {
    getList() {
      this.listLoading = true;
      // this.list = [this.temp]
      // this.total = 1
      //post:id tele idnumber type blackornot     get:id tele idnumber type blackornot
      fetchUserList(this.listQuery).then(response => {
        this.list = response.data.list;
        this.total = response.data.total;
        console.log(response);
        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false;
        }, 1.5 * 1000);
      });
    },
    handleFilter() {
      this.listQuery.page = 1;
      this.getList();
    },
    handleDownload() {
      this.downloadLoading = true;
      import("@/vendor/Export2Excel").then(excel => {
        const tHeader = ["id", "telephone", "IDnumber", "type"];
        const filterVal = ["id", "telephone", "IDnumber", "type"];
        const data = this.formatJson(filterVal, this.list);
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: "table-list"
        });
        this.downloadLoading = false;
      });
    },

    formatJson(filterVal, jsonData) {
      return jsonData.map(v =>
        filterVal.map(j => {
          if (j === "timestamp") {
            return parseTime(v[j]);
          } else {
            return v[j];
          }
        })
      );
    },
    toUserType(type) {
      return this.$t("user.type_" + type);
    },
    outBlack(id) {
      this.$confirm("此操作将把此用户移除黑名单, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.listLoading = true;
          outOfBlacklist(id).then(response => {
            if (response.status === 200) {
              this.$notify({
                title: "成功",
                message: "移除成功",
                type: "success",
                duration: 2000
              });
              this.getList();
            } else {
              this.$notify({
                title: "失败",
                message: response.data,
                type: "fail",
                duration: 2000
              });
            }
            setTimeout(() => {
              this.listLoading = false;
            }, 1.5 * 1000);
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消移除"
          });
        });
    },
    checkList(telephone) {
      this.$router.push({ path: this.redirect + "?telephone=" + telephone });
    }
  }
};
</script>
