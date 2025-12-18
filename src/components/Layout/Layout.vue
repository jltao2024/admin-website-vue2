<template>
  <div class="layout-container">
    <!-- 顶部导航栏 -->
    <Header />
    <div class="layout-body">
      <!-- 左侧侧边栏 -->
      <Sidebar />
      <!-- 主要内容区域 -->
      <Main>
        <router-view />
      </Main>
    </div>
  </div>
</template>

<script>
import Header from './Header.vue'
import Sidebar from './Sidebar.vue'
import Main from './Main.vue'

export default {
  name: 'Layout',
  components: {
    Header,
    Sidebar,
    Main
  }
}
</script>

<style scoped>
.layout-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 100%;
  overflow: hidden;
}

.layout-body {
  display: flex;
  flex: 1;
  overflow: hidden;
}
</style>