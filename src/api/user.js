import http from '@/utils/http'

export const userApi = {
  getUserList() {
    return http.get('/users')
  },
  createUser(userData) {
    return http.post('/users', userData)
  },
  updateUser(userId, userData) {
    return http.put(`/users/${userId}`, userData)
  },
  deleteUser(userId) {
    return http.delete(`/users/${userId}`)
  },
  login(credentials) {
    return http.post('/login', credentials)
  }
}