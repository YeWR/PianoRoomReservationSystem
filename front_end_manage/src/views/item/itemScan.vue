<template>
  <div class="components-container board">
    <div v-loading="listLoading" class="kanban todo">
      <div class="board-column">
        <div class="board-column-header">
          {{$t('route.itemScan')}}
        </div>
        <div
          :list="list"
          class="board-column-content">
          <div v-for="item in list" :key="item.id" class="board-item" v-on:click="setTemp(item)">
            {{$t('item.idNumber')}}: {{ item.idNumber }} | {{$t('item.time')}}: {{ item.time }} |
            {{$t('item.room')}}: {{
            item.room }}
          </div>
        </div>
      </div>
    </div>
    <Card v-loading="tempLoading" :key="2" :temp="temp" :headerText="itemDetail" :options="options"
          class="kanban todo"/>
  </div>
</template>
<script>
  import CardSlot from './components/CardSlot'
  import Card from './components/Card'
  import {getItemScan} from '@/api/item'

  export default {
    name: 'ItemScan',
    components: {
      CardSlot,
      Card
    },
    data() {
      return {
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
          console.log('gg', this.list)
          // Just to simulate the time of the request
          setTimeout(() => {
            this.listLoading = false
            this.tempLoading = false
          }, 0.5 * 1000)
        })
      },
      setTemp(item){
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
</style>

