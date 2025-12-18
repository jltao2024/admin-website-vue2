<template>
  <div class="settings-container">
    <el-card class="settings-card">
      <div class="card-header">
        <h2>系统设置</h2>
      </div>
      <div class="card-body">
        <el-tabs v-model="activeTab">
          <el-tab-pane label="基本设置" name="basic">
            <el-form :model="settings" label-width="100px">
              <el-form-item label="系统名称">
                <el-input v-model="settings.systemName" placeholder="请输入系统名称"></el-input>
              </el-form-item>
              <el-form-item label="系统描述">
                <el-input v-model="settings.systemDescription" type="textarea" placeholder="请输入系统描述"></el-input>
              </el-form-item>
              <el-form-item label="联系方式">
                <el-input v-model="settings.contact" placeholder="请输入联系方式"></el-input>
              </el-form-item>
              <el-form-item label="启用日志">
                <el-switch v-model="settings.enableLogging"></el-switch>
              </el-form-item>
              <el-form-item label="日志级别">
                <el-select v-model="settings.logLevel" placeholder="请选择日志级别">
                  <el-option label="调试" value="debug"></el-option>
                  <el-option label="信息" value="info"></el-option>
                  <el-option label="警告" value="warn"></el-option>
                  <el-option label="错误" value="error"></el-option>
                </el-select>
              </el-form-item>
            </el-form>
          </el-tab-pane>
          <el-tab-pane label="安全设置" name="security">
            <el-form :model="securitySettings" label-width="100px">
              <el-form-item label="启用验证码">
                <el-switch v-model="securitySettings.enableCaptcha"></el-switch>
              </el-form-item>
              <el-form-item label="密码过期天数">
                <el-input-number v-model="securitySettings.passwordExpireDays" :min="7" :max="365"></el-input-number>
              </el-form-item>
              <el-form-item label="登录失败锁定">
                <el-switch v-model="securitySettings.loginFailLock"></el-switch>
              </el-form-item>
              <el-form-item label="连续失败次数">
                <el-input-number v-model="securitySettings.loginFailTimes" :min="3" :max="10"></el-input-number>
              </el-form-item>
            </el-form>
          </el-tab-pane>
          <el-tab-pane label="邮件设置" name="email">
            <el-form :model="emailSettings" label-width="100px">
              <el-form-item label="SMTP服务器">
                <el-input v-model="emailSettings.smtpServer" placeholder="请输入SMTP服务器"></el-input>
              </el-form-item>
              <el-form-item label="SMTP端口">
                <el-input-number v-model="emailSettings.smtpPort" :min="1" :max="65535"></el-input-number>
              </el-form-item>
              <el-form-item label="发件人邮箱">
                <el-input v-model="emailSettings.senderEmail" placeholder="请输入发件人邮箱"></el-input>
              </el-form-item>
              <el-form-item label="发件人名称">
                <el-input v-model="emailSettings.senderName" placeholder="请输入发件人名称"></el-input>
              </el-form-item>
              <el-form-item label="启用SSL">
                <el-switch v-model="emailSettings.enableSSL"></el-switch>
              </el-form-item>
            </el-form>
          </el-tab-pane>
        </el-tabs>
        <div class="form-actions">
          <el-button type="primary" @click="handleSave">保存设置</el-button>
          <el-button @click="handleReset">重置</el-button>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'

export default {
  name: 'Settings',
  computed: {
    ...mapState('settings', ['basicSettings', 'securitySettings', 'emailSettings']),
    activeTab: {
      get() {
        return this.$store.state.settings.activeTab || 'basic'
      },
      set(value) {
        this.$store.commit('settings/updateActiveTab', value)
      }
    },
    settings() {
      return this.basicSettings
    }
  },
  mounted() {
    // 加载设置数据
    this.getSettings()
  },
  methods: {
    ...mapActions('settings', ['getSettings', 'saveSettings', 'resetSettings']),
    
    
    async handleSave() {
      this.$confirm('确定要保存设置吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'info'
      }).then(async () => {
        try {
          const allSettings = {
            basic: this.settings,
            security: this.securitySettings,
            email: this.emailSettings
          }
          const success = await this.saveSettings(allSettings)
          if (success) {
            this.$message.success('设置保存成功')
          } else {
            this.$message.error('设置保存失败，请重试')
          }
        } catch (error) {
          this.$message.error('操作失败，请重试')
        }
      }).catch(() => {
        // 取消保存
      })
    },
    
    async handleReset() {
      this.$confirm('确定要重置设置吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        try {
          const success = await this.resetSettings()
          if (success) {
            this.$message.success('设置已重置')
          } else {
            this.$message.error('设置重置失败，请重试')
          }
        } catch (error) {
          this.$message.error('操作失败，请重试')
        }
      }).catch(() => {
        // 取消重置
      })
    }
  }
}</script>

<style scoped>
.settings-container {
  width: 100%;
  height: 100%;
  padding: 20px;
  box-sizing: border-box;
}

.settings-card {
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  border: none;
}

.card-header {
  margin-bottom: 20px;
}

.card-header h2 {
  font-size: 20px;
  font-weight: 600;
  color: #303133;
  margin: 0;
}

.card-body {
  margin-top: 20px;
}

.form-actions {
  margin-top: 30px;
  display: flex;
  justify-content: flex-end;
}

.form-actions .el-button {
  margin-left: 10px;
}
</style>