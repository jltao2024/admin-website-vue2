import Mock from 'mockjs'

// 模拟日志列表数据
const mockLogs = Mock.mock({
  'logs|50-100': [
    {
      'id|+1': 1,
      'username': '@cname()',
      'action': '@sentence(5, 10)',
      'module': '@pick(["用户管理", "文章管理", "分类管理", "标签管理", "角色管理", "系统设置"])',
      'level': '@pick(["debug", "info", "warn", "error"])',
      'ip': '@ip()',
      'userAgent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.212 Safari/537.36',
      'url': '@url()',
      'params': '@json("params")',
      'result': '@json("result")',
      'createTime': '@datetime("yyyy-MM-dd HH:mm:ss")'
    }
  ]
})

// 日志列表 - 支持分页、筛选
Mock.mock(/\/logs/, 'get', (config) => {
  const { keyword, level, startTime, endTime, page = 1, pageSize = 10 } = config.params || {}
  
  let filteredLogs = [...mockLogs.logs]
  
  // 按关键字筛选
  if (keyword) {
    filteredLogs = filteredLogs.filter(log => 
      log.username.includes(keyword) || 
      log.action.includes(keyword)
    )
  }
  
  // 按日志级别筛选
  if (level) {
    filteredLogs = filteredLogs.filter(log => log.level === level)
  }
  
  // 按时间范围筛选
  if (startTime && endTime) {
    const start = new Date(startTime)
    const end = new Date(endTime)
    filteredLogs = filteredLogs.filter(log => {
      const logTime = new Date(log.createTime)
      return logTime >= start && logTime <= end
    })
  }
  
  // 分页处理
  const total = filteredLogs.length
  const startIndex = (page - 1) * pageSize
  const endIndex = startIndex + parseInt(pageSize)
  const pageData = filteredLogs.slice(startIndex, endIndex)
  
  return {
    code: 200,
    msg: '请求成功',
    data: {
      list: pageData,
      total,
      page: parseInt(page),
      pageSize: parseInt(pageSize)
    }
  }
})

// 日志详情
Mock.mock(/\/logs\/\d+/, 'get', (config) => {
  const id = parseInt(config.url.split('/').pop())
  const log = mockLogs.logs.find(log => log.id === id)
  
  if (log) {
    return {
      code: 200,
      msg: '请求成功',
      data: log
    }
  }
  
  return {
    code: 404,
    msg: '日志不存在'
  }
})

// 清除日志
Mock.mock(/\/logs/, 'delete', () => {
  mockLogs.logs = []
  return {
    code: 200,
    msg: '日志清除成功',
    data: []
  }
})

// 导出日志
Mock.mock(/\/logs\/export/, 'get', () => {
  // 实际项目中这里应该返回一个文件流，这里简单模拟
  return {
    code: 200,
    msg: '日志导出成功',
    data: {
      fileName: `logs_${new Date().toISOString().slice(0, 10)}.xlsx`,
      fileUrl: 'https://example.com/logs_export.xlsx'
    }
  }
})