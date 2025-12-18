<template>
  <div class="categories-container">
    <el-card class="categories-card">
      <div class="card-header">
        <h2>分类管理</h2>
        <el-button type="primary" @click="handleAddCategory">
          <i class="el-icon-plus"></i> 新增分类
        </el-button>
      </div>
      
      <div class="categories-content">
        <div class="left-panel">
          <div class="panel-header">分类列表</div>
          <div class="tree-container">
            <el-tree
              :data="categories"
              :props="treeProps"
              :default-expand-all="false"
              :expand-on-click-node="false"
              node-key="id"
              ref="categoryTree"
              @node-click="handleNodeClick"
              @node-contextmenu="handleNodeContextMenu"
            >
              <span class="custom-tree-node" slot-scope="{ node, data }">
                <span>{{ node.label }}</span>
                <span class="node-actions">
                  <el-button type="text" size="mini" @click.stop="() => handleEditCategory(data)">
                    <i class="el-icon-edit"></i>
                  </el-button>
                  <el-button type="text" size="mini" @click.stop="() => handleAddSubCategory(data)">
                    <i class="el-icon-circle-plus-outline"></i>
                  </el-button>
                  <el-button type="text" size="mini" @click.stop="() => handleDeleteCategory(data)">
                    <i class="el-icon-delete"></i>
                  </el-button>
                </span>
              </span>
            </el-tree>
          </div>
        </div>
        
        <div class="right-panel">
          <div class="panel-header">{{ selectedCategory ? '编辑分类' : '分类详情' }}</div>
          <div v-if="selectedCategory" class="category-form">
            <el-form :model="categoryForm" :rules="categoryRules" ref="categoryForm" label-width="100px">
              <el-form-item label="分类名称" prop="name">
                <el-input v-model="categoryForm.name" placeholder="请输入分类名称"></el-input>
              </el-form-item>
              <el-form-item label="父分类">
                <el-select v-model="categoryForm.parentId" placeholder="请选择父分类">
                  <el-option label="无父分类" value="0"></el-option>
                  <el-option
                    v-for="category in categories"
                    :key="category.id"
                    :label="category.name"
                    :value="category.id"
                    :disabled="category.id === selectedCategory.id"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="排序">
                <el-input-number v-model="categoryForm.sort" :min="0" :max="100" :step="1"></el-input-number>
              </el-form-item>
              <el-form-item label="状态">
                <el-switch v-model="categoryForm.status" active-value="active" inactive-value="inactive"></el-switch>
              </el-form-item>
              <el-form-item label="描述">
                <el-input v-model="categoryForm.description" type="textarea" rows="3" placeholder="请输入分类描述"></el-input>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="handleSubmit">保存</el-button>
                <el-button @click="handleCancel">取消</el-button>
              </el-form-item>
            </el-form>
          </div>
          <div v-else class="no-selection">
            <el-empty description="请选择一个分类查看详情"></el-empty>
          </div>
        </div>
      </div>
    </el-card>
    
    <!-- 右键菜单 -->
    <div v-show="contextMenuVisible" :style="contextMenuStyle" class="context-menu">
      <el-menu @select="handleContextMenuSelect">
        <el-menu-item index="add">
          <i class="el-icon-circle-plus-outline"></i> 新增子分类
        </el-menu-item>
        <el-menu-item index="edit">
          <i class="el-icon-edit"></i> 编辑分类
        </el-menu-item>
        <el-menu-item index="delete">
          <i class="el-icon-delete"></i> 删除分类
        </el-menu-item>
      </el-menu>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'

export default {
  name: 'Categories',
  data() {
    return {
      // 树结构配置
      treeProps: {
        children: 'children',
        label: 'name'
      },
      // 选中的分类
      selectedCategory: null,
      // 分类表单
      categoryForm: {
        name: '',
        parentId: '0',
        sort: 0,
        status: 'active',
        description: ''
      },
      // 表单验证规则
      categoryRules: {
        name: [
          { required: true, message: '请输入分类名称', trigger: 'blur' },
          { min: 1, max: 50, message: '分类名称长度在 1 到 50 个字符', trigger: 'blur' }
        ]
      },
      // 右键菜单
      contextMenuVisible: false,
      contextMenuStyle: {},
      currentNode: null
    }
  },
  computed: {
    ...mapState('categories', ['categories'])
  },
  mounted() {
    // 加载分类数据
    this.getCategories()
    
    // 点击空白处关闭右键菜单
    document.addEventListener('click', this.closeContextMenu)
  },
  beforeDestroy() {
    document.removeEventListener('click', this.closeContextMenu)
  },
  methods: {
    ...mapActions('categories', ['getCategories', 'createCategory', 'updateCategory', 'deleteCategory']),
    
    // 节点点击事件
    handleNodeClick(data) {
      this.selectedCategory = data
      this.categoryForm = {
        name: data.name,
        parentId: data.parentId || '0',
        sort: data.sort || 0,
        status: data.status || 'active',
        description: data.description || ''
      }
    },
    
    // 新增分类
    handleAddCategory() {
      this.selectedCategory = null
      this.resetForm()
    },
    
    // 新增子分类
    handleAddSubCategory(data) {
      this.selectedCategory = null
      this.resetForm()
      this.categoryForm.parentId = data.id
    },
    
    // 编辑分类
    handleEditCategory(data) {
      this.selectedCategory = data
      this.categoryForm = {
        name: data.name,
        parentId: data.parentId || '0',
        sort: data.sort || 0,
        status: data.status || 'active',
        description: data.description || ''
      }
    },
    
    // 删除分类
    handleDeleteCategory(data) {
      if (data.children && data.children.length > 0) {
        this.$message.warning('该分类下有子分类，无法删除')
        return
      }
      
      this.$confirm(`确定要删除分类 "${data.name}" 吗？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const result = await this.deleteCategory(data.id)
        if (result) {
          this.$message.success('删除成功')
          this.selectedCategory = null
          this.getCategories()
        } else {
          this.$message.error('删除失败')
        }
      }).catch(() => {
        // 取消删除
      })
    },
    
    // 提交表单
    async handleSubmit() {
      this.$refs.categoryForm.validate(async (valid) => {
        if (valid) {
          try {
            let result
            const categoryData = {
              ...this.categoryForm,
              parentId: this.categoryForm.parentId === '0' ? 0 : this.categoryForm.parentId
            }
            
            if (this.selectedCategory) {
              // 编辑模式
              result = await this.updateCategory({ id: this.selectedCategory.id, category: categoryData })
              if (result) {
                this.$message.success('更新成功')
                this.getCategories()
              } else {
                this.$message.error('更新失败')
              }
            } else {
              // 新增模式
              result = await this.createCategory(categoryData)
              if (result) {
                this.$message.success('创建成功')
                this.resetForm()
                this.getCategories()
              } else {
                this.$message.error('创建失败')
              }
            }
          } catch (error) {
            this.$message.error('操作失败，请重试')
          }
        }
      })
    },
    
    // 取消操作
    handleCancel() {
      this.resetForm()
      if (this.selectedCategory) {
        this.categoryForm = {
          name: this.selectedCategory.name,
          parentId: this.selectedCategory.parentId || '0',
          sort: this.selectedCategory.sort || 0,
          status: this.selectedCategory.status || 'active',
          description: this.selectedCategory.description || ''
        }
      }
    },
    
    // 重置表单
    resetForm() {
      this.categoryForm = {
        name: '',
        parentId: '0',
        sort: 0,
        status: 'active',
        description: ''
      }
      if (this.$refs.categoryForm) {
        this.$refs.categoryForm.resetFields()
      }
    },
    
    // 节点右键菜单
    handleNodeContextMenu(event, data) {
      event.preventDefault()
      this.contextMenuVisible = true
      this.currentNode = data
      this.contextMenuStyle = {
        left: `${event.clientX}px`,
        top: `${event.clientY}px`
      }
    },
    
    // 关闭右键菜单
    closeContextMenu() {
      this.contextMenuVisible = false
    },
    
    // 右键菜单选择
    handleContextMenuSelect(key) {
      this.closeContextMenu()
      switch (key) {
        case 'add':
          this.handleAddSubCategory(this.currentNode)
          break
        case 'edit':
          this.handleEditCategory(this.currentNode)
          break
        case 'delete':
          this.handleDeleteCategory(this.currentNode)
          break
        default:
          break
      }
    }
  }
}
</script>

<style scoped>
.categories-container {
  width: 100%;
  height: 100%;
  padding: 20px;
}

.categories-card {
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  border: none;
  height: calc(100% - 40px);
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

.categories-content {
  display: flex;
  height: calc(100% - 60px);
}

.left-panel {
  width: 350px;
  border-right: 1px solid #e4e7ed;
  display: flex;
  flex-direction: column;
}

.right-panel {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.panel-header {
  padding: 10px 20px;
  background-color: #f5f7fa;
  font-weight: 600;
  color: #303133;
  border-bottom: 1px solid #e4e7ed;
}

.tree-container {
  flex: 1;
  padding: 20px;
  overflow-y: auto;
}

.custom-tree-node {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

.node-actions {
  visibility: hidden;
}

.custom-tree-node:hover .node-actions {
  visibility: visible;
}

.node-actions .el-button {
  padding: 0 5px;
  font-size: 12px;
  color: #606266;
}

.category-form {
  padding: 20px;
  overflow-y: auto;
  flex: 1;
}

.no-selection {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: #909399;
}

.context-menu {
  position: fixed;
  z-index: 1000;
  background-color: #fff;
  border-radius: 4px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  border: 1px solid #ebeef5;
}

.context-menu .el-menu {
  border: none;
  box-shadow: none;
}
</style>