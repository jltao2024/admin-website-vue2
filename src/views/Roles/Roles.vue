<template>
  <div class="roles-container">
    <el-card class="roles-card">
      <div class="card-header">
        <h2>角色管理</h2>
        <el-button type="primary" @click="handleAddRole">
          <i class="el-icon-plus"></i> 添加角色
        </el-button>
      </div>
      <div class="card-body">
        <el-table :data="roles" style="width: 100%" border>
          <el-table-column prop="id" label="ID" width="80" align="center"></el-table-column>
          <el-table-column prop="name" label="角色名称" width="150"></el-table-column>
          <el-table-column prop="description" label="角色描述" width="250"></el-table-column>
          <el-table-column prop="createTime" label="创建时间" width="180" align="center"></el-table-column>
          <el-table-column label="操作" width="350" align="center">
            <template slot-scope="scope">
              <el-button type="primary" size="small" @click="handleEditRole(scope.row)">编辑</el-button>
              <el-button type="success" size="small" @click="handleAssignPermissions(scope.row)">分配权限</el-button>
              <el-button type="danger" size="small" @click="handleDeleteRole(scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-card>

    <!-- 添加/编辑角色对话框 -->
    <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" width="500px">
      <el-form :model="formData" :rules="formRules" ref="formData" label-width="80px">
        <el-form-item label="角色名称" prop="name">
          <el-input v-model="formData.name" placeholder="请输入角色名称"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="description">
          <el-input v-model="formData.description" type="textarea" placeholder="请输入角色描述"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit">确定</el-button>
      </div>
    </el-dialog>

    <!-- 分配权限对话框 -->
    <el-dialog :title="'分配权限 - ' + selectedRole.name" :visible.sync="permissionDialogVisible" width="600px">
      <el-tree
        :data="permissions"
        :props="permissionTreeProps"
        show-checkbox
        default-expand-all
        node-key="id"
        ref="permissionTree"
        highlight-current
      ></el-tree>
      <div slot="footer" class="dialog-footer">
        <el-button @click="permissionDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleAssign">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'

export default {
  name: 'Roles',
  computed: {
    ...mapState('roles', ['roles', 'permissions'])
  },
  data() {
    return {
      dialogVisible: false,
      permissionDialogVisible: false,
      isEdit: false,
      dialogTitle: '',
      formData: {
        name: '',
        description: ''
      },
      formRules: {
        name: [
          { required: true, message: '请输入角色名称', trigger: 'blur' },
          { min: 2, max: 20, message: '角色名称长度在 2 到 20 个字符', trigger: 'blur' }
        ],
        description: [
          { max: 100, message: '角色描述不能超过 100 个字符', trigger: 'blur' }
        ]
      },
      selectedRole: {},
      permissionTreeProps: {
        label: 'name',
        children: 'children'
      }
    }
  },
  mounted() {
    // 加载角色和权限数据
    this.getRoles()
    this.getPermissions()
  },
  methods: {
    ...mapActions('roles', ['getRoles', 'createRole', 'updateRole', 'deleteRole', 'getPermissions']),
    
    handleAddRole() {
      this.isEdit = false
      this.dialogTitle = '添加角色'
      this.formData = {
        name: '',
        description: ''
      }
      this.dialogVisible = true
    },
    
    handleEditRole(role) {
      this.isEdit = true
      this.dialogTitle = '编辑角色'
      this.formData = {
        id: role.id,
        name: role.name,
        description: role.description
      }
      this.dialogVisible = true
    },
    
    async handleSubmit() {
      await this.$refs.formData.validate(async (valid) => {
        if (valid) {
          try {
            if (this.isEdit) {
              await this.updateRole({
                roleId: this.formData.id,
                roleData: this.formData
              })
              this.$message.success('角色编辑成功')
            } else {
              await this.createRole(this.formData)
              this.$message.success('角色添加成功')
            }
            this.dialogVisible = false
          } catch (error) {
            this.$message.error('操作失败，请重试')
          }
        }
      })
    },
    
    async handleDeleteRole(role) {
      this.$confirm(`确定要删除角色 "${role.name}" 吗？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        try {
          await this.deleteRole(role.id)
          this.$message.success('角色删除成功')
        } catch (error) {
          this.$message.error('删除失败，请重试')
        }
      }).catch(() => {
        // 取消删除
      })
    },
    
    handleAssignPermissions(role) {
      this.selectedRole = role
      this.permissionDialogVisible = true
      // 后续实现：加载角色已有权限并勾选
    },
    
    handleAssign() {
      // 后续实现：获取选中的权限并提交
      this.permissionDialogVisible = false
      this.$message.success('权限分配成功')
    }
  }
}
</script>

<style scoped>
.roles-container {
  width: 100%;
  height: 100%;
  padding: 20px;
  box-sizing: border-box;
}

.roles-card {
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