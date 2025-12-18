import { logsApi } from '@/api/logs'

const state = {
  logs: [],
  total: 0,
  currentPage: 1,
  pageSize: 10,
  filters: {
    keyword: '',
    level: '',
    startTime: '',
    endTime: ''
  },
  logDetail: null
}

const mutations = {
  setLogs(state, { logs, total }) {
    state.logs = logs
    state.total = total
  },
  setCurrentPage(state, page) {
    state.currentPage = page
  },
  setPageSize(state, size) {
    state.pageSize = size
  },
  setFilters(state, filters) {
    state.filters = { ...state.filters, ...filters }
  },
  resetFilters(state) {
    state.filters = {
      keyword: '',
      level: '',
      startTime: '',
      endTime: ''
    }
  },
  setLogDetail(state, logDetail) {
    state.logDetail = logDetail
  }
}

const actions = {
  async getLogs(context, params = {}) {
    try {
      const mergedParams = {
        page: context.state.currentPage,
        pageSize: context.state.pageSize,
        ...context.state.filters,
        ...params
      }
      
      const result = await logsApi.getLogs(mergedParams)
      if (result.code === 200) {
        context.commit('setLogs', {
          logs: result.data.items || [],
          total: result.data.total || 0
        })
      }
    } catch (error) {
      console.error('获取日志列表失败:', error)
      throw error
    }
  },
  
  async getLogDetail(context, logId) {
    try {
      const result = await logsApi.getLogDetail(logId)
      if (result.code === 200) {
        context.commit('setLogDetail', result.data)
        return result.data
      }
    } catch (error) {
      console.error('获取日志详情失败:', error)
      throw error
    }
  },
  
  async clearLogs(context) {
    try {
      const result = await logsApi.clearLogs()
      if (result.code === 200) {
        // 清空日志列表
        context.commit('setLogs', { logs: [], total: 0 })
        return true
      }
      return false
    } catch (error) {
      console.error('清除日志失败:', error)
      throw error
    }
  },
  
  async exportLogs(context, params = {}) {
    try {
      const mergedParams = {
        ...context.state.filters,
        ...params
      }
      
      const blob = await logsApi.exportLogs(mergedParams)
      // 创建下载链接
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `系统日志_${new Date().toISOString().slice(0, 10)}.xlsx`
      document.body.appendChild(a)
      a.click()
      
      // 清理
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
      
      return true
    } catch (error) {
      console.error('导出日志失败:', error)
      throw error
    }
  },
  
  setCurrentPage(context, page) {
    context.commit('setCurrentPage', page)
    context.dispatch('getLogs')
  },
  
  setPageSize(context, size) {
    context.commit('setPageSize', size)
    context.dispatch('getLogs')
  },
  
  setFilters(context, filters) {
    context.commit('setFilters', filters)
    context.commit('setCurrentPage', 1) // 重置到第一页
    context.dispatch('getLogs')
  },
  
  resetFilters(context) {
    context.commit('resetFilters')
    context.commit('setCurrentPage', 1) // 重置到第一页
    context.dispatch('getLogs')
  }
}

const getters = {
  logs: state => state.logs,
  total: state => state.total,
  currentPage: state => state.currentPage,
  pageSize: state => state.pageSize,
  filters: state => state.filters,
  logDetail: state => state.logDetail
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}