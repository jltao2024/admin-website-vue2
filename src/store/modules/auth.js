import { userApi } from '@/api/user'

const state = {
  token: localStorage.getItem('token') || '',
  user: JSON.parse(localStorage.getItem('user')) || null,
  isLoggedIn: !!localStorage.getItem('token'),
  permissions: (() => {
    try {
      const token = localStorage.getItem('token')
      if (token) {
        return JSON.parse(localStorage.getItem('permissions')) || []
      }
      // 默认显示所有权限，便于开发调试
      return ['user:manage', 'role:manage', 'log:manage', 'article:manage', 'category:manage', 'tag:manage', 'setting:manage']
    } catch (e) {
      console.error('Error parsing permissions from localStorage:', e)
      return ['user:manage', 'role:manage', 'log:manage', 'article:manage', 'category:manage', 'tag:manage', 'setting:manage']
    }
  })(),
  roles: (() => {
    try {
      const token = localStorage.getItem('token')
      if (token) {
        return JSON.parse(localStorage.getItem('roles')) || []
      }
      // 默认管理员角色，便于开发调试
      return ['admin']
    } catch (e) {
      console.error('Error parsing roles from localStorage:', e)
      return ['admin']
    }
  })()
}

const mutations = {
  setLoginData(state, { token, user, permissions, roles }) {
    state.token = token
    state.user = user
    state.isLoggedIn = true
    state.permissions = permissions || []
    state.roles = roles || []
    
    // 保存到localStorage
    localStorage.setItem('token', token)
    localStorage.setItem('user', JSON.stringify(user))
    localStorage.setItem('permissions', JSON.stringify(permissions || []))
    localStorage.setItem('roles', JSON.stringify(roles || []))
  },
  
  clearLoginData(state) {
    state.token = ''
    state.user = null
    state.isLoggedIn = false
    state.permissions = []
    state.roles = []
    
    // 清除localStorage
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    localStorage.removeItem('permissions')
    localStorage.removeItem('roles')
  }
}

const actions = {
  async login(context, credentials) {
    let result = await userApi.login(credentials)
    if (result.code === 200) {
      context.commit('setLoginData', result.data)
    } else {
      throw new Error(result.msg || '登录失败')
    }
  },
  
  logout(context) {
    context.commit('clearLoginData')
  }
}

const getters = {
  isLoggedIn: state => state.isLoggedIn,
  user: state => state.user,
  token: state => state.token,
  permissions: state => state.permissions,
  roles: state => state.roles,
  // 检查用户是否有特定权限
  hasPermission: state => permission => {
    return state.permissions.includes(permission)
  },
  // 检查用户是否有特定角色
  hasRole: state => role => {
    return state.roles.includes(role)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}