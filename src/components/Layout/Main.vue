<template>
  <div class="main-container">
    <div class="main-header">
      <div class="breadcrumb">
        <el-breadcrumb separator="/">
          <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>{{ currentPageName }}</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
    </div>
    <div class="main-content">
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Main',
  computed: {
    currentPageName() {
      const route = this.$route
      return route.name || ''
    }
  }
}
</script>

<style scoped>
.main-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background-color: #f5f7fa;
}

.main-header {
  padding: 15px 20px;
  background-color: #fff;
  border-bottom: 1px solid #e4e7ed;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.breadcrumb {
  font-size: 14px;
}

.main-content {
  flex: 1;
  padding: 20px;
  overflow-y: auto;
}
</style>