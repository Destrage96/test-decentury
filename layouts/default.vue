<template>
  <div class="layout">
    <TheGeneralNotice/>
    <Layout>
      <Header :style="{ width: '100%'}"/>
      <div class="layout-content" :style="{margin: '20px', background: '#fff'}">
        <nuxt/>
      </div>
      <Footer class="layout-footer-center">2020 - {{year}}</Footer>
    </Layout>
  </div>
</template>
<script>
  import TheGeneralNotice from '~/components/TheGeneralNotice';

  export default {
    components: {TheGeneralNotice},
    computed: {
      year() {
        return new Date().getFullYear();
      }
    },
  }
</script>
<style lang="less">
  @import '~assets/css/main';

  .layout {
    height: 100%;
    border: 1px solid #d7dde4;
    background: #f5f7f9;
    position: relative;
    border-radius: 4px;
    overflow: hidden;

    .layout-content {
      height: 100%;
      padding: 20px;
    }

    .layout-footer-center {
      text-align: center;
    }
  }
</style>

