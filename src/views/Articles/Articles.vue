<template>
  <div class="articles-container">
    <el-card class="articles-card">
      <div class="card-header">
        <h2>文章管理</h2>
        <el-button type="primary" @click="handleAddArticle">
          <i class="el-icon-plus"></i> 新增文章
        </el-button>
      </div>
      
      <!-- 搜索筛选区域 -->
      <div class="search-section">
        <el-form :inline="true" :model="searchForm" class="search-form">
          <el-form-item label="标题">
            <el-input v-model="searchForm.title" placeholder="请输入文章标题" style="width: 200px;"></el-input>
          </el-form-item>
          <el-form-item label="分类">
            <el-select v-model="searchForm.categoryId" placeholder="请选择分类" style="width: 150px;">
              <el-option label="全部" value=""></el-option>
              <el-option v-for="category in categories" :key="category.id" :label="category.name" :value="category.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="状态">
            <el-select v-model="searchForm.status" placeholder="请选择状态" style="width: 120px;">
              <el-option label="全部" value=""></el-option>
              <el-option label="发布" value="published"></el-option>
              <el-option label="草稿" value="draft"></el-option>
              <el-option label="已删除" value="deleted"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleSearch">搜索</el-button>
            <el-button @click="handleReset">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
      
      <!-- 文章列表 -->
      <div class="articles-table">
        <el-table :data="articles" style="width: 100%" border>
          <el-table-column prop="id" label="ID" width="80" align="center"></el-table-column>
          <el-table-column prop="title" label="标题" min-width="200"></el-table-column>
          <el-table-column label="分类" width="120" align="center">
            <template slot-scope="scope">
              <span>{{ getCategoryName(scope.row.categoryId) }}</span>
            </template>
          </el-table-column>
          <el-table-column label="标签" width="150">
            <template slot-scope="scope">
              <el-tag v-for="tagId in scope.row.tags" :key="tagId" size="small" style="margin-right: 5px;">
                {{ getTagName(tagId) }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="author" label="作者" width="100" align="center"></el-table-column>
          <el-table-column prop="views" label="浏览量" width="100" align="center"></el-table-column>
          <el-table-column prop="status" label="状态" width="100" align="center">
            <template slot-scope="scope">
              <el-tag :type="getStatusType(scope.row.status)">{{ getStatusText(scope.row.status) }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="createTime" label="创建时间" width="180" align="center"></el-table-column>
          <el-table-column label="操作" width="240" align="center">
            <template slot-scope="scope">
              <el-button type="primary" size="small" @click="handleEditArticle(scope.row)">编辑</el-button>
              <el-button :type="scope.row.status === 'published' ? 'warning' : 'success'" size="small" @click="handleToggleStatus(scope.row)">
                {{ scope.row.status === 'published' ? '下架' : '发布' }}
              </el-button>
              <el-button type="danger" size="small" @click="handleDeleteArticle(scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      
      <!-- 分页 -->
      <div class="pagination">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="pagination.currentPage"
          :page-sizes="[10, 20, 50, 100]"
          :page-size="pagination.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total">
        </el-pagination>
      </div>
    </el-card>
    
    <!-- 文章编辑对话框 -->
    <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" width="80%" :close-on-click-modal="false">
      <el-form :model="articleForm" :rules="articleRules" ref="articleForm" label-width="100px">
        <el-form-item label="标题" prop="title">
          <el-input v-model="articleForm.title" placeholder="请输入文章标题"></el-input>
        </el-form-item>
        <el-form-item label="分类" prop="categoryId">
          <el-select v-model="articleForm.categoryId" placeholder="请选择文章分类">
            <el-option v-for="category in categories" :key="category.id" :label="category.name" :value="category.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="标签" prop="tags">
          <el-select v-model="articleForm.tags" multiple placeholder="请选择文章标签">
            <el-option v-for="tag in tags" :key="tag.id" :label="tag.name" :value="tag.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="摘要" prop="summary">
          <el-input v-model="articleForm.summary" type="textarea" rows="3" placeholder="请输入文章摘要"></el-input>
        </el-form-item>
        <el-form-item label="内容" prop="content">
          <div class="editor-container">
            <rich-text-editor v-model="articleForm.content" height="400px"></rich-text-editor>
          </div>
        </el-form-item>
        <el-form-item label="作者" prop="author">
          <el-input v-model="articleForm.author" placeholder="请输入作者名称"></el-input>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="articleForm.status">
            <el-radio label="published">发布</el-radio>
            <el-radio label="draft">草稿</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleCancel">取消</el-button>
        <el-button type="primary" @click="handleSubmit">提交</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import RichTextEditor from '@/components/RichTextEditor.vue'

export default {
  name: 'Articles',
  components: {
    RichTextEditor
  },
  data() {
    return {
      articles: [],
      categories: [],
      tags: [],
      searchForm: {
        title: '',
        categoryId: '',
        status: ''
      },
      pagination: {
        currentPage: 1,
        pageSize: 10
      },
      total: 0,
      dialogVisible: false,
      dialogTitle: '',
      isEditMode: false,
      currentArticleId: null,
      articleForm: {
        title: '',
        categoryId: '',
        tags: [],
        summary: '',
        content: '',
        author: '',
        status: 'draft'
      },
      articleRules: {
        title: [
          { required: true, message: '请输入文章标题', trigger: 'blur' },
          { min: 5, max: 100, message: '标题长度在 5 到 100 个字符', trigger: 'blur' }
        ],
        categoryId: [
          { required: true, message: '请选择文章分类', trigger: 'change' }
        ],
        content: [
          { required: true, message: '请输入文章内容', trigger: 'blur' }
        ]
      },
      // 状态映射表
      statusMap: {
        published: { text: '发布', type: 'success' },
        draft: { text: '草稿', type: 'info' },
        deleted: { text: '已删除', type: 'danger' }
      }
    }
  },
  computed: {
    ...mapState('articles', ['articles', 'total']),
    ...mapState('categories', ['categories']),
    ...mapState('tags', ['tags'])
  },
  mounted() {
    // 加载数据
    this.loadData()
  },
  methods: {
    ...mapActions('articles', ['getArticles', 'createArticle', 'updateArticle', 'deleteArticle', 'updateArticleStatus']),
    ...mapActions('categories', ['getCategories']),
    ...mapActions('tags', ['getTags']),
    
    // 加载所有数据
    async loadData() {
      await this.getCategories()
      await this.getTags()
      await this.loadArticles()
    },
    
    // 加载文章列表
    loadArticles() {
      const params = {
        page: this.pagination.currentPage,
        pageSize: this.pagination.pageSize,
        ...this.searchForm
      }
      this.getArticles(params)
    },
    
    // 搜索
    handleSearch() {
      this.pagination.currentPage = 1
      this.loadArticles()
    },
    
    // 重置搜索条件
    handleReset() {
      this.searchForm = {
        title: '',
        categoryId: '',
        status: ''
      }
      this.handleSearch()
    },
    
    // 分页大小变化
    handleSizeChange(size) {
      this.pagination.pageSize = size
      this.loadArticles()
    },
    
    // 当前页码变化
    handleCurrentChange(current) {
      this.pagination.currentPage = current
      this.loadArticles()
    },
    
    // 新增文章
    handleAddArticle() {
      this.dialogTitle = '新增文章'
      this.isEditMode = false
      this.currentArticleId = null
      this.resetForm()
      this.dialogVisible = true
    },
    
    // 编辑文章
    handleEditArticle(article) {
      this.dialogTitle = '编辑文章'
      this.isEditMode = true
      this.currentArticleId = article.id
      this.articleForm = {
        title: article.title,
        categoryId: article.categoryId,
        tags: article.tags,
        summary: article.summary || '',
        content: article.content,
        author: article.author,
        status: article.status
      }
      this.dialogVisible = true
    },
    
    // 删除文章
    handleDeleteArticle(article) {
      this.$confirm(`确定要删除文章 "${article.title}" 吗？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const result = await this.deleteArticle(article.id)
        if (result) {
          this.$message.success('删除成功')
          this.loadArticles()
        } else {
          this.$message.error('删除失败')
        }
      }).catch(() => {
        // 取消删除
      })
    },
    
    // 切换文章状态
    async handleToggleStatus(article) {
      const newStatus = article.status === 'published' ? 'draft' : 'published'
      const result = await this.updateArticleStatus({ id: article.id, status: newStatus })
      if (result) {
        this.$message.success(`文章已${newStatus === 'published' ? '发布' : '下架'}`)
        this.loadArticles()
      } else {
        this.$message.error('操作失败')
      }
    },
    
    // 提交表单
    async handleSubmit() {
      this.$refs.articleForm.validate(async (valid) => {
        if (valid) {
          try {
            let result
            if (this.isEditMode) {
              result = await this.updateArticle({ 
                id: this.currentArticleId, 
                article: this.articleForm 
              })
            } else {
              result = await this.createArticle(this.articleForm)
            }
            
            if (result) {
              this.$message.success(this.isEditMode ? '更新成功' : '创建成功')
              this.dialogVisible = false
              this.loadArticles()
            } else {
              this.$message.error(this.isEditMode ? '更新失败' : '创建失败')
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
      this.articleForm = {
        title: '',
        categoryId: '',
        tags: [],
        summary: '',
        content: '',
        author: '',
        status: 'draft'
      }
      if (this.$refs.articleForm) {
        this.$refs.articleForm.resetFields()
      }
    },
    
    // 获取状态文本
    getStatusText(status) {
      return this.statusMap[status] ? this.statusMap[status].text : status
    },
    
    // 获取状态类型
    getStatusType(status) {
      return this.statusMap[status] ? this.statusMap[status].type : 'warning'
    },
    
    // 获取分类名称
    getCategoryName(categoryId) {
      if (!categoryId) return ''
      const category = this.categories.find(cat => cat.id === categoryId)
      return category ? category.name : ''
    },
    
    // 获取标签名称
    getTagName(tagId) {
      if (!tagId) return ''
      const tag = this.tags.find(tag => tag.id === tagId)
      return tag ? tag.name : ''
    }
  }
}
</script>

<style scoped>
.articles-container {
  width: 100%;
  height: 100%;
  padding: 20px;
}

.articles-card {
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

.search-section {
  margin-bottom: 20px;
  padding: 10px;
  background-color: #f5f7fa;
  border-radius: 4px;
}

.search-form {
  display: flex;
  align-items: center;
}

.articles-table {
  margin-bottom: 20px;
}

.pagination {
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
}

.editor-container {
  min-height: 400px;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
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