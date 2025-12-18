<template>
  <div class="users-container">
    <el-card class="users-card">
      <div class="card-header">
        <h2>用户管理</h2>
        <el-button type="primary" @click="handleAddUser">
          <i class="el-icon-plus"></i> 添加用户
        </el-button>
      </div>
      <div class="card-body">
        <el-table :data="users" style="width: 100%" border>
          <el-table-column prop="id" label="ID" width="80" align="center"></el-table-column>
          <el-table-column label="头像" width="80" align="center">
            <template slot-scope="scope">
              <el-avatar :src="scope.row.avatar" size="small">{{ scope.row.name[0] }}</el-avatar>
            </template>
          </el-table-column>
          <el-table-column prop="name" label="姓名" width="120"></el-table-column>
          <el-table-column prop="email" label="邮箱"></el-table-column>
          <el-table-column prop="phone" label="电话" width="150"></el-table-column>
          <el-table-column prop="createTime" label="创建时间" width="180" align="center"></el-table-column>
          <el-table-column label="操作" width="200" align="center">
            <template slot-scope="scope">
              <el-button type="primary" size="small" @click="handleEditUser(scope.row)">编辑</el-button>
              <el-button type="danger" size="small" @click="handleDeleteUser(scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-card>

    <!-- 添加/编辑用户对话框 -->
    <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" width="500px">
      <el-form :model="formData" :rules="formRules" ref="formData" label-width="80px">
        <el-form-item label="姓名" prop="name">
          <el-input v-model="formData.name" placeholder="请输入姓名"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="formData.email" placeholder="请输入邮箱"></el-input>
        </el-form-item>
        <el-form-item label="电话" prop="phone">
          <el-input v-model="formData.phone" placeholder="请输入电话"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password" v-if="!isEdit">
          <el-input v-model="formData.password" type="password" placeholder="请输入密码"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'

export default {
  name: 'Users',
  computed: {
    ...mapState('users', ['users'])
  },
  data() {
    return {
      dialogVisible: false,
      isEdit: false,
      dialogTitle: '',
      formData: {
        name: '',
        email: '',
        phone: '',
        password: ''
      },
      formRules: {
        name: [
          { required: true, message: '请输入姓名', trigger: 'blur' },
          { min: 2, max: 20, message: '姓名长度在 2 到 20 个字符', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' }
        ],
        phone: [
          { required: true, message: '请输入电话', trigger: 'blur' },
          { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号码', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, message: '密码长度不能少于 6 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  mounted() {
    // 加载用户数据
    this.getUsers()
  },
  methods: {
    ...mapActions('users', ['getUsers', 'createUser', 'updateUser', 'deleteUser']),

    handleAddUser() {
      this.isEdit = false
      this.dialogTitle = '添加用户'
      this.formData = {
        name: '',
        email: '',
        phone: '',
        password: ''
      }
      this.dialogVisible = true
    },

    handleEditUser(user) {
      this.isEdit = true
      this.dialogTitle = '编辑用户'
      this.formData = {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone
      }
      this.dialogVisible = true
    },

    async handleSubmit() {
      await this.$refs.formData.validate(async (valid) => {
        if (valid) {
          try {
            if (this.isEdit) {
              // 编辑用户
              await this.updateUser({
                userId: this.formData.id,
                userData: this.formData
              })
              this.$message.success('用户编辑成功')
            } else {
              // 添加用户
              await this.createUser(this.formData)
              this.$message.success('用户添加成功')
            }
            this.dialogVisible = false
          } catch (error) {
            this.$message.error('操作失败，请重试')
          }
        } else {
          return false
        }
      })
    },

    async handleDeleteUser(user) {
      await this.$confirm(`确定要删除用户 ${user.name} 吗？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        try {
          await this.deleteUser(user.id)
          this.$message.success('删除成功')
        } catch (error) {
          this.$message.error('删除失败，请重试')
        }
      }).catch(() => {
        // 取消删除
      })
    }
  }
}
</script>

<style scoped>
.users-container {
  width: 100%;
  height: 100%;
  padding: 20px;
  box-sizing: border-box;
}

.users-card {
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  border: none;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
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

/* 确保操作列按钮水平排列 */
.el-table .el-table__body-wrapper .el-table__column--operation .cell {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: nowrap;
}

/* 给操作列按钮添加间距 */
.el-table .el-table__body-wrapper .el-button {
  margin-right: 8px;
  display: inline-block;
}

/* 最后一个按钮不需要右边距 */
.el-table .el-table__body-wrapper .el-button:last-child {
  margin-right: 0;
}
</style>