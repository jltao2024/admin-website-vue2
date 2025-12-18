import http from '@/utils/http'

export const logsApi = {
  getLogs(params) {
    return http.get('/logs', { params })
  },
  getLogDetail(logId) {
    return http.get(`/logs/${logId}`)
  },
  clearLogs() {
    return http.delete('/logs')
  },
  exportLogs(params) {
    return http.get('/logs/export', { params, responseType: 'blob' })
  }
}