<template>
  <div id="error-404">
    <el-result
      icon="error"
      title="404"
      sub-title="抱歉，您访问的页面不存在"
    >
      <template slot="extra">
        <el-button type="primary" @click="goToHome">返回首页</el-button>
      </template>
    </el-result>
    <div class="error-image">
      <img src="@/assets/Error404/404.png" alt="404 Not Found" />
    </div>
  </div>
</template>

<script>
export default {
  name: 'Error404',
  methods: {
    goToHome() {
      this.$router.push('/')
    }
  }
}
</script>

<style scoped>
#error-404 {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
  position: relative;
  overflow: hidden;
}

/* 添加装饰性背景元素 */
#error-404::before {
  content: '';
  position: absolute;
  width: 400px;
  height: 400px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 50%;
  top: -100px;
  right: -100px;
  animation: float 6s ease-in-out infinite;
}

#error-404::after {
  content: '';
  position: absolute;
  width: 300px;
  height: 300px;
  background: rgba(255, 255, 255, 0.08);
  border-radius: 50%;
  bottom: -100px;
  left: -100px;
  animation: float 8s ease-in-out infinite reverse;
}

/* el-result 组件样式定制 */
:deep(.el-result) {
  background: rgba(255, 255, 255, 0.95);
  padding: 60px 40px;
  border-radius: 16px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
  z-index: 1;
  backdrop-filter: blur(10px);
  text-align: center;
  width: 100%;
  max-width: 500px;
  transition: transform 0.3s ease;
}

:deep(.el-result:hover) {
  transform: translateY(-5px);
  box-shadow: 0 25px 70px rgba(0, 0, 0, 0.2);
}

:deep(.el-result__icon) {
  font-size: 80px;
  margin-bottom: 20px;
  color: #f56c6c;
}

:deep(.el-result__title) {
  font-size: 48px;
  font-weight: bold;
  color: #303133;
  margin-bottom: 12px;
  font-family: 'Arial', sans-serif;
}

:deep(.el-result__subtitle) {
  font-size: 16px;
  color: #606266;
  margin-bottom: 30px;
  line-height: 1.6;
}

:deep(.el-result__extra) {
  margin-top: 0;
}

:deep(.el-button--primary) {
  padding: 12px 30px;
  font-size: 16px;
  border-radius: 8px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  transition: all 0.3s ease;
}

:deep(.el-button--primary:hover) {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(102, 126, 234, 0.4);
  background: linear-gradient(135deg, #764ba2 0%, #667eea 100%);
}

.error-image {
  margin-top: 40px;
  z-index: 1;
}

.error-image img {
  max-width: 100%;
  height: auto;
  max-height: 200px;
  filter: drop-shadow(0 10px 30px rgba(0, 0, 0, 0.1));
  animation: bounce 3s ease-in-out infinite;
}

/* 动画效果 */
@keyframes float {
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-20px);
  }
}

@keyframes bounce {
  0%, 20%, 50%, 80%, 100% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(-15px);
  }
  60% {
    transform: translateY(-10px);
  }
}

/* 响应式设计 */
@media (max-width: 768px) {
  :deep(.el-result) {
    padding: 40px 20px;
    margin: 20px;
  }

  :deep(.el-result__icon) {
    font-size: 60px;
  }

  :deep(.el-result__title) {
    font-size: 36px;
  }

  .error-image {
    margin-top: 20px;
  }

  .error-image img {
    max-height: 150px;
  }
}

@media (max-width: 480px) {
  :deep(.el-result) {
    padding: 30px 15px;
  }

  :deep(.el-result__icon) {
    font-size: 50px;
  }

  :deep(.el-result__title) {
    font-size: 28px;
  }

  :deep(.el-result__subtitle) {
    font-size: 14px;
  }

  :deep(.el-button--primary) {
    padding: 10px 20px;
    font-size: 14px;
  }
}
</style>
