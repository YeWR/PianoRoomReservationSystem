<template>
  <div class="components-container board">
    <CardSlot v-loading="listLoading" :key="1" :list="itemList" :options="options" class="kanban todo"/>
    <Card v-loading="listLoading" :key="2" :temp="temp" :options="options" class="kanban todo"/>
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
        itemList: [],
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
        listLoading: true,
      }
    },
    created() {
      this.getList();
    },
    methods: {
      getList() {
        this.listLoading = true
        this.list = []
        this.listLoading = false
        getItemScan().then(response => {
          this.list = response.data.list
          // Just to simulate the time of the request
          setTimeout(() => {
            this.listLoading = false
          }, 0.5 * 1000)
        })
      },
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

