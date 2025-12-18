import http from '@/utils/http'

export const rolesApi = {
  getRoles() {
    return http.get('/roles')
  },
  createRole(roleData) {
    return http.post('/roles', roleData)
  },
  updateRole(roleId, roleData) {
    return http.put(`/roles/${roleId}`, roleData)
  },
  deleteRole(roleId) {
    return http.delete(`/roles/${roleId}`)
  },
  assignPermissions(roleId, permissions) {
    return http.post(`/roles/${roleId}/permissions`, { permissions })
  },
  getRolePermissions(roleId) {
    return http.get(`/roles/${roleId}/permissions`)
  },
  getPermissions() {
    return http.get('/permissions')
  }
}