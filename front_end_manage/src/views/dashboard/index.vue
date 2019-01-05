<template>
  <div class="app-container">
    <el-card class="box-card">
      <div slot="header">
        <a class="link-type link-title" target="_blank">
          {{ $t('说明') }}
        </a>
      </div>
      <div class="box-item">
        <code style="margin-top:15px;">{{tips }}</code>
      </div>
    </el-card>
  </div>
</template>

<script>
import { toggleClass } from "@/utils";
import "@/assets/custom-theme/index.css"; // the theme changed version element-ui css

export default {
  name: "Theme",
  data() {
    return {
      tips:
        "管理端分为：订单管理、用户管理、公告管理、琴房管理以及检票五部分，您可以通过右侧导航栏进入对应页面进行操作。",
      theme: false,
      tags: [
        { name: "Tag One", type: "" },
        { name: "Tag Two", type: "info" },
        { name: "Tag Three", type: "success" },
        { name: "Tag Four", type: "warning" },
        { name: "Tag Five", type: "danger" }
      ],
      slideValue: 50,
      radio: 3
    };
  },
  watch: {
    theme() {
      toggleClass(document.body, "custom-theme");
    }
  }
};
</script>

<style scoped>
.field-label {
  vertical-align: middle;
}
.box-card {
  width: 400px;
  max-width: 100%;
  margin: 20px auto;
}

.block {
  padding: 30px 24px;
}

.tag-item {
  margin-right: 15px;
}
</style>
