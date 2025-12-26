<template>
  <div class="sidebar-container">
    <el-menu
      :default-active="activeMenu"
      class="sidebar-menu"
      router
      unique-opened
      text-color="#909399"
    >
      <el-menu-item index="/">
        <i class="el-icon-s-home"></i>
        <span slot="title">仪表盘</span>
      </el-menu-item>
      <el-menu-item index="/users">
        <i class="el-icon-user-solid"></i>
        <span slot="title">用户管理</span>
      </el-menu-item>
      <el-menu-item index="/settings">
        <i class="el-icon-setting"></i>
        <span slot="title">系统设置</span>
      </el-menu-item>
      <el-menu-item index="/roles" v-if="hasPermission('role:manage')">
        <i class="el-icon-s-custom"></i>
        <span slot="title">角色管理</span>
      </el-menu-item>
      <el-menu-item index="/logs" v-if="hasPermission('log:manage')">
        <i class="el-icon-document-remove"></i>
        <span slot="title">日志管理</span>
      </el-menu-item>
      <el-menu-item index="/markdown">
        <i class="el-icon-edit"></i>
        <span slot="title">Markdown</span>
      </el-menu-item>
      <el-menu-item index="/flow-chart">
        <i class="el-icon-data-line"></i>
        <span slot="title">流程图绘制</span>
      </el-menu-item>
      <!-- 内容管理系统菜单项 -->
      <el-submenu class="submenu" v-if="hasPermission('article:manage') || hasPermission('category:manage') || hasPermission('tag:manage')">
        <template slot="title">
          <i class="el-icon-document"></i>
          <span class="submenu-title">内容管理</span>
        </template>
        <el-menu-item index="/articles" v-if="hasPermission('article:manage')">
          <i class="el-icon-document-copy"></i>
          <span slot="title">文章管理</span>
        </el-menu-item>
        <el-menu-item index="/categories" v-if="hasPermission('category:manage')">
          <i class="el-icon-folder-opened"></i>
          <span slot="title">分类管理</span>
        </el-menu-item>
        <el-menu-item index="/tags" v-if="hasPermission('tag:manage')">
          <i class="el-icon-collection-tag"></i>
          <span slot="title">标签管理</span>
        </el-menu-item>
      </el-submenu>
    </el-menu>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'Sidebar',
  computed: {
    activeMenu() {
      const path = this.$route.path || '/'      
      return path
    },
    ...mapGetters('auth', [
      'hasPermission'
    ])
  }
}
</script>

<style scoped>
.sidebar-container {
  width: 220px;
  height: 100%;
  background-color: #2c3e50;
  overflow-y: auto;
  box-shadow: 2px 0 8px rgba(0, 0, 0, 0.1);
}

.sidebar-menu {
  height: 100%;
  background-color: transparent;
  border-right: none;
}

/* 统一主菜单项和子菜单标题的样式 */
.sidebar-menu .el-menu-item,
.sidebar-menu ::v-deep .el-submenu__title {
  height: 55px;
  line-height: 55px;
  transition: all 0.3s ease;
  font-size: 17px;
  padding-left: 20px !important;
  color: #909399;
}

.sidebar-menu .el-menu-item span {
  font-size: 17px;
}

/* 统一主菜单项和子菜单标题的hover效果 */
.sidebar-menu .el-menu-item:hover,
/* 使用深度选择器 */
.sidebar-menu ::v-deep .el-submenu__title:hover {
  background-color: #34495e;
  color: #ffba58 !important;
}

/* 统一主菜单项和子菜单标题的激活状态样式 */
.sidebar-menu .el-menu-item.is-active,
.sidebar-menu .el-submenu.is-active > .el-submenu__title,
.sidebar-menu .el-submenu__title.is-active {
  background-color: #34495e;
  border-right: 4px solid #ffba58;
  color: #ffba58 !important;
  font-weight: 500;
}

/* 统一图标样式 */
.sidebar-menu .el-menu-item i,
.sidebar-menu .el-submenu__title i {
  margin-right: 15px;
  font-size: 22px;
  width: 22px;
  text-align: center;
  color: inherit;
}
.sidebar-menu ::v-deep .el-submenu__title:hover .el-submenu__icon-arrow {
  color: #ffba58 !important;
}

/* 子菜单容器样式 */
.sidebar-menu .el-submenu .el-menu {
  background-color: #2c3e50 !important;
}
.sidebar-menu .el-submenu .el-menu-item:hover {
  background-color: #34495e !important;
  color: #ffba58 !important;
}

/* 子菜单项样式 */
.sidebar-menu .el-submenu .el-menu-item {
  padding-left: 45px !important;
  font-size: 16px;
  background-color: #2c3e50 !important;
}

/* 确保子菜单项的激活状态与主菜单一致 */
.sidebar-menu .el-submenu .el-menu-item.is-active {
  background-color: #34495e;
  border-right: 4px solid #ffba58;
  color: #ffba58 !important;
  font-weight: 500;
}
</style>