<template>
  <el-card class="box-card-component" style="margin-left:8px;">
    <div slot="header" class="box-card-header">
      <img src="https://wpimg.wallstcn.com/e7d23d71-cf19-4b90-a1cc-f56af8c0903d.png">
    </div>
    <div style="position:relative;" :model="temp">
      <pan-thumb :image="img" class="panThumb"/>
      <mallki class-name="mallki-text" :text="$t('route.itemDetail')" />
      <div style="padding-top:35px;" class="progress-item">
        <span><el-tag>{{$t('item.itemId')}}:</el-tag> </span>
        <span>{{ temp.itemId }}</span>
      </div>
      <div style="padding-top:35px;" class="progress-item">
        <span><el-tag>{{$t('item.idNumber')}}:</el-tag> </span>
        <span>{{ temp.idNumber }}</span>
      </div>
      <div style="padding-top:35px;" class="progress-item">
        <span><el-tag>{{$t('item.userType')}}:</el-tag> </span>
        <span>{{ toItemType(temp.userType) }}</span>
      </div>
      <div style="padding-top:35px;" class="progress-item">
        <span><el-tag>{{$t('item.time')}}:</el-tag> </span>
        <span>{{ temp.time }}</span>
      </div>
      <div style="padding-top:35px;" class="progress-item">
        <span><el-tag>{{$t('item.room')}}:</el-tag> </span>
        <span>{{ temp.room }}</span>
      </div>
      <div style="padding-top:35px;" class="progress-item">
        <span><el-tag>{{$t('item.pianoType')}}:</el-tag> </span>
        <span>{{ temp.pianoType }}</span>
      </div>
      <div style="padding-top:35px;" class="progress-item">
        <span><el-tag>{{$t('item.itemType')}}:</el-tag> </span>
        <span>{{ toItemType(temp.itemType) }}</span>
      </div>
      <div style="padding-top:35px;" class="progress-item">
        <span><el-tag>{{$t('item.status')}}:</el-tag> </span>
        <span>{{ toItemStatus(temp.status) }}</span>
      </div>
      <div style="padding-top:35px;" class="progress-item">
        <span><el-tag>{{$t('item.price')}}:</el-tag> </span>
        <span>￥{{ temp.price }}</span>
      </div>
    </div>
  </el-card>
</template>

<script>
  import { mapGetters } from 'vuex'
  import PanThumb from '@/components/PanThumb'
  import Mallki from '@/components/TextHoverEffect/Mallki'

  export default {
    components: {
      PanThumb,
      Mallki
    },

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
    },
    computed: {
      ...mapGetters([
        'name',
        'avatar',
        'roles'
      ])
    },
    data(){
      return{
        img: 'https://wpimg.wallstcn.com/e7d23d71-cf19-4b90-a1cc-f56af8c0903d.png'
      }
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss">
  .box-card-component {

    .el-card__header {
      padding: 0px !important;
    }
  }
</style>
<style rel="stylesheet/scss" lang="scss" scoped>
  .box-card-component {
    width: 400px;
    .box-card-header {
      position: relative;
      height: 220px;
      img {
        width: 100%;
        height: 100%;
        transition: all 0.2s linear;
        &:hover {
          transform: scale(1.1, 1.1);
          filter: contrast(130%);
        }
      }
    }
    .mallki-text {
      position: absolute;
      top: 0px;
      right: 0px;
      font-size: 20px;
      font-weight: bold;
    }
    .panThumb {
      z-index: 100;
      height: 70px !important;
      width: 70px !important;
      position: absolute !important;
      top: -45px;
      left: 0px;
      border: 5px solid #ffffff;
      background-color: #fff;
      margin: auto;
      box-shadow: none !important;
      /deep/ .pan-info {
        box-shadow: none !important;
      }
    }
    .progress-item {
      margin-bottom: 10px;
      font-size: 14px;
    }
    @media only screen and (max-width: 1510px) {
      .mallki-text {
        display: none;
      }
    }
  }
</style>
