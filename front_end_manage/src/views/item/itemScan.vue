<template>
  <div>
    <div v-if='flag'>
      <div>
        <el-row :gutter="40" v-loading="listLoading" class="panel-group" :list="list">
          <div v-for="item in list" :key="item.id" class="board-item" v-on:click="setTemp(item)">
            <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
              <div class="card-panel">
                <div class="card-panel-icon-wrapper icon-people">
                  <svg-icon icon-class="peoples" class-name="card-panel-icon"/>
                </div>
                <div class="card-panel-description">
                  <div class="card-panel-text">{{$t('item.time')}}: {{ item.time }}</div>
                  <div class="card-panel-num">{{$t('item.room')}}: {{ item.room }}</div>
                </div>
              </div>
            </el-col>
          </div>
        </el-row>
      </div>
      <div style="top: 30px; left: 30px">
        <el-col :xs="{span: 24}" :sm="{span: 12}" :md="{span: 12}" :lg="{span: 6}" :xl="{span: 6}"
                style="margin-bottom:30px; ">
          <BoxCard v-loading="tempLoading" :key="2" :temp="temp" :headerText="itemDetail" :options="options"
                   class="kanban todo"/>
        </el-col>
      </div>
    </div>
    <div v-if='1-flag' class="app-container" style="left: 30%">
      <el-card class="box-card" style="width: 400px; height: 200px">
        <div slot="header">
          <a class="link-type link-title" target="_blank">
            {{ $t('今日订单提示') }}
          </a>
        </div>
        <div class="box-item">
          <code style="margin-top:5px; height:100px">{{ $t('截至现在，琴房并无今日订单！！') }}</code>
        </div>
      </el-card>
    </div>
  </div>
</template>
<script>
  import BoxCard from './components/BoxCard'
  import {getItemScan} from '@/api/item'
  export default {
    name: 'ItemScan',
    components: {
      BoxCard,
    },
    data() {
      return {
        flag : 1,
        options: {
          group: 'mission'
        },
        list: [],
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
        itemDetail: '',
        listLoading: true,
        tempLoading: true
      }
    },
    created() {
      this.getList();
    },
    methods: {
      getList() {
        this.itemDetail = this.$t('route.itemDetail')
        this.listLoading = true
        getItemScan().then(response => {
          this.list = response.data.list
          if (this.list.length > 0) {
            this.temp = this.list[0]
          }
          else{
            this.flag = 0
          }
          console.log('gg', this.list)
          setTimeout(() => {
            this.listLoading = false
            this.tempLoading = false
          }, 0.5 * 1000)
        })
      },
      setTemp(item) {
        this.temp = item
        this.tempLoading = true
        setTimeout(() => {
          this.tempLoading = false
        }, 0.5 * 1000)
      }
    }
  }
</script>
<style lang="scss">
  .board {
    width: 1600px;
    margin-left: 20px;
    display: flex;
    justify-content: space-around;
    flex-direction: row;
    align-items: flex-start;
  }
  .kanban {
    &.todo {
      .board-column-header {
        background: #4A9FF9;
      }
    }
    &.working {
      .board-column-header {
        background: #f9944a;
      }
    }
    &.done {
      .board-column-header {
        background: #2ac06d;
      }
    }
  }
  .panel-group {
    margin-top: 18px;
    .card-panel-col {
      margin-bottom: 32px;
    }
    .card-panel {
      height: 108px;
      cursor: pointer;
      font-size: 12px;
      position: relative;
      overflow: hidden;
      color: #666;
      background: #fff;
      box-shadow: 4px 4px 40px rgba(0, 0, 0, .05);
      border-color: rgba(0, 0, 0, .05);
      &:hover {
        .card-panel-icon-wrapper {
          color: #fff;
        }
        .icon-people {
          background: #40c9c6;
        }
        .icon-message {
          background: #36a3f7;
        }
        .icon-money {
          background: #f4516c;
        }
        .icon-shopping {
          background: #34bfa3
        }
      }
      .icon-people {
        color: #40c9c6;
      }
      .icon-message {
        color: #36a3f7;
      }
      .icon-money {
        color: #f4516c;
      }
      .icon-shopping {
        color: #34bfa3
      }
      .card-panel-icon-wrapper {
        float: left;
        margin: 14px 0 0 14px;
        padding: 16px;
        transition: all 0.38s ease-out;
        border-radius: 6px;
      }
      .card-panel-icon {
        float: left;
        font-size: 48px;
      }
      .card-panel-description {
        float: right;
        font-weight: bold;
        margin: 26px;
        margin-left: 0px;
        .card-panel-text {
          line-height: 18px;
          color: rgba(0, 0, 0, 0.45);
          font-size: 16px;
          margin-bottom: 12px;
        }
        .card-panel-num {
          font-size: 20px;
        }
      }
    }
  }
</style>
