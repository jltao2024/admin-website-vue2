import Mock from 'mockjs'

// 模拟角色列表数据
const mockRoles = Mock.mock({
  'roles|10-20': [
    {
      'id|+1': 1,
      'name': '@cname()',
      'description': '@sentence(10, 20)',
      'createTime': '@datetime("yyyy-MM-dd HH:mm:ss")',
      'permissions|5-15': [
        '@pick(["user:manage", "article:manage", "category:manage", "tag:manage", "role:manage", "log:manage", "setting:manage"])'
      ]
    }
  ]
})

// 模拟权限列表数据
const mockPermissions = [
  {
    id: 1,
    name: 'user:manage',
    label: '用户管理',
    children: [
      { id: 11, name: 'user:add', label: '添加用户' },
      { id: 12, name: 'user:edit', label: '编辑用户' },
      { id: 13, name: 'user:delete', label: '删除用户' }
    ]
  },
  {
    id: 2,
    name: 'article:manage',
    label: '文章管理',
    children: [
      { id: 21, name: 'article:add', label: '添加文章' },
      { id: 22, name: 'article:edit', label: '编辑文章' },
      { id: 23, name: 'article:delete', label: '删除文章' }
    ]
  },
  {
    id: 3,
    name: 'category:manage',
    label: '分类管理',
    children: [
      { id: 31, name: 'category:add', label: '添加分类' },
      { id: 32, name: 'category:edit', label: '编辑分类' },
      { id: 33, name: 'category:delete', label: '删除分类' }
    ]
  },
  {
    id: 4,
    name: 'tag:manage',
    label: '标签管理',
    children: [
      { id: 41, name: 'tag:add', label: '添加标签' },
      { id: 42, name: 'tag:edit', label: '编辑标签' },
      { id: 43, name: 'tag:delete', label: '删除标签' }
    ]
  },
  {
    id: 5,
    name: 'role:manage',
    label: '角色管理',
    children: [
      { id: 51, name: 'role:add', label: '添加角色' },
      { id: 52, name: 'role:edit', label: '编辑角色' },
      { id: 53, name: 'role:delete', label: '删除角色' },
      { id: 54, name: 'role:assign', label: '分配权限' }
    ]
  },
  {
    id: 6,
    name: 'log:manage',
    label: '日志管理',
    children: [
      { id: 61, name: 'log:view', label: '查看日志' },
      { id: 62, name: 'log:clear', label: '清除日志' },
      { id: 63, name: 'log:export', label: '导出日志' }
    ]
  },
  {
    id: 7,
    name: 'setting:manage',
    label: '系统设置',
    children: [
      { id: 71, name: 'setting:basic', label: '基本设置' },
      { id: 72, name: 'setting:security', label: '安全设置' },
      { id: 73, name: 'setting:email', label: '邮件设置' }
    ]
  }
]

// 角色列表
Mock.mock(/\/roles/, 'get', () => {
  return {
    code: 200,
    msg: '请求成功',
    data: mockRoles.roles
  }
})

// 权限列表
Mock.mock(/\/permissions/, 'get', () => {
  return {
    code: 200,
    msg: '请求成功',
    data: mockPermissions
  }
})

// 添加角色
Mock.mock(/\/roles/, 'post', (config) => {
  const newRole = JSON.parse(config.body)
  const id = mockRoles.roles.length + 1
  mockRoles.roles.push({
    ...newRole,
    id,
    createTime: new Date().toISOString(),
    permissions: newRole.permissions || []
  })
  return {
    code: 200,
    msg: '角色添加成功',
    data: mockRoles.roles
  }
})

// 编辑角色
Mock.mock(/\/roles\/\d+/, 'put', (config) => {
  const id = parseInt(config.url.split('/').pop())
  const updateData = JSON.parse(config.body)
  const roleIndex = mockRoles.roles.findIndex(role => role.id === id)
  
  if (roleIndex !== -1) {
    mockRoles.roles[roleIndex] = {
      ...mockRoles.roles[roleIndex],
      ...updateData
    }
    return {
      code: 200,
      msg: '角色编辑成功',
      data: mockRoles.roles[roleIndex]
    }
  }
  
  return {
    code: 404,
    msg: '角色不存在'
  }
})

// 删除角色
Mock.mock(/\/roles\/\d+/, 'delete', (config) => {
  const id = parseInt(config.url.split('/').pop())
  const roleIndex = mockRoles.roles.findIndex(role => role.id === id)
  
  if (roleIndex !== -1) {
    mockRoles.roles.splice(roleIndex, 1)
    return {
      code: 200,
      msg: '角色删除成功',
      data: mockRoles.roles
    }
  }
  
  return {
    code: 404,
    msg: '角色不存在'
  }
})

// 分配权限
Mock.mock(/\/roles\/\d+\/permissions/, 'post', (config) => {
  const id = parseInt(config.url.split('/')[2])
  const permissions = JSON.parse(config.body).permissions
  const roleIndex = mockRoles.roles.findIndex(role => role.id === id)
  
  if (roleIndex !== -1) {
    mockRoles.roles[roleIndex].permissions = permissions
    return {
      code: 200,
      msg: '权限分配成功',
      data: mockRoles.roles[roleIndex]
    }
  }
  
  return {
    code: 404,
    msg: '角色不存在'
  }
})