<template>
  <div class="tags-container">
    <el-card class="tags-card">
      <div class="card-header">
        <h2>标签管理</h2>
        <el-button type="primary" @click="handleAddTag">
          <i class="el-icon-plus"></i> 新增标签
        </el-button>
      </div>
      
      <!-- 搜索区域 -->
      <div class="search-section">
        <el-input v-model="searchQuery" placeholder="请输入标签名称" @input="handleSearch">
          <el-button slot="append" icon="el-icon-search" @click="handleSearch"></el-button>
        </el-input>
      </div>
      
      <!-- 标签列表 -->
      <div class="tags-list">
        <div v-if="filteredTags.length === 0" class="empty-state">
          <el-empty description="暂无标签数据"></el-empty>
        </div>
        <el-table v-else :data="paginatedTags" style="width: 100%" border>
          <el-table-column prop="id" label="ID" width="80" align="center"></el-table-column>
          <el-table-column prop="name" label="标签名称" width="150"></el-table-column>
          <el-table-column prop="color" label="标签颜色" width="120" align="center">
            <template slot-scope="scope">
              <div class="color-preview" :style="{ backgroundColor: scope.row.color }"></div>
              <span>{{ scope.row.color }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="articleCount" label="使用次数" width="100" align="center">
            <template slot-scope="scope">
              <el-badge :value="scope.row.articleCount || 0" type="primary"></el-badge>
            </template>
          </el-table-column>
          <el-table-column prop="createTime" label="创建时间" width="180" align="center"></el-table-column>
          <el-table-column label="操作" width="180" align="center">
            <template slot-scope="scope">
              <el-button type="primary" size="small" @click="handleEditTag(scope.row)">编辑</el-button>
              <el-button type="danger" size="small" @click="handleDeleteTag(scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      
      <!-- 分页 -->
      <div v-if="filteredTags.length > 0" class="pagination">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-sizes="[10, 20, 50, 100]"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="filteredTags.length">
        </el-pagination>
      </div>
    </el-card>
    
    <!-- 标签编辑对话框 -->
    <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" width="500px">
      <el-form :model="tagForm" :rules="tagRules" ref="tagForm" label-width="100px">
        <el-form-item label="标签名称" prop="name">
          <el-input v-model="tagForm.name" placeholder="请输入标签名称"></el-input>
        </el-form-item>
        <el-form-item label="标签颜色" prop="color">
          <el-color-picker v-model="tagForm.color" size="small" show-alpha></el-color-picker>
          <span class="color-value">{{ tagForm.color }}</span>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleCancel">取消</el-button>
        <el-button type="primary" @click="handleSubmit">提交</el-button>
      </span>
    </el-dialog>
    
    <!-- 标签云展示 -->
    <el-card class="tags-cloud-card" style="margin-top: 20px;">
      <div class="card-header">
        <h3>标签云</h3>
      </div>
      <div class="tags-cloud">
        <el-tag
          v-for="tag in tags"
          :key="tag.id"
          :type="getTagType(tag)"
          :size="getTagSize(tag)"
          @click="handleTagClick(tag)"
          class="cloud-tag"
        >
          {{ tag.name }}
          <el-badge :value="tag.articleCount || 0" type="info" :hidden="!(tag.articleCount > 0)"></el-badge>
        </el-tag>
      </div>
    </el-card>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'

export default {
  name: 'Tags',
  data() {
    return {
      // 搜索
      searchQuery: '',
      // 分页
      currentPage: 1,
      pageSize: 20,
      // 对话框
      dialogVisible: false,
      dialogTitle: '新增标签',
      isEditMode: false,
      currentTagId: null,
      // 标签表单
      tagForm: {
        name: '',
        color: '#409EFF'
      },
      // 表单验证规则
      tagRules: {
        name: [
          { required: true, message: '请输入标签名称', trigger: 'blur' },
          { min: 1, max: 30, message: '标签名称长度在 1 到 30 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    ...mapState('tags', ['tags']),
    // 过滤后的标签列表
    filteredTags() {
      if (!this.searchQuery) {
        return this.tags
      }
      return this.tags.filter(tag => tag.name.toLowerCase().includes(this.searchQuery.toLowerCase()))
    },
    // 分页后的标签列表
    paginatedTags() {
      const start = (this.currentPage - 1) * this.pageSize
      const end = start + this.pageSize
      return this.filteredTags.slice(start, end)
    }
  },
  mounted() {
    // 加载标签数据
    this.getTags()
  },
  methods: {
    ...mapActions('tags', ['getTags', 'createTag', 'updateTag', 'deleteTag']),
    
    // 搜索
    handleSearch() {
      this.currentPage = 1
    },
    
    // 分页大小变化
    handleSizeChange(size) {
      this.pageSize = size
      this.currentPage = 1
    },
    
    // 当前页码变化
    handleCurrentChange(current) {
      this.currentPage = current
    },
    
    // 新增标签
    handleAddTag() {
      this.dialogTitle = '新增标签'
      this.isEditMode = false
      this.currentTagId = null
      this.resetForm()
      this.dialogVisible = true
    },
    
    // 编辑标签
    handleEditTag(tag) {
      this.dialogTitle = '编辑标签'
      this.isEditMode = true
      this.currentTagId = tag.id
      this.tagForm = {
        name: tag.name,
        color: tag.color
      }
      this.dialogVisible = true
    },
    
    // 删除标签
    handleDeleteTag(tag) {
      if (tag.articleCount && tag.articleCount > 0) {
        this.$confirm(`标签 "${tag.name}" 正在被 ${tag.articleCount} 篇文章使用，确定要删除吗？`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          this.performDelete(tag.id)
        }).catch(() => {
          // 取消删除
        })
      } else {
        this.$confirm(`确定要删除标签 "${tag.name}" 吗？`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          this.performDelete(tag.id)
        }).catch(() => {
          // 取消删除
        })
      }
    },
    
    // 执行删除操作
    async performDelete(tagId) {
      const result = await this.deleteTag(tagId)
      if (result) {
        this.$message.success('删除成功')
        this.getTags()
      } else {
        this.$message.error('删除失败')
      }
    },
    
    // 提交表单
    async handleSubmit() {
      this.$refs.tagForm.validate(async (valid) => {
        if (valid) {
          try {
            let result
            if (this.isEditMode) {
              result = await this.updateTag({ id: this.currentTagId, tag: this.tagForm })
              if (result) {
                this.$message.success('更新成功')
              } else {
                this.$message.error('更新失败')
              }
            } else {
              result = await this.createTag(this.tagForm)
              if (result) {
                this.$message.success('创建成功')
              } else {
                this.$message.error('创建失败')
              }
            }
            if (result) {
              this.dialogVisible = false
              this.getTags()
            }
          } catch (error) {
            this.$message.error('操作失败，请重试')
          }
        }
      })
    },
    
    // 取消操作
    handleCancel() {
      this.dialogVisible = false
      this.resetForm()
    },
    
    // 重置表单
    resetForm() {
      this.tagForm = {
        name: '',
        color: '#409EFF'
      }
      if (this.$refs.tagForm) {
        this.$refs.tagForm.resetFields()
      }
    },
    
    // 标签点击事件
    handleTagClick(tag) {
      this.searchQuery = tag.name
    },
    
    // 根据标签使用次数获取标签类型
    getTagType(tag) {
      const count = tag.articleCount || 0
      if (count > 10) return 'success'
      if (count > 5) return 'warning'
      if (count > 0) return 'info'
      return ''
    },
    
    // 根据标签使用次数获取标签大小
    getTagSize(tag) {
      const count = tag.articleCount || 0
      if (count > 10) return 'large'
      if (count > 5) return 'medium'
      return 'small'
    }
  }
}
</script>

<style scoped>
.tags-container {
  width: 100%;
  height: 100%;
  padding: 20px;
}

.tags-card {
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

.card-header h2, .card-header h3 {
  font-size: 20px;
  font-weight: 600;
  color: #303133;
  margin: 0;
}

.search-section {
  margin-bottom: 20px;
  max-width: 300px;
}

.tags-list {
  margin-bottom: 20px;
}

.empty-state {
  padding: 50px 0;
  text-align: center;
}

.pagination {
  display: flex;
  justify-content: flex-end;
}

.color-preview {
  width: 20px;
  height: 20px;
  border-radius: 4px;
  display: inline-block;
  vertical-align: middle;
  margin-right: 5px;
  border: 1px solid #e4e7ed;
}

.color-value {
  margin-left: 10px;
  font-size: 14px;
  color: #606266;
}

.tags-cloud-card {
  margin-top: 20px;
}

.tags-cloud {
  padding: 20px;
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.cloud-tag {
  cursor: pointer;
  margin-bottom: 5px;
  transition: all 0.3s;
}

.cloud-tag:hover {
  transform: scale(1.05);
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