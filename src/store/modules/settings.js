import { settingsApi } from '@/api/settings'

const state = {
  activeTab: 'basic',
  basicSettings: {
    systemName: '管理系统',
    systemDescription: '这是一个后台管理系统',
    contact: 'admin@example.com',
    enableLogging: true,
    logLevel: 'info'
  },
  securitySettings: {
    enableCaptcha: true,
    passwordExpireDays: 90,
    loginFailLock: true,
    loginFailTimes: 5
  },
  emailSettings: {
    smtpServer: 'smtp.example.com',
    smtpPort: 587,
    senderEmail: 'noreply@example.com',
    senderName: '管理系统',
    enableSSL: true
  }
}

const mutations = {
  updateActiveTab(state, tab) {
    state.activeTab = tab
  },
  updateBasicSettings(state, settings) {
    state.basicSettings = { ...state.basicSettings, ...settings }
  },
  updateSecuritySettings(state, settings) {
    state.securitySettings = { ...state.securitySettings, ...settings }
  },
  updateEmailSettings(state, settings) {
    state.emailSettings = { ...state.emailSettings, ...settings }
  },
  resetAllSettings(state) {
    state.activeTab = 'basic'
    state.basicSettings = {
      systemName: '管理系统',
      systemDescription: '这是一个后台管理系统',
      contact: 'admin@example.com',
      enableLogging: true,
      logLevel: 'info'
    }
    state.securitySettings = {
      enableCaptcha: true,
      passwordExpireDays: 90,
      loginFailLock: true,
      loginFailTimes: 5
    }
    state.emailSettings = {
      smtpServer: 'smtp.example.com',
      smtpPort: 587,
      senderEmail: 'noreply@example.com',
      senderName: '管理系统',
      enableSSL: true
    }
  }
}

const actions = {
  async getSettings(context) {
    try {
      const result = await settingsApi.getSettings()
      if (result.code === 200) {
        if (result.data.basic) {
          context.commit('updateBasicSettings', result.data.basic)
        }
        if (result.data.security) {
          context.commit('updateSecuritySettings', result.data.security)
        }
        if (result.data.email) {
          context.commit('updateEmailSettings', result.data.email)
        }
      }
    } catch (error) {
      console.error('获取设置失败:', error)
    }
  },
  async saveSettings(context, allSettings) {
    try {
      const result = await settingsApi.saveSettings(allSettings)
      if (result.code === 200) {
        context.commit('updateBasicSettings', allSettings.basic)
        context.commit('updateSecuritySettings', allSettings.security)
        context.commit('updateEmailSettings', allSettings.email)
        return true
      }
      return false
    } catch (error) {
      console.error('保存设置失败:', error)
      return false
    }
  },
  async resetSettings(context) {
    try {
      const result = await settingsApi.resetSettings()
      if (result.code === 200) {
        context.commit('resetAllSettings')
        return true
      }
      return false
    } catch (error) {
      console.error('重置设置失败:', error)
      return false
    }
  }
}

const getters = {
  getAllSettings(state) {
    return {
      basic: state.basicSettings,
      security: state.securitySettings,
      email: state.emailSettings
    }
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}