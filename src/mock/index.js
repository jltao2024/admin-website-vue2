import Mock from 'mockjs'

// 模拟随机延迟
Mock.setup({ timeout: '10-1000' })

// 仅在开发环境启用 Mock
if (process.env.NODE_ENV === 'development') {
  require('./user.js')
  require('./content.js')
  require('./roles.js')
  require('./logs.js')
  require('./settings.js')
}