import { rolesApi } from '@/api/roles'

const state = {
  roles: [],
  permissions: []
}

const mutations = {
  setRoles(state, roles) {
    state.roles = roles
  },
  addRole(state, role) {
    state.roles.push(role)
  },
  updateRole(state, updatedRole) {
    const index = state.roles.findIndex(role => role.id === updatedRole.id)
    if (index !== -1) {
      state.roles.splice(index, 1, updatedRole)
    }
  },
  deleteRole(state, roleId) {
    state.roles = state.roles.filter(role => role.id !== roleId)
  },
  setPermissions(state, permissions) {
    state.permissions = permissions
  }
}

const actions = {
  async getRoles(context) {
    try {
      const result = await rolesApi.getRoles()
      if (result.code === 200) {
        context.commit('setRoles', result.data)
      }
    } catch (error) {
      console.error('获取角色列表失败:', error)
    }
  },
  
  async createRole(context, roleData) {
    try {
      const result = await rolesApi.createRole(roleData)
      if (result.code === 200) {
        context.commit('addRole', result.data)
        return result.data
      }
    } catch (error) {
      console.error('创建角色失败:', error)
      throw error
    }
  },
  
  async updateRole(context, { roleId, roleData }) {
    try {
      const result = await rolesApi.updateRole(roleId, roleData)
      if (result.code === 200) {
        context.commit('updateRole', result.data)
        return result.data
      }
    } catch (error) {
      console.error('更新角色失败:', error)
      throw error
    }
  },
  
  async deleteRole(context, roleId) {
    try {
      const result = await rolesApi.deleteRole(roleId)
      if (result.code === 200) {
        context.commit('deleteRole', roleId)
        return true
      }
      return false
    } catch (error) {
      console.error('删除角色失败:', error)
      throw error
    }
  },
  
  async getPermissions(context) {
    try {
      const result = await rolesApi.getPermissions()
      if (result.code === 200) {
        context.commit('setPermissions', result.data)
      }
    } catch (error) {
      console.error('获取权限列表失败:', error)
    }
  }
}

const getters = {
  getRoleById: (state) => (id) => {
    return state.roles.find(role => role.id === id)
  },
  getAllPermissions: (state) => {
    return state.permissions
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}