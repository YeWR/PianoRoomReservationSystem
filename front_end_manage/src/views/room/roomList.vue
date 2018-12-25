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
      <el-table-column :label="$t('table.actions')" align="center" width="300" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button size="small" @click="handleTime(scope.row)">{{ $t('table.ruleEdit') }}</el-button>
          <el-button type="primary" size="small" @click="handleUpdate(scope.row)">{{ $t('table.infoEdit') }}</el-button>
          <el-button v-if="scope.row.status!='开放中'" size="small" type="success"  @click="handleStatus(scope.row)">{{ $t('table.open') }}
          </el-button>
          <el-button v-if="scope.row.status!='已关闭'" size="small" type="danger"  @click="handleStatus(scope.row)">{{ $t('table.close') }}
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
          <el-tag>{{temp.info}}</el-tag>
        </el-form-item>
        <el-form-item :label="$t('table.value')" prop="value">
          <el-tag>学生({{ temp.stuValue }})--教师({{ temp.teaValue }})--校外({{ temp.socValue }})--多人({{ temp.multiValue }})</el-tag>
        </el-form-item>
      </el-form>
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="150px" style="width: 450px; margin-left:50px;">
        <el-form-item :label="$t('table.claim')" prop="claim"></el-form-item>
      </el-form>
      <el-table :data="gridData"  style="width: 450px; margin-left:50px;">
        <el-table-column property="number" label="序号" width="70"/>
        <el-table-column property="week" label="星期" width="200"/>
        <el-table-column property="startTime" label="开始时间"/>
        <el-table-column property="endTime" label="结束时间"/>
      </el-table>
    </el-dialog>

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="timeFromVisible">
    <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="70px" style="width: 600px; margin-left:50px;">
      <el-form-item :label="$t('table.week')" prop="week">
          <el-select v-model="temp.week" :placeholder="$t('table.week')" clearable class="filter-item" style="width: 130px">
            <el-option v-for="item in weekptions" :key="item.key" :label="item.label" :value="item.key"/>
          </el-select>
      </el-form-item>
      <el-form-item :label="$t('table.start')" prop="start">
        <el-time-picker v-model="temp.start" value-format="HH:mm" format="HH:mm" style = "width:50%;"> </el-time-picker>
      </el-form-item>
      <el-form-item :label="$t('table.end')" prop="end">
        <el-time-picker v-model="temp.end" value-format="HH:mm" format="HH:mm" style = "width:50%;"> </el-time-picker>
      </el-form-item>
      <el-form-item>
          <el-button size='small' type="success" @click="addRule(1)">增加规则</el-button>
      </el-form-item>
    </el-form>
    <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="150px" style="width: 600px; margin-left:50px;">
      <el-form-item :label="$t('table.claim')" prop="claim"></el-form-item>
    </el-form>
    <el-table v-loading="listLoading" :data="gridData" border fit highlight-current-row style="width: 100%">
      <el-table-column width="50px" align="center" label="序号">
        <template slot-scope="scope">
          <span>{{ scope.row.number }}</span>
        </template>
      </el-table-column>
      <el-table-column width="90px" align="center" label="星期">
        <template slot-scope="scope">
          <span>{{ scope.row.week }}</span>
        </template>
      </el-table-column>
      <el-table-column min-width="100px" label="开始时间">
        <template slot-scope="scope">
            <el-time-picker v-model="scope.row.startTime" value-format="HH:mm" format="HH:mm" style = "width:80%;"> </el-time-picker>
        </template>
      </el-table-column>
      <el-table-column min-width="100px" label="结束时间">
        <template slot-scope="scope">
            <el-time-picker v-model="scope.row.endTime" value-format="HH:mm" format="HH:mm" style = "width:80%;"> </el-time-picker>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" width="180">
        <template slot-scope="scope">
          <el-button type="success" size="mini" icon="el-icon-circle-check-outline" @click="confirmEdit(scope.row)">Ok</el-button>
          <el-button size="mini" type="danger" @click="deleteRule(scope.row)">Delete</el-button>
        </template>
      </el-table-column>
    </el-table>
    </el-dialog>
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="updateFromVisible">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="70px" style="width: 450px; margin-left:50px;">
        <el-form-item :label="$t('table.room')" prop="room">
          <el-input style="width: 150px;" :placeholder="$t('table.room')" v-model="temp.room"/>
        </el-form-item>
        <el-form-item :label="$t('table.roomType')" prop="room">
          <el-input style="width: 150px;" :placeholder="$t('table.type')" v-model="temp.type"/>
        </el-form-item>
        <el-form-item :label="$t('table.stuvalue')" prop="stuvalue">
          <el-input style="width: 150px;" :placeholder="$t('table.stuvalue')" v-model="temp.stuValue"/>
        </el-form-item>
        <el-form-item :label="$t('table.teavalue')" prop="teavalue">
          <el-input style="width: 150px;" :placeholder="$t('table.teavalue')" v-model="temp.teaValue"/>
        </el-form-item>
        <el-form-item :label="$t('table.socvalue')" prop="socvalue">
          <el-input style="width: 150px;" :placeholder="$t('table.socvalue')" v-model="temp.socValue"/>
        </el-form-item>
        <el-form-item :label="$t('table.multivalue')" prop="multivalue">
          <el-input style="width: 150px;" :placeholder="$t('table.multivalue')" v-model="temp.multiValue"/>
        </el-form-item>
        <el-form-item :label="$t('table.info')" prop="info">
          <el-input :placeholder="$t('table.info')" v-model="temp.info"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="updateFromVisible = false">{{ $t('table.cancel') }}</el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">{{ $t('table.confirm') }}</el-button>
      </div>
    </el-dialog>
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="newFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="70px" style="width: 450px; margin-left:50px;">
        <el-form-item :label="$t('table.room')" prop="room">
          <el-input :placeholder="$t('table.room')" v-model="temp.room"/>
        </el-form-item>
        <el-form-item :label="$t('table.roomType')" prop="roomType">
          <el-input :placeholder="$t('table.type')" v-model="temp.type"/>
        </el-form-item>
        <el-form-item :label="$t('table.status')" prop="status">
          <el-select v-model="temp.status" class="filter-item" placeholder="请选择">
            <el-option v-for="item in calendarTypeOptions" :key="item.key" :label="item.display_name" :value="item.key"/>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('table.info')" prop="info">
          <el-input :placeholder="$t('table.info')" v-model="temp.info"/>
        </el-form-item>
        <el-form-item :label="$t('table.stuvalue')" prop="stuvalue">
          <el-input style="width: 150px;" :placeholder="$t('table.stuvalue')" v-model="temp.stuValue"/>
        </el-form-item>
        <el-form-item :label="$t('table.teavalue')" prop="teavalue">
          <el-input style="width: 150px;" :placeholder="$t('table.teavalue')" v-model="temp.teaValue"/>
        </el-form-item>
        <el-form-item :label="$t('table.socvalue')" prop="socvalue">
          <el-input style="width: 150px;" :placeholder="$t('table.socvalue')" v-model="temp.socValue"/>
        </el-form-item>
        <el-form-item :label="$t('table.multivalue')" prop="multivalue">
          <el-input style="width: 150px;" :placeholder="$t('table.multivalue')" v-model="temp.multiValue"/>
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
import { fetchList, fetchPv, createRoom, fetchDetail, StatusRoom, InfoRoom, RuleRoom,RuleChangeRoom} from '@/api/room'
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
      gridData: [],
      oldData:[],
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,  // 第几页
        limit: 10,      // 一页的个数
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
        info:'',
        start: 0,
        end:0,
        week:0
      },
      unaviliableType:2,
      calendarTypeOptions : [
        { key: '1', display_name: '开放（open）' },
        { key: '0', display_name: '关闭（close）' }
      ],
      weekptions :[
        {key:0, label:'星期一'},
        {key:1, label:'星期二'},
        {key:2, label:'星期三'},
        {key:3, label:'星期四'},
        {key:4, label:'星期五'},
        {key:5, label:'星期六'},
        {key:6, label:'星期日'}
      ],
      dialogFormVisible: false,
      newFormVisible: false, 
      updateFromVisible:false,
      timeFromVisible:false,
      dialogStatus: '',
      textMap: {
        detail: 'Detail',
        create: 'Create',
        edit:'Edit'
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
        let tmp_items = response.data.items
        this.total = response.data.total
        let tmp = []
        for(let i = 0; i<tmp_items.length; i++){
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
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
      })
    },
    cancelEdit(row){
      row.edit = !row.edit
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    sortChange(data) {
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
      let dis = Array(588);
      dis.fill(0);
      this.temp = {
        id: '',         // 琴房id
        room: '',       // 房间号
        type: '',       // 琴房类型
        status: '',       // 是否显示
        stuValue: '',    // 学生价格
        teaValue: '',     // 老师价格
        socValue: '',     // 社会人价格
        multiValue:'',    // 多人价格
        disabled:dis,  // 不可以使用的时间，在detail中有
        info:'',
        start:0,
        end:0,
        week:0
      }
    },
    handleUpdate(row) {
      this.updateFromVisible = false;
      this.dialogStatus = 'edit';
      fetchDetail(row.id).then(response => {
        console.log(response.data.items[0])
        this.analysisDisabled(response.data.items[0].disabled)
        this.temp = Object.assign({}, row) // copy obj
        this.updateFromVisible = true
        this.temp.info = response.data.items[0].info
        setTimeout(() => {
        }, 1.5 * 1000)
      })
    },
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create';
      this.newFormVisible = true;
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    handleTime(row){
      this.timeFromVisible = true
      this.dialogStatus = 'edit';
      fetchDetail(row.id).then(response => {
        console.log(response.data.items[0])
        this.analysisDisabled(response.data.items[0].disabled)
        this.temp = Object.assign({}, row) // copy obj
        setTimeout(() => {
        }, 1.5 * 1000)
      })
    },
    handleStatus(row){
      let s = '是否继续？'
      let msg = '成功'
      let key = 0
        if(row.status == '开放中'){
          s = '此操作将关闭此琴房, 是否继续?'
          msg = '关闭成功'
          key = 0
        }
        else{
          s = '此操作将开启此琴房, 是否继续?'
          key = 1
          msg = '开启成功'
        }
        this.$confirm(s, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let data = {
            id: row.id,
            status:key
          }
          StatusRoom(data).then(response => {
            console.log(response)
            if(response.status == 200){
              this.$notify({
                title: '成功',
                message: msg,
                type: 'success',
                duration: 2000
              })
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
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          });          
        });
    },
    updateData(){
        this.$confirm('此操作将更改琴房基本信息, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
            console.log(this.temp)
            let data = {
              id:this.temp.id,
              room: parseInt(this.temp.room),
              type: this.temp.type,
              stuValue:this.temp.stuValue,
              teaValue:this.temp.teaValue,
              socValue:this.temp.socValue,
              multiValue:this.temp.multiValue,
              info:this.temp.info
            }
            InfoRoom(data).then(response => {
              if(response.status === 200){
                    this.$notify({
                      title: '成功',
                      message: '更改成功',
                      type: 'success',
                      duration: 2000
                    })
                    this.updateFromVisible = false;
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
    createData() {
        this.$confirm('此操作将公开此琴房, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
            console.log(this.temp)
            let data = {
              room: this.temp.room,
              type: this.temp.type,
              status: this.temp.status,
              stuValue:this.temp.stuValue,
              teaValue:this.temp.teaValue,
              socValue:this.temp.socValue,
              multiValue:this.temp.multiValue,
              info:this.temp.info
            }
            createRoom(data).then(response => {
              if(response.status === 200){
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
    getIndex(str){
      let m = 0
      let n = 0
      let flag = 0
      for(let i = 0; i<str.length; i++){
        if(str[i] === ':'){
          flag = 1
          continue
        }
        if(flag === 0){
          m = m+str[i]
        }
        else{
          n = n+str[i]
        }
      }
      let x = parseInt(m)-8
      let y = parseInt(parseInt(n)/10)
      return x*6+y
    },
    deleteRule(row){
      let s = ['星期一','星期二','星期三','星期四','星期五','星期六','星期日']
      let key = 0
      for(let i = 0; i<s.length; i++){
        if(row.week === s[i]){
          key = i
          break
        }
      }
      console.log(row.week)
        this.$confirm('此操作将删除此规则, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
            let data = {
              id: this.temp.id,
              start: this.getIndex(row.startTime),
              end: this.getIndex(row.endTime),
              week:key,
              type:0
            }
            console.log(data)
            RuleRoom(data).then(response => {
              if(response.status === 200){
                    this.$notify({
                      title: '成功',
                      message: '删除成功',
                      type: 'success',
                      duration: 2000
                    })
                    fetchDetail(this.temp.id).then(response => {
                      this.analysisDisabled(response.data.items[0].disabled)
                      setTimeout(() => {
                      }, 1.5 * 1000)
                    })
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
    checkStart(str){
      let m = 0;
      let n = 0;
      let flag = 0;
      for(let i = 0; i<str.length; i++){
        if(str[i] === ':'){
          flag = 1;
          continue;
        }
        if(flag === 0){
          m = m+str[i];
        }
        else{
          n = n+str[i];
        }
      }
      let x = parseInt(m)-8;
      if(x < 0){
        return 0;
      }
      else{
        return 1;
      }
    },
    checkEnd(str){
      let m = 0;
      let n = 0;
      let flag = 0;
      for(let i = 0; i<str.length; i++){
        if(str[i] === ':'){
          flag = 1;
          continue;
        }
        if(flag === 0){
          m = m+str[i];
        }
        else{
          n = n+str[i];
        }
      }
      let x = parseInt(m);
      let y = parseInt(parseInt(n)/10);
      if(x < 22){
        return 1;
      }
      else if(x>22){
        return 0;
      }
      else if(y>0){
        return 0;
      }
      else{
        return 1;
      }
    },
    checkTime(start,end){
      if(!this.checkStart(start) || !this.checkStart(end)){
        this.$message({
          type: 'info',
          message: '时间不可早于8：00'
        });
        return 0
      }
      if(!this.checkEnd(end) || !this.checkEnd(start)){
        this.$message({
          type: 'info',
          message: '时间不可晚于22：00'
        });
        return 0
      }
      if(this.getIndex(start) > this.getIndex(end)){
        this.$message({
          type: 'info',
          message: '时间差不可小于10min'
        });
        return 0
      }
      return 1;
    },
    addRule(operate){
      if(this.temp.week.length === 0){
        this.$message({
          type: 'info',
          message: '请选择星期'
        });
        return 0
      }
      if(!this.checkTime(this.temp.start,this.temp.end)){
        return 0
      }
      this.$confirm('此操作将增加琴房的不可用时间, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
            let data = {
              id: this.temp.id,
              start: this.getIndex(this.temp.start),
              end: this.getIndex(this.temp.end),
              week:this.temp.week,
              type:this.unaviliableType
            }
            console.log(data)
            RuleRoom(data).then(response => {
              if(response.status === 200){
                    this.$notify({
                      title: '成功',
                      message: '添加成功',
                      type: 'success',
                      duration: 2000
                    })
                    fetchDetail(this.temp.id).then(response => {
                      this.analysisDisabled(response.data.items[0].disabled)
                      setTimeout(() => {
                      }, 1.5 * 1000)
                    })
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
    confirmEdit(row){
      if(!this.checkTime(row.startTime,row.endTime)){
        return 0
      }
      let s = ['星期一','星期二','星期三','星期四','星期五','星期六','星期日']
      let key = 0
      for(let i = 0; i<s.length; i++){
        if(row.week === s[i]){
          key = i
          break
        }
      }
      this.$confirm('此操作将更改琴房的不可用时间, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
            fetchDetail(this.temp.id).then(response => {
              let tmp = this.analysisDisabledWithoutChange(response.data.items[0].disabled)
              let data = {
                id: this.temp.id,
                oldStart:this.getIndex(tmp[row.number].startTime),
                oldEnd:this.getIndex(tmp[row.number].endTime),
                newStart: this.getIndex(row.startTime),
                newEnd: this.getIndex(row.endTime),
                week:key,
                type:1
              }
              RuleChangeRoom(data).then(response => {
                if(response.status === 200){
                      this.$notify({
                        title: '成功',
                        message: '更改成功',
                        type: 'success',
                        duration: 2000
                      })
                      fetchDetail(this.temp.id).then(response => {
                        this.analysisDisabled(response.data.items[0].disabled)
                        setTimeout(() => {
                        }, 1.5 * 1000)
                      })
                      row.edit = !row.edit
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
              setTimeout(() => {
              }, 1.5 * 1000)
            })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          });          
        });
    },
    pad(num, n) {
        let len = num.toString().length;
        while(len < n) {
          num = "0" + num;
          len++;
        }
        return num;
    },
    getTime(offset){
      let n = parseInt(offset/6);
      let num = offset%6;
      return this.pad((8+n),2)+':'+this.pad((num*10),2)
    },
    analysisDisabledWithoutChange(list){
      let tmp = []
      let weekStr = ['星期一','星期二','星期三','星期四','星期五','星期六','星期日']
      let id = 0
      for(let i = 0; i<7; i++){
        let flag = 0
        let start = 0
        let end = 0
        for(let j = 0; j<84; j++){
          if(list[84*i+j] === this.unaviliableType && flag === 0){
            start = j;
            flag = 1
          }
          else if(list[84*i+j] === 0 && flag === 1){
            flag = 0;
            end = j;
            tmp.push({
              number: id,
              week: weekStr[i],
              startTime: this.getTime(start),
              endTime: this.getTime(end)
            })
            id = id+1;
          }
          else if(j === 83 && flag === 1){
            flag = 0;
            end = j+1;
            tmp.push({
              number: id,
              week: weekStr[i],
              startTime: this.getTime(start),
              endTime: this.getTime(end),
              edit:0
            })
            id = id+1;
          }
        }
      }
      return tmp;
    },
    analysisDisabled(list){
      let tmp = []
      let weekStr = ['星期一','星期二','星期三','星期四','星期五','星期六','星期日']
      let id = 0
      for(let i = 0; i<7; i++){
        let flag = 0
        let start = 0
        let end = 0
        for(let j = 0; j<84; j++){
          if(list[84*i+j] === this.unaviliableType && flag === 0){
            start = j;
            flag = 1
          }
          else if(list[84*i+j] === 0 && flag === 1){
            flag = 0;
            end = j;
            tmp.push({
              number: id,
              week: weekStr[i],
              startTime: this.getTime(start),
              endTime: this.getTime(end)
            })
            id = id+1;
          }
          else if(j === 83 && flag === 1){
            flag = 0;
            end = j+1;
            tmp.push({
              number: id,
              week: weekStr[i],
              startTime: this.getTime(start),
              endTime: this.getTime(end),
              edit:0
            })
            id = id+1;
          }
        }
      }
      this.gridData = tmp;
    },
    handleDetail(row) {
      this.dialogFormVisible = false
      this.dialogStatus = 'detail';
      fetchDetail(row.id).then(response => {
        this.analysisDisabled(response.data.items[0].disabled)
        this.temp = Object.assign({}, row) // copy obj
        this.dialogFormVisible = true
        this.temp.info = response.data.items[0].info
        setTimeout(() => {
        }, 1.5 * 1000)
      })
    },
    handleDownload() {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['id', 'room', 'status', 'type','stuValue','teaValue', 'socValue', 'multiValue']
        const filterVal = ['id', 'room', 'status', 'type','stuValue','teaValue', 'socValue', 'multiValue']
        const data = this.formatJson(filterVal, this.list)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: 'room-list'
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