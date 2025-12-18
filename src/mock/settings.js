import Mock from 'mockjs'

// 模拟设置数据
const mockSettings = {
  basic: {
    systemName: '管理系统',
    systemDescription: '这是一个后台管理系统',
    contact: 'admin@example.com',
    enableLogging: true,
    logLevel: 'info'
  },
  security: {
    enableCaptcha: true,
    passwordExpireDays: 90,
    loginFailLock: true,
    loginFailTimes: 5
  },
  email: {
    smtpServer: 'smtp.example.com',
    smtpPort: 587,
    senderEmail: 'noreply@example.com',
    senderName: '管理系统',
    enableSSL: true
  }
}

// 获取设置
Mock.mock(/\/settings/, 'get', () => {
  return {
    code: 200,
    msg: '请求成功',
    data: mockSettings
  }
})

// 保存设置
Mock.mock(/\/settings/, 'post', (config) => {
  const body = JSON.parse(config.body)
  
  // 更新模拟数据
  if (body.basic) {
    mockSettings.basic = { ...mockSettings.basic, ...body.basic }
  }
  if (body.security) {
    mockSettings.security = { ...mockSettings.security, ...body.security }
  }
  if (body.email) {
    mockSettings.email = { ...mockSettings.email, ...body.email }
  }
  
  return {
    code: 200,
    msg: '设置保存成功',
    data: mockSettings
  }
})

// 重置设置
Mock.mock(/\/settings/, 'delete', () => {
  // 恢复默认设置
  mockSettings.basic = {
    systemName: '管理系统',
    systemDescription: '这是一个后台管理系统',
    contact: 'admin@example.com',
    enableLogging: true,
    logLevel: 'info'
  }
  mockSettings.security = {
    enableCaptcha: true,
    passwordExpireDays: 90,
    loginFailLock: true,
    loginFailTimes: 5
  }
  mockSettings.email = {
    smtpServer: 'smtp.example.com',
    smtpPort: 587,
    senderEmail: 'noreply@example.com',
    senderName: '管理系统',
    enableSSL: true
  }
  
  return {
    code: 200,
    msg: '设置重置成功',
    data: mockSettings
  }
})
