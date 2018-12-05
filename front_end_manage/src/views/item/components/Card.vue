<template>
  <div class="board-column">
    <div class="board-column-header">
      {{ headerText }}
    </div>
    <div class="board-column-content">
      <el-form ref="dataForm" :model="temp" label-position="left" label-width="200px"
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
    </div>
  </div>
</template>

<script>
  export default {
    name: "Card",
    props: {
      headerText: {
        type: String,
        default: ''
      },
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
    },
    methods: {
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

<style lang="scss">
  .board-column {
    min-width: 600px;
    min-height: 200px;
    height: auto;
    overflow: hidden;
    background: #f0f0f0;
    border-radius: 3px;

    .board-column-header {
      height: 50px;
      line-height: 50px;
      overflow: hidden;
      padding: 0 20px;
      text-align: center;
      background: #333;
      color: #fff;
      border-radius: 3px 3px 0 0;
    }

    .board-column-content {
      height: auto;
      overflow: hidden;
      border: 10px solid transparent;
      min-height: 60px;
      display: flex;
      justify-content: flex-start;
      flex-direction: column;
      align-items: center;

      .board-item {
        cursor: pointer;
        width: 100%;
        height: 64px;
        margin: 5px 0;
        background-color: #fff;
        text-align: left;
        line-height: 54px;
        padding: 5px 10px;
        box-sizing: border-box;
        box-shadow: 0px 1px 3px 0 rgba(0, 0, 0, 0.2);
      }
    }
  }
</style>
