<template>
  <div class="app-container">
    <div class="filter-container">

      <el-input :placeholder="$t('item.idNumber')" v-model="listQuery.idNumber" style="width: 140px;"
                class="filter-item"
                @keyup.enter.native="handleFilter"/>

      <el-input :placeholder="$t('item.room')" v-model="listQuery.room" style="width: 100px;" class="filter-item"
                @keyup.enter.native="handleFilter"/>

      <el-select v-model="listQuery.itemType" style="width: 250px" class="filter-item" @change="handleFilter">
        <el-option v-for="item in itemTypeSortOptions()" :key="item.key" :label="item.label" :value="item.key"/>
      </el-select>

      <el-select v-model="listQuery.status" style="width: 320px" class="filter-item" @change="handleFilter">
        <el-option v-for="item in statusSortOptions()" :key="item.key" :label="item.label" :value="item.key"/>
      </el-select>

      <el-select v-model="listQuery.timeSort" style="width: 180px" class="filter-item" @change="handleFilter">
        <el-option v-for="item in timeSortOptions()" :key="item.key" :label="item.label" :value="item.key"/>
      </el-select>

      <el-button v-waves class="filter-item" style="width: 100px" type="primary" icon="el-icon-search"
                 @click="handleFilter">{{
        $t('item.search') }}
      </el-button>
      <el-button v-waves :loading="downloadLoading" class="filter-item" style="width: 150px;float: right;"
                 type="primary" icon="el-icon-download"
                 @click="handleDownload">{{ $t('item.export') }}
      </el-button>
    </div>

    <el-table
      v-loading="listLoading"
      :key="tableKey"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;"
      @sort-change="sortChange">
      <el-table-column :label="$t('item.idNumber')" prop="idNumber" align="center" width="250px">
        <template slot-scope="scope">
          <span>{{ scope.row.idNumber }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('item.room')" width="250px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.room }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('item.itemType')" width="250px" align="center">
        <template slot-scope="scope">
          <el-tag>{{ toItemType(scope.row.itemType) }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column :label="$t('item.status')" width="250px" align="center">
        <template slot-scope="scope">
          <el-tag>{{ toItemStatus(scope.row.status) }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column :label="$t('item.time')" min-width="250px" align="center" sortable="custom" prop="time">
        <template slot-scope="scope">
          <span>{{ scope.row.time }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('item.actions')" align="center" width="300px" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="handleView(scope.row)">{{ $t('item.detail') }}</el-button>
          <el-button type="danger" size="mini" @click="handleDeleteItem(scope.row)">{{ $t('item.delete') }}
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!--<el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">-->
    <!--<el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="200px"-->
    <!--style="width: 400px; margin-left:50px;">-->
    <!--</el-form>-->
    <!--</el-dialog>-->

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit"
                @pagination="getList"/>

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="200px"
               style="width: 400px; margin-left:50px;">
        <el-form-item :label="$t('item.itemId')">
          <span><el-tag>{{ temp.itemId }}</el-tag></span>
        </el-form-item>
        <el-form-item :label="$t('item.idNumber')">
          <span><el-tag>{{ temp.idNumber }}</el-tag></span>
        </el-form-item>
        <el-form-item :label="$t('item.userType')">
          <span><el-tag>{{ toItemType(temp.userType) }}</el-tag></span>
        </el-form-item>
        <el-form-item :label="$t('item.time')">
          <span><el-tag>{{ temp.time }}</el-tag></span>
        </el-form-item>
        <el-form-item :label="$t('item.room')">
          <span><el-tag>{{ temp.room }}</el-tag></span>
        </el-form-item>
        <el-form-item :label="$t('item.pianoType')">
          <span><el-tag>{{ temp.pianoType }}</el-tag></span>
        </el-form-item>
        <el-form-item :label="$t('item.itemType')">
          <span><el-tag>{{ toItemType(temp.itemType) }}</el-tag></span>
        </el-form-item>
        <el-form-item :label="$t('item.status')">
          <span><el-tag>{{ toItemStatus(temp.status) }}</el-tag></span>
        </el-form-item>
        <el-form-item :label="$t('item.price')">
          <span><el-tag>￥{{ temp.price }}</el-tag></span>
        </el-form-item>
      </el-form>
    </el-dialog>

  </div>
</template>

<script>
  import {getItemList, deleteItem} from "@/api/item"
  import waves from '@/directive/waves' // Waves directive
  import {parseTime} from '@/utils'
  import Pagination from '@/components/Pagination' // Secondary package based on el-pagination

  export default {
    name: 'ItemAll',
    components: {Pagination},
    directives: {waves},
    data() {
      return {
        tableKey: 0,
        list: null,
        total: 0,
        listLoading: true,
        listQuery: {
          page: 1,
          limit: 20,
          idNumber: '',
          room: '',
          itemType: '',
          status: '',
          timeSort: '+'
        },
        timeSortOptions: () => {
          return [{label: this.$t('item.timeDes'), key: '+'}, {label: this.$t('item.timeAsc'), key: '-'}]
        },
        itemTypeSortOptions: () => {
          let ans = []
          ans.push({
            label: this.$t('item.itemType') + ': ' + this.toItemType(''),
            key: ''
          })
          for (let i = 0; i < 4; ++i) {
            ans.push({
              label: this.$t('item.itemType') + ': ' + this.toItemType(i),
              key: i
            })
          }
          return ans
        },
        statusSortOptions: () => {
          let ans = []
          ans.push({
            label: this.$t('item.status') + ': ' + this.toItemStatus(''),
            key: ''
          })
          for (let i = 0; i <= 5; ++i) {
            ans.push({
              label: this.$t('item.status') + ': ' + this.toItemStatus(i),
              key: i
            })
          }
          return ans
        },
        statusOptions: ['published', 'draft', 'deleted'],
        temp: {
          itemId: '',
          idNumber: '',
          room: '',
          userType: 0,
          itemType: 0,
          pianoType: '',
          price: '10',
          time: '',
          status: 0,
        },
        dialogFormVisible: false,
        dialogStatus: '',
        textMap: {
          update: this.$t('item.view'),
        },
        dialogPvVisible: true,
        pvData: [],
        rules: {
          type: [{required: true, message: 'type is required', trigger: 'change'}],
          timestamp: [{type: 'date', required: true, message: 'timestamp is required', trigger: 'change'}],
          title: [{required: true, message: 'title is required', trigger: 'blur'}]
        },
        downloadLoading: false
      }
    },
    created() {
      this.getList()
    },
    methods: {
      getList() {
        this.listLoading = true
        getItemList(this.listQuery).then(response => {
          this.list = response.data.list
          this.total = response.data.total
          // Just to simulate the time of the request
          setTimeout(() => {
            this.listLoading = false
          }, 0.5 * 1000)
        })

      },
      handleFilter() {
        this.listQuery.page = 1
        this.getList()
      },
      handleDeleteItem(row) {

        let that = this
        that.$confirm(that.$t('item.confirm') + that.$t('item.delete') + '?', that.$t('item.warning'), {
          confirmButtonText: that.$t('item.confirm'),
          cancelButtonText: that.$t('item.cancel'),
          type: 'warning'
        }).then(() => {
          deleteItem(row.itemId).then(response => {
            that.$message({
              message: that.$t('item.success'),
              type: 'success'
            })

            that.getList()
          })
        }).catch(() => {
        })
        // row.status = status
      },
      sortChange(data) {
        const {prop, order} = data
        if (prop === 'time') {
          this.sortByID(order)
        }
      },
      sortByID(order) {
        if (order === 'ascending') {
          this.listQuery.timeSort = '+'
        } else {
          this.listQuery.timeSort = '-'
        }
        this.handleFilter()
      },
      handleView(row) {
        this.temp = Object.assign({}, row) // copy obj
        this.dialogStatus = 'update'
        this.dialogFormVisible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].clearValidate()
        })
      },
      handleDownload() {
        this.downloadLoading = true
        import('@/vendor/Export2Excel').then(excel => {
          const tHeader = [this.$t('item.itemId'), this.$t('item.idNumber'), this.$t('item.userType'),
            this.$t('item.time'), this.$t('item.room'), this.$t('item.pianoType'), this.$t('item.itemType'),
            this.$t('item.status'), this.$t('item.price')]
          const filterVal = ['itemId', 'idNumber', 'userType',
            'time', 'room', 'pianoType', 'itemType',
            'status', 'price']
          const data = this.formatJson(filterVal, this.list)
          excel.export_json_to_excel({
            header: tHeader,
            data,
            filename: 'table-list'
          })
          this.downloadLoading = false
        })
      },
      formatJson(filterVal, jsonData) {
        return jsonData.map(v => filterVal.map(j => {
          if (j === 'userType' || j === 'itemType') {
            return this.toItemType(v[j])
          }
          else if (j === 'status') {
            return this.toItemStatus(v[j])
          }
          else if (j === 'price') {
            return '￥' + v[j]
          }
          return v[j]
        }))
      },
      toItemType(type) {
        return this.$t('item.item_' + type)
      },
      toItemStatus(status) {
        if (status === '') {
          status = 'all'
        }
        return this.$t('item.status_' + status)
      },
    }
  }
</script>
