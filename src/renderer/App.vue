<template>
  <div class="app-wrap">
    <div class="main-wrap">{{title}}</div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      title: "首页",
    };
  },
};
</script>
<style lang="scss">
  .app-wrap {
      .main-wrap {
          color: red;
      }
  }
</style>