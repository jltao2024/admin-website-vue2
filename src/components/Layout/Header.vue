<template>
  <div class="header-container">
    <div class="header-left">
      <div class="logo">管理系统</div>
    </div>
    <div class="header-right">
      <el-dropdown trigger="click">
        <span class="user-info">
          <el-avatar size="small" icon="el-icon-user-solid"></el-avatar>
          <span class="user-name">{{ userName || '管理员' }}</span>
          <i class="el-icon-arrow-down"></i>
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item @click.native="handleProfile">个人中心</el-dropdown-item>
          <el-dropdown-item divided @click.native="handleLogout">退出登录</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Header',
  data() {
    return {
      userAvatar: '',
      userName: '',
      defaultAvatar: ''
    }
  },
  mounted() {
    // 从store获取用户信息
    this.getUserInfo()
  },
  methods: {
    getUserInfo() {
      const user = this.$store.state.auth.user
      if (user) {
        this.userAvatar = user.avatar
        this.userName = user.name
      }
    },
    handleProfile() {
      this.$message.info('个人中心功能开发中')
    },
    handleLogout() {
      this.$confirm('确定要退出登录吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$store.dispatch('auth/logout')
        this.$router.push('/login')
      }).catch(() => {
        // 取消退出
      })
    }
  }
}
</script>

<style scoped>
.header-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 60px;
  background-color: #2c3e50;
  padding: 0 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.header-left {
  display: flex;
  align-items: center;
}

.logo {
  font-size: 20px;
  font-weight: bold;
  color: #ffba58;
}

.header-right {
  display: flex;
  align-items: center;
}

.user-info {
  display: flex;
  align-items: center;
  cursor: pointer;
  padding: 8px 12px;
}

.user-info .el-avatar {
  margin-right: 8px;
}

.user-name {
  font-size: 14px;
  color: #ffba58;
  margin-right: 4px;
}

.user-info i {
  font-size: 12px;
  color: #ffba58;
}
</style>