import http from '@/utils/http'

export const settingsApi = {
  getSettings() {
    return http.get('/settings')
  },
  saveSettings(settingsData) {
    return http.post('/settings', settingsData)
  },
  resetSettings() {
    return http.delete('/settings')
  }
}