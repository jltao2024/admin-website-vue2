<template>
  <div class="logs-container">
    <el-card class="logs-card">
      <div class="card-header">
        <h2>日志管理</h2>
        <div class="header-actions">
          <el-button type="primary" @click="handleExportLogs">
            <i class="el-icon-download"></i> 导出日志
          </el-button>
          <el-button type="danger" @click="handleClearLogs">
            <i class="el-icon-delete"></i> 清除日志
          </el-button>
        </div>
      </div>
      <div class="card-body">
        <!-- 搜索和筛选 -->
        <div class="search-filters">
          <el-form :inline="true" :model="filters" label-width="80px">
            <el-form-item label="关键字">
              <el-input v-model="filters.keyword" placeholder="请输入用户名或操作" clearable @change="handleFilter"></el-input>
            </el-form-item>
            <el-form-item label="日志级别">
              <el-select v-model="filters.level" placeholder="请选择日志级别" clearable @change="handleFilter">
                <el-option label="调试" value="debug"></el-option>
                <el-option label="信息" value="info"></el-option>
                <el-option label="警告" value="warn"></el-option>
                <el-option label="错误" value="error"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="时间范围">
              <el-date-picker
                v-model="dateRange"
                type="datetimerange"
                range-separator="至"
                start-placeholder="开始时间"
                end-placeholder="结束时间"
                @change="handleDateRangeChange"
              ></el-date-picker>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="handleFilter">查询</el-button>
              <el-button @click="handleReset">重置</el-button>
            </el-form-item>
          </el-form>
        </div>

        <!-- 日志列表 -->
        <div class="logs-table">
          <el-table :data="logs" style="width: 100%" border @row-click="handleRowClick">
            <el-table-column prop="id" label="ID" width="80" align="center"></el-table-column>
            <el-table-column prop="username" label="操作用户" width="120"></el-table-column>
            <el-table-column prop="action" label="操作内容" width="200"></el-table-column>
            <el-table-column prop="module" label="操作模块" width="120"></el-table-column>
            <el-table-column prop="level" label="日志级别" width="100" align="center">
              <template slot-scope="scope">
                <el-tag :type="getLevelType(scope.row.level)">
                  {{ scope.row.level }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="ip" label="IP地址" width="150"></el-table-column>
            <el-table-column prop="createTime" label="操作时间" width="180" align="center"></el-table-column>
          </el-table>
        </div>

        <!-- 分页 -->
        <div class="pagination">
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="currentPage"
            :page-sizes="[10, 20, 50, 100]"
            :page-size="pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total"
          ></el-pagination>
        </div>
      </div>
    </el-card>

    <!-- 日志详情对话框 -->
    <el-dialog :title="'日志详情 - ID: ' + logDetail?.id" :visible.sync="logDetailVisible" width="800px">
      <div v-if="logDetail" class="log-detail">
        <el-descriptions border :column="1" size="small">
          <el-descriptions-item label="操作用户">{{ logDetail.username }}</el-descriptions-item>
          <el-descriptions-item label="操作内容">{{ logDetail.action }}</el-descriptions-item>
          <el-descriptions-item label="操作模块">{{ logDetail.module }}</el-descriptions-item>
          <el-descriptions-item label="日志级别">
            <el-tag :type="getLevelType(logDetail.level)">{{ logDetail.level }}</el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="IP地址">{{ logDetail.ip }}</el-descriptions-item>
          <el-descriptions-item label="浏览器信息">{{ logDetail.userAgent }}</el-descriptions-item>
          <el-descriptions-item label="请求URL">{{ logDetail.url }}</el-descriptions-item>
          <el-descriptions-item label="请求参数">{{ logDetail.params || '无' }}</el-descriptions-item>
          <el-descriptions-item label="响应结果">{{ logDetail.result || '无' }}</el-descriptions-item>
          <el-descriptions-item label="操作时间">{{ logDetail.createTime }}</el-descriptions-item>
        </el-descriptions>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="logDetailVisible = false">关闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'

export default {
  name: 'Logs',
  computed: {
    ...mapState('logs', ['logs', 'total', 'currentPage', 'pageSize', 'filters', 'logDetail']),
    dateRange: {
      get() {
        return [
          this.filters.startTime ? new Date(this.filters.startTime) : '',
          this.filters.endTime ? new Date(this.filters.endTime) : ''
        ]
      },
      set() {
        // 这个会由handleDateRangeChange处理
      }
    }
  },
  data() {
    return {
      logDetailVisible: false
    }
  },
  mounted() {
    // 加载日志数据
    this.getLogs()
  },
  methods: {
    ...mapActions('logs', ['getLogs', 'getLogDetail', 'clearLogs', 'exportLogs', 'setCurrentPage', 'setPageSize', 'setFilters', 'resetFilters']),
    
    handleCurrentChange(page) {
      this.setCurrentPage(page)
    },
    
    handleSizeChange(size) {
      this.setPageSize(size)
    },
    
    handleFilter() {
      this.setFilters(this.filters)
    },
    
    handleReset() {
      this.resetFilters()
      this.dateRange = ['', '']
    },
    
    handleDateRangeChange(range) {
      if (range && range.length === 2) {
        this.filters.startTime = range[0] ? range[0].toISOString() : ''
        this.filters.endTime = range[1] ? range[1].toISOString() : ''
      } else {
        this.filters.startTime = ''
        this.filters.endTime = ''
      }
      this.handleFilter()
    },
    
    handleRowClick(row) {
      this.showLogDetail(row.id)
    },
    
    async showLogDetail(logId) {
      try {
        await this.getLogDetail(logId)
        this.logDetailVisible = true
      } catch (error) {
        this.$message.error('获取日志详情失败')
      }
    },
    
    async handleClearLogs() {
      this.$confirm('确定要清除所有日志吗？此操作不可恢复。', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        try {
          await this.clearLogs()
          this.$message.success('日志清除成功')
        } catch (error) {
          this.$message.error('日志清除失败')
        }
      }).catch(() => {
        // 取消操作
      })
    },
    
    async handleExportLogs() {
      try {
        await this.exportLogs()
        this.$message.success('日志导出成功')
      } catch (error) {
        this.$message.error('日志导出失败')
      }
    },
    
    getLevelType(level) {
      const levelMap = {
        debug: 'info',
        info: 'success',
        warn: 'warning',
        error: 'danger'
      }
      return levelMap[level] || 'info'
    }
  }
}
</script>

<style scoped>
.logs-container {
  width: 100%;
  height: 100%;
  padding: 20px;
  box-sizing: border-box;
}

.logs-card {
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  border: none;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.card-header h2 {
  font-size: 20px;
  font-weight: 600;
  color: #303133;
  margin: 0;
}

.header-actions {
  display: flex;
  gap: 10px;
}

.card-body {
  margin-top: 20px;
}

.search-filters {
  margin-bottom: 20px;
  padding: 15px;
  background-color: #f5f7fa;
  border-radius: 8px;
}

.logs-table {
  margin-bottom: 20px;
}

.pagination {
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
}

.log-detail {
  max-height: 500px;
  overflow-y: auto;
}
</style>