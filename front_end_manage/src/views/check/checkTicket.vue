<template>
  <div class="mixin-components-container">
    <el-row style="width:700px">
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span>检票</span>
        </div>
        <div style="margin-bottom:50px;">
          <el-input :placeholder="$t('please input id')" v-model="query.id" style="width: 80%;" class="filter-item"/>
          <el-button class="filter-item" type="primary" @click="checkin">检票</el-button>
        </div>
      </el-card>
    </el-row>
  </div>
</template>

<script>
import { fetchList} from '@/api/checkTicket'
import PanThumb from '@/components/PanThumb'
import MdInput from '@/components/MDinput'
import Mallki from '@/components/TextHoverEffect/Mallki'
import DropdownMenu from '@/components/Share/dropdownMenu'
import waves from '@/directive/waves/index.js' // 水波纹指令
export default {
  name: 'ComponentMixinDemo',
  components: {
    PanThumb,
    MdInput,
    Mallki,
    DropdownMenu
  },
  directives: {
    waves
  },
  data() {
    const validate = (rule, value, callback) => {
      if (value.length !== 6) {
        callback(new Error('请输入六个字符'))
      } else {
        callback()
      }
    }
    return {
      res: '',
      query:{
        id:''
      },
      demo: {
        title: ''
      },
      demoRules: {
        title: [{ required: true, trigger: 'change', validator: validate }]
      },
    }
  },
  methods:{
    checkin(){
      fetchList(this.query.id).then(response => {
        console.log(response)
        if(response.status === 200){
          this.res = '检票成功，请通过'
          this.$message({
            type: 'info',
            message: '检票成功'
          });  
        }
        setTimeout(() => {
        }, 1.5 * 1000)
      }).catch(()=>{
        this.res = '检票失败'
      });
    }
  }
}
</script>

<style scoped>
.mixin-components-container {
  background-color: #f0f2f5;
  padding: 30px;
  min-height: calc(100vh - 84px);
}
.component-item{
  min-height: 100px;
}
</style>