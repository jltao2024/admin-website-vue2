<template>
  <div class="login-container">
    <div class="login-box">
      <div class="login-header">
        <h2>管理系统</h2>
        <p>请登录您的账号</p>
      </div>
      <el-form :model="loginForm" :rules="loginRules" ref="loginForm" @keyup.enter.native="handleLogin" class="login-form">
        <el-form-item prop="username" class="login-form-item">
          <el-input
            v-model="loginForm.username"
            placeholder="请输入用户名"
            prefix-icon="el-icon-user-solid"
            autofocus
            size="large"
            class="login-input"
          />
        </el-form-item>
        <el-form-item prop="password" class="login-form-item">
          <el-input
            v-model="loginForm.password"
            type="password"
            placeholder="请输入密码"
            prefix-icon="el-icon-lock"
            show-password
            size="large"
            class="login-input"
          />
        </el-form-item>
        <el-form-item>
          <el-alert
            v-if="error"
            type="error"
            :title="error"
            show-icon
            :closable="false"
            class="error-alert"
          />
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            native-type="submit"
            :loading="loading"
            block
            size="large"
            @click="handleLogin"
            class="login-btn"
          >
            登录
          </el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Login',
  data() {
    return {
      loginForm: {
        username: '',
        password: ''
      },
      loginRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' }
        ]
      },
      loading: false,
      error: null
    }
  },
  methods: {
    async handleLogin() {
      this.$refs.loginForm.validate(async (valid) => {
        if (valid) {
          this.loading = true
          this.error = null
          try {
            await this.$store.dispatch('auth/login', {
              username: this.loginForm.username,
              password: this.loginForm.password
            })
            // 登录成功后，跳转到之前的页面或默认页面
            const redirect = this.$route.query.redirect || '/'
            this.$router.push(redirect)
          } catch (err) {
            this.error = err.message || '登录失败，请检查用户名和密码'
          } finally {
            this.loading = false
          }
        }
      })
    }
  }
}
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
}

.login-box {
  width: 100%;
  max-width: 420px;
  background-color: #ecf5ff;
  border-radius: 12px;
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1);
  padding: 40px;
  transition: all 0.3s ease;
}

.login-box:hover {
  box-shadow: 0 20px 45px rgba(0, 0, 0, 0.15);
}

.login-header {
  text-align: center;
  margin-bottom: 30px;
}

.login-header h2 {
  color: #333;
  font-size: 28px;
  font-weight: 600;
  margin-bottom: 8px;
}

.login-header p {
  color: #666;
  font-size: 14px;
  margin: 0;
}

.login-form {
  width: 100%;
}

.login-form-item {
  margin-bottom: 22px;
}

.login-input {
  border-radius: 8px;
  border-color: #e4e7ed;
  transition: all 0.3s ease;
}

.login-input:hover {
  border-color: #c0c4cc;
}

.login-input:focus {
  border-color: #667eea;
  box-shadow: 0 0 0 2px rgba(102, 126, 234, 0.2);
}

.error-alert {
  margin-bottom: 20px;
}

.login-btn {
  /* 按钮长度和输入框一样长 */
  width: 100%;
  border-radius: 8px;
  padding: 12px;
  font-size: 16px;
  font-weight: 500;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  transition: all 0.3s ease;
}

.login-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 16px rgba(102, 126, 234, 0.4);
  background: linear-gradient(135deg, #764ba2 0%, #667eea 100%);
}

.login-btn:active:not(:disabled) {
  transform: translateY(0);
}

/* 隐藏Element UI默认的标签，使用自定义样式 */
.login-form-item .el-form-item__label {
  display: none;
}
</style>