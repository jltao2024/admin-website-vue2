import Mock from 'mockjs'

// 模拟 GET /api/users
Mock.mock('/api/users', 'get', {
  code: 200,
  msg: 'success',
  'data|5-10': [
    {
      'id|+1': 1,
      name: '@cname',
      email: '@email',
      phone: /^1[3-9]\d{9}$/,
      avatar: '@image(60x60,@color,用户)',
      createTime: '@datetime'
    }
  ]
})

// 模拟 POST /api/users（新增用户）
Mock.mock('/api/users', 'post', function(options) {
  const body = JSON.parse(options.body)
  return {
    code: 200,
    msg: 'created',
    data: {
      id: Mock.Random.integer(100, 999),
      ...body,
      createTime: new Date().toLocaleString()
    }
  }
})

// 模拟 POST /api/login（用户登录）
Mock.mock('/api/login', 'post', function(options) {
  const body = JSON.parse(options.body)
  const { username, password } = body
  
  // 简单的登录验证逻辑
  if (username === 'admin' && password === '123456') {
    return {
      code: 200,
      msg: 'success',
      data: {
        token: Mock.Random.string(32),
        user: {
          id: 1,
          username: 'admin',
          name: '管理员',
          email: 'admin@example.com'
        },
        permissions: ['user:manage', 'role:manage', 'log:manage', 'article:manage', 'category:manage', 'tag:manage', 'setting:manage'],
        roles: ['admin']
      }
    }
  } else {
    return {
      code: 401,
      msg: '用户名或密码错误'
    }
  }
})