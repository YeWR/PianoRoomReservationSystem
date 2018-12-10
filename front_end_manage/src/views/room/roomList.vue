<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input :placeholder="$t('table.room')" v-model="listQuery.room" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter"/>
      <el-input :placeholder="$t('table.roomType')" v-model="listQuery.roomType" style="width: 140px;" class="filter-item" @keyup.enter.native="handleFilter"/>
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
      <el-table-column :label="$t('table.id')" align="center" width="70">
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.room')" prop="date" width="150px" align="center">
        <template slot-scope="scope">
          <span class="link-type" @click="handleDetail(scope.row)">{{ scope.row.room }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.type')" min-width="100px">
        <template slot-scope="scope">
          <span>{{ scope.row.type }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.status')" width="150px" align="center">
        <template slot-scope="scope">
          <el-tag>{{ scope.row.status }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.stuvalue')" width="100px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.stuValue }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.teavalue')" width="100px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.teaValue }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.socvalue')" width="100px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.socValue }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.multivalue')" width="100px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.multiValue }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.actions')" align="center" width="230" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="handleUpdate(scope.row)">{{ $t('table.edit') }}</el-button>
          <el-button v-if="scope.row.status!='开放中'" size="mini" type="success">{{ $t('table.open') }}
          </el-button>
          <el-button v-if="scope.row.status!='已关闭'" size="mini" type="danger">{{ $t('table.close') }}
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="70px" style="width: 450px; margin-left:50px;">
        <el-form-item :label="$t('table.room')" prop="room">
          <el-tag>{{temp.room}} --- {{temp.type}}</el-tag>
        </el-form-item>
        <el-form-item :label="$t('table.status')" prop="status">
          <el-tag>{{temp.status}}</el-tag>
        </el-form-item>
        <el-form-item :label="$t('table.info')" prop="info">
          <el-input v-model="temp.info" disabled = "disabled"/>
        </el-form-item>
        <el-form-item :label="$t('table.value')" prop="value">
          <el-tag>学生：{{ temp.stuValue }} 教师：{{ temp.teaValue }} 校外：{{ temp.socValue }} 多人：{{ temp.multiValue }}</el-tag>
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
import { fetchList, fetchPv, createRoom,fetchDetail,DeleteRoom} from '@/api/room'
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
        close: 'danger',
        edit: 'info'
      }
      return statusMap[status]
    },
  },
  data() {
    return {
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,  // 第几页
        limit: 20,      // 一页的个数
        room: '',
        roomType: '' // 没有则为空
      },
      temp: {
        id: '',         // 琴房id
        room: '',       // 房间号
        type: '',       // 琴房类型
        status: '',       // 是否显示
        stuValue: 10,    // 学生价格
        teaValue: 15,     // 老师价格
        socValue: 20,     // 社会人价格
        multiValue:20,    // 多人价格
        disabled:undefined,  // 不可以使用的时间，在detail中有
        info:''
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
        console.log(response.data.items)
        this.total = response.data.total
        console.log(response.data.total)
        let tmp = []
        for(let i = 0; i<this.total; i++){
          let data = {
            id:tmp_items[i].id,
            room: tmp_items[i].room,
            status:tmp_items[i].status,
            type:tmp_items[i].type,
            stuValue:tmp_items[i].stuValue,
            teaValue:tmp_items[i].teaValue,
            socValue:tmp_items[i].socValue,
            multiValue:tmp_items[i].multiValue,
            disabled:undefined,
            info: ''
          }
          if(data.status == '1'){
            data.status = '开放中'
          }
          else{
            data.status = '已关闭'
          }
          tmp.push(data)
        }
        this.list = tmp
        console.log(this.list)
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
      })
    },
    handleFilter() {
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
              author: this.temp.author,
              content: this.temp.content
            }
            console.log(data)
            createRoom(data).then(response => {
              console.log(response)
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
        console.log(response.data)
        this.temp = Object.assign({}, row) // copy obj
        this.temp.content = response.data.content
        console.log(this.temp.content)
        this.dialogFormVisible = true
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
      })
    },
    handleEdit(row){

    },
    handleDelete(row){
        this.$confirm('此操作将删除此公告, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          console.log(row)
          this.listLoading = true;
          let data = {
            id: row.id
          }
          DeleteRoom(data).then(response => {
            console.log(response.status);
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
              console.log(this.list)
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