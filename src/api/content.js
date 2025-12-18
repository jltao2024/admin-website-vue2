import http from '@/utils/http'

export const articleApi = {
  getArticles(params) {
    return http.get('/articles', { params })
  },
  getArticle(id) {
    return http.get(`/articles/${id}`)
  },
  createArticle(article) {
    return http.post('/articles', article)
  },
  updateArticle(id, article) {
    return http.put(`/articles/${id}`, article)
  },
  deleteArticle(id) {
    return http.delete(`/articles/${id}`)
  },
  updateArticleStatus(id, status) {
    return http.patch(`/articles/${id}/status`, { status })
  }
}

export const categoryApi = {
  getCategories() {
    return http.get('/categories')
  },
  getCategory(id) {
    return http.get(`/categories/${id}`)
  },
  createCategory(category) {
    return http.post('/categories', category)
  },
  updateCategory(id, category) {
    return http.put(`/categories/${id}`, category)
  },
  deleteCategory(id) {
    return http.delete(`/categories/${id}`)
  }
}

export const tagApi = {
  getTags() {
    return http.get('/tags')
  },
  createTag(tag) {
    return http.post('/tags', tag)
  },
  updateTag(id, tag) {
    return http.put(`/tags/${id}`, tag)
  },
  deleteTag(id) {
    return http.delete(`/tags/${id}`)
  }
}

export const uploadApi = {
  uploadImage(file) {
    const formData = new FormData()
    formData.append('file', file)
    return http.post('/upload/image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
  }
}