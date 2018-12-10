<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input :placeholder="$t('table.title')" v-model="listQuery.title" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter"/>
      <el-input :placeholder="$t('table.author')" v-model="listQuery.author" style="width: 140px;" class="filter-item" @keyup.enter.native="handleFilter"/>
      <el-select v-model="listQuery.sort" style="width: 180px" class="filter-item" @change="handleFilter">
        <el-option v-for="item in sortOptions" :key="item.key" :label="item.label" :value="item.key"/>
      </el-select>
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">{{ $t('table.search') }}</el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate">{{ $t('table.add') }}</el-button>
      <el-button v-waves :loading="downloadLoading" class="filter-item" type="primary" icon="el-icon-download" @click="handleDownload">{{ $t('table.export') }}</el-button>
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
      <el-table-column :label="$t('table.id')" align="center" width="65">
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.date')" prop="date" sortable="custom" width="150px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.timestamp | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.title')" min-width="150px">
        <template slot-scope="scope">
          <span class="link-type" @click="handleDetail(scope.row)">{{ scope.row.title }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.author')" width="110px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.author }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.actions')" align="center" width="230" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button v-if="scope.row.status!='deleted'" size="mini" type="danger" @click="handleDelete(scope.row)">{{ $t('table.delete') }}
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="70px" style="width: 450px; margin-left:50px;">
        <el-form-item :label="$t('table.title')" prop="title">
          <el-input v-model="temp.title" disabled = "disabled"/>
        </el-form-item>
        <el-form-item :label="$t('table.author')" prop="author">
          <el-input v-model="temp.author" disabled = "disabled"/>
        </el-form-item>
        <el-form-item :label="$t('table.date')" prop="timestamp">
          <el-input v-model="temp.timestamp.getFullYear()+'-'+(temp.timestamp.getMonth()+1)+'-'+temp.timestamp.getDate()" disabled = "disabled"/>
        </el-form-item>
        <el-form-item :label="$t('table.content')">
        <textarea style="width: 450px; margin-top:10px; font-size:16px;font-family:'微软雅黑';" rows="10" v-model="temp.content" disabled = "disabled"></textarea>
        </el-form-item>
      </el-form>
    </el-dialog>

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="newFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="70px" style="width: 450px; margin-left:50px;">
        <el-form-item :label="$t('table.title')" prop="title">
          <el-input v-model="temp.title"/>
        </el-form-item>
        <el-form-item :label="$t('table.author')" prop="author">
          <el-input v-model="temp.author"/>
        </el-form-item>
        <el-form-item :label="$t('table.date')" prop="timestamp">
          <el-input v-model="temp.timestamp.getFullYear()+'-'+(temp.timestamp.getMonth()+1)+'-'+temp.timestamp.getDate()"/>
        </el-form-item>
        <el-form-item :label="$t('table.content')">
        <textarea placeholder="请输入内容" style="width: 450px; margin-top:10px; font-size:16px;font-family:'微软雅黑';" rows="10" v-model="temp.content"></textarea>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="newFormVisible = false">{{ $t('table.cancel') }}</el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">{{ $t('table.confirm') }}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { fetchList, fetchPv, createNotice,fetchDetail,DeleteNotice} from '@/api/notice'
import waves from '@/directive/waves' // Waves directive
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
export default {
  name: 'ComplexTable',
  components: { Pagination },
  directives: { waves },
  filters: {
    statusFilter(status) {
      const statusMap = {
        deleted: 'danger'
      }
      return statusMap[status]
    },
  },
  // to do sort & query
  data() {
    return {
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,  // 第几页
        limit: 10,      // 一页的个数
        title: '',
        author: '', // 没有则为空
        sort: 'date', // 后端不用管这个 
        dateSort: '+' // -表示减，+表示加
      },
      sortOptions: [{ label: 'Date Ascending', key: 'date' }, { label: 'Date Descending', key: '-date' }],
      temp: {
        id: '',
        timestamp: new Date(),
        title: '',
        type: '1',
        author:'',
        content: ''
      },
      dialogFormVisible: false,
      newFormVisible: false, 
      dialogStatus: '',
      textMap: {
        detail: 'Detail',
        create: 'Create',
      },
      rules: {
        type: [{ required: true, message: 'type is required', trigger: 'change' }],
        timestamp: [{ type: 'date', required: true, message: 'timestamp is required', trigger: 'change' }],
        title: [{ required: true, message: 'title is required', trigger: 'blur' }]
      },
      downloadLoading: false
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true;
      fetchList(this.listQuery).then(response => {
        console.log(response.data)
        let tmp_items = response.data.items
        this.total = response.data.total
        let tmp = []
        for(let i = 0; i<tmp_items.length; i++){
          console.log(tmp_items[i].id)
          tmp.push({
            id:tmp_items[i].id,
            timestamp:new Date(Date.parse(tmp_items[i].date)),
            author:tmp_items[i].author,
            title:tmp_items[i].title,
            content:undefined
          })
        }
        this.list = tmp
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
      })
    },
    handleFilter() {
      if(this.listQuery.sort == 'date'){
        this.listQuery.dateSort = '+'
      }
      else{
        this.listQuery.dateSort = '-'
      }
      this.listQuery.page = 1
      this.getList()
    },
    sortChange(data) {
      console.log(data)
      const { prop, order } = data
      if (prop === 'date') {
        this.sortByID(order)
      }
    },
    sortByID(order) {
      if (order === 'ascending') {
        this.listQuery.sort = 'Date Ascending'
        this.listQuery.dateSort = '+'
      } else {
        this.listQuery.sort = 'Date Descending'
        this.listQuery.dateSort = '-'
      }
      this.handleFilter()
    },
    resetTemp() {
      this.temp = {
        id: undefined,
        importance: 1,
        remark: '',
        timestamp: new Date(),
        title: '',
        status: 'published',
        type: ''
      }
    },
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create';
      this.newFormVisible = true;
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData() {
        this.$confirm('此操作将发布此公告, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
            let data = {
              title: this.temp.title,
              time: this.temp.timestamp.getFullYear()+'-'+(this.temp.timestamp.getMonth()+1)+'-'+this.temp.timestamp.getDate()+' '+this.temp.timestamp.getHours()+':'+this.temp.timestamp.getMinutes()+':'+this.temp.timestamp.getSeconds(),
              author: this.temp.author,
              content: this.temp.content
            }
            createNotice(data).then(response => {
              if(response.status == 200){
                    this.$notify({
                      title: '成功',
                      message: '添加成功',
                      type: 'success',
                      duration: 2000
                    })
                    this.newFormVisible = false;
                    this.getList()
              }
              else{
                    this.$notify({
                      title: '失败',
                      message: response.data,
                      type: 'fail',
                      duration: 2000
                    })
              }
              setTimeout(() => {
                this.listLoading = false
              }, 1.5 * 1000)
            })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          });          
        });
    },
    handleDetail(row) {
      this.dialogFormVisible = false
      this.listLoading = true;
      this.dialogStatus = 'detail';
      fetchDetail(row.id).then(response => {
        this.temp = Object.assign({}, row) // copy obj
        this.temp.content = response.data.content
        this.dialogFormVisible = true
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
      })
    },
    handleDelete(row){
        this.$confirm('此操作将删除此公告, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.listLoading = true;
          let data = {
            id: row.id
          }
          DeleteNotice(data).then(response => {
            if(response.status == 200){
              this.$notify({
                title: '成功',
                message: '删除成功',
                type: 'success',
                duration: 2000
              })
              const index = this.list.indexOf(row);
              this.list.splice(index, 1);
              this.total = this.total -1;
            }
            else{
              this.$notify({
                title: '失败',
                message: response.data,
                type: 'fail',
                duration: 2000
              })
            }
            setTimeout(() => {
              this.listLoading = false
            }, 1.5 * 1000)
          }) 
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });          
        });
    },
    handleDownload() {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['id', 'title', 'author', 'time']
        const filterVal = ['id', 'title', 'author', 'timestamp']
        const data = this.formatJson(filterVal, this.list)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: 'notice-list'
        })
        this.downloadLoading = false
      })
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => {
        if (j === 'timestamp') {
          return parseTime(v[j])
        } else {
          return v[j]
        }
      }))
    }
  }
}
</script>