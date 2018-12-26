<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input :placeholder="$t('table.room')" v-model="listQuery.room" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter"/>
      <el-select v-model="listQuery.week" :placeholder="$t('item.week')" clearable class="filter-item" style="width: 130px">
          <el-option v-for="item in search_weekptions" :key="item.key" :label="item.label" :value="item.key"/>
      </el-select>
      <el-select v-model="listQuery.type" class="filter-item" placeholder="请选择">
        <el-option v-for="item in search_calendarTypeOptions" :key="item.key" :label="item.display_name" :value="item.key"/>
      </el-select>
      <el-input :placeholder="$t('item.telephone')" v-model="listQuery.number" style="width: 140px;" class="filter-item" @keyup.enter.native="handleFilter"/>
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
      <el-table-column :label="$t('item.list')" align="center" width="70">
        <template slot-scope="scope">
          <span>{{ scope.row.list }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('item.user')" prop="date" width="150px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('item.room')" min-width="100px">
        <template slot-scope="scope">
          <span>{{ scope.row.room }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('item.week')" min-width="100px">
        <template slot-scope="scope">
          <span>{{ scope.row.week }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('item.start')" width="150px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.start }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('item.end')" width="100px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.end }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('item.type')" width="200px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.type }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.actions')" align="center" width="200" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button size="small" type="danger"  @click="deleteItem(scope.row)">{{ $t('item.delete') }}
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="newFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="70px" style="width: 450px; margin-left:50px;">
        <el-form-item :label="$t('item.telephone')" prop="telephone">
          <el-input :placeholder="$t('item.telephone')" v-model="temp.id"/>
        </el-form-item>
        <el-form-item :label="$t('item.room')" prop="room">
          <el-input :placeholder="$t('item.room')" v-model="temp.room"/>
        </el-form-item>
        <el-form-item :label="$t('item.start')" prop="start">
          <el-time-picker v-model="temp.start" value-format="HH:mm" format="HH:mm" style = "width:80%;"> </el-time-picker>
        </el-form-item>
        <el-form-item :label="$t('item.end')" prop="end">
          <el-time-picker v-model="temp.end" value-format="HH:mm" format="HH:mm" style = "width:80%;"> </el-time-picker>
        </el-form-item>
        <el-form-item :label="$t('item.week')" prop="week">
          <el-select v-model="temp.week" :placeholder="$t('item.week')" clearable class="filter-item" style="width: 130px">
            <el-option v-for="item in weekptions" :key="item.key" :label="item.label" :value="item.key"/>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('item.type')" prop="type">
          <el-select v-model="temp.type" class="filter-item" placeholder="请选择">
            <el-option v-for="item in calendarTypeOptions" :key="item.key" :label="item.display_name" :value="item.key"/>
          </el-select>
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
import { addItemLong,delItemLong,getItemLongList} from '@/api/item_long'
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
        number:'',
        room:'',
        week:'',
        type: '' 
      },
      temp: {
        list:'',
        uuid: '',        
        id: '',       
        type: '',       
        start: '',      
        end: 10,  
        week:0,  
        room:0
      },
      unaviliableType:2,
      calendarTypeOptions : [
        { key: '1', display_name: '多人（multi）' },
        { key: '0', display_name: '单人（single）' },
      ],
      weekptions :[
        {key:1, label:'星期一'},
        {key:2, label:'星期二'},
        {key:3, label:'星期三'},
        {key:4, label:'星期四'},
        {key:5, label:'星期五'},
        {key:6, label:'星期六'},
        {key:0, label:'星期日'},
      ],
      search_calendarTypeOptions : [
        {key:'', display_name:'无条件'},
        { key: '3', display_name: '多人（multi）' },
        { key: '0', display_name: '单人（single）' },
      ],
      search_weekptions :[
        {key:'', label:'无条件'},
        {key:1, label:'星期一'},
        {key:2, label:'星期二'},
        {key:3, label:'星期三'},
        {key:4, label:'星期四'},
        {key:5, label:'星期五'},
        {key:6, label:'星期六'},
        {key:0, label:'星期日'},
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
      getItemLongList(this.listQuery).then(response => {
        let tmp_items = response.data.items
        this.total = response.data.count
        let tmp = []
        for(let i = 0; i<tmp_items.length; i++){
          let data = {
            uuid:tmp_items[i].item_long_id,
            list:i+1+this.listQuery.limit*(this.listQuery.page-1),
            id:tmp_items[i].item_long_userid,
            room: tmp_items[i].item_long_pianoId,
            start:this.getTime(tmp_items[i].item_long_begin),
            end:this.getTime(tmp_items[i].item_long_duration+tmp_items[i].item_long_begin),
            week:tmp_items[i].item_long_week,
            type:tmp_items[i].item_long_type
          }
          let week = ['星期日','星期一','星期二','星期三','星期四','星期五','星期六']
          data.week = week[data.week]
          if(data.type == '3'){
            data.type = '多人'
          }
          else{
            data.type = '单人'
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
    resetTemp() {
      this.temp = {
        list:'',
        uuid: '',        
        id: '',       
        type: '',       
        start: '',      
        end: '',  
        week:undefined,  
        room:undefined
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
      if(this.temp.week === "" || this.temp.room === "" || this.temp.room === undefined || this.temp.week === undefined){
          this.$message({
            type: 'info',
            message: '订单信息尚未完成，请继续填写'
          });  
        return 0;
      }
      if(!this.checkTime(this.temp.start,this.temp.end)){
        return 0;
      }
        this.$confirm('此操作将新建长期预约, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
            let data = {
              id: this.temp.id,
              type: this.temp.type,
              start: this.getIndex(this.temp.start),
              end:this.getIndex(this.temp.end),
              week:this.temp.week,
              room:this.temp.room
            }
            addItemLong(data).then(response => {
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
      return x*6+y;
    },
    deleteItem(row){
      let s = ['星期日','星期一','星期二','星期三','星期四','星期五','星期六']
      let key = 0
      for(let i = 0; i<s.length; i++){
        if(row.week === s[i]){
          key = i
          break
        }
      }
        this.$confirm('此操作将删除此长期预约, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
            let data = {
              id: row.uuid,
            }
            delItemLong(data).then(response => {
              if(response.status === 200){
                    this.$notify({
                      title: '成功',
                      message: '删除成功',
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
    handleDownload() {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['id', 'room', 'type', 'telephone/idnumber','week','start','end']
        const filterVal = ['list', 'room', 'type', 'id','week','start','end']
        const data = this.formatJson(filterVal, this.list)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: 'item-long-list'
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