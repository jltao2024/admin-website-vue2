import Mock from 'mockjs'

// 生成随机文章数据
const mockArticles = []
const articleStatuses = ['published', 'draft', 'pending']
const categories = [{ id: 1, name: '技术', parentId: 0 }, { id: 2, name: '生活', parentId: 0 }, { id: 3, name: '前端', parentId: 1 }, { id: 4, name: '后端', parentId: 1 }]
const tags = [{ id: 1, name: 'Vue' }, { id: 2, name: 'JavaScript' }, { id: 3, name: 'React' }, { id: 4, name: 'Node.js' }]

for (let i = 1; i <= 20; i++) {
  mockArticles.push({
    id: i,
    title: Mock.Random.ctitle(10, 20),
    content: Mock.Random.cparagraph(5, 20),
    categoryId: Mock.Random.pick(categories).id,
    categoryName: function() {
      const category = categories.find(c => c.id === this.categoryId)
      return category ? category.name : ''
    },
    tags: function() {
      const tagCount = Mock.Random.integer(1, 3)
      const selectedTags = Mock.Random.shuffle(tags).slice(0, tagCount)
      return selectedTags.map(tag => tag.id)
    },
    status: Mock.Random.pick(articleStatuses),
    views: Mock.Random.integer(0, 10000),
    likes: Mock.Random.integer(0, 500),
    comments: Mock.Random.integer(0, 200),
    author: 'Admin',
    createdAt: Mock.Random.datetime('yyyy-MM-dd HH:mm:ss'),
    updatedAt: Mock.Random.datetime('yyyy-MM-dd HH:mm:ss')
  })
}

// 文章相关模拟接口
Mock.mock(/\/articles/, 'get', (config) => {
  const params = config.params
  const page = parseInt(params.page) || 1
  const pageSize = parseInt(params.pageSize) || 10
  const keyword = params.keyword || ''
  const categoryId = params.categoryId || ''
  const status = params.status || ''

  let filteredArticles = mockArticles
  
  // 关键词过滤
  if (keyword) {
    filteredArticles = filteredArticles.filter(article => 
      article.title.includes(keyword) || article.content.includes(keyword)
    )
  }

  // 分类过滤
  if (categoryId) {
    filteredArticles = filteredArticles.filter(article => 
      article.categoryId === parseInt(categoryId)
    )
  }

  // 状态过滤
  if (status) {
    filteredArticles = filteredArticles.filter(article => article.status === status)
  }

  const total = filteredArticles.length
  const startIndex = (page - 1) * pageSize
  const endIndex = startIndex + pageSize
  const articles = filteredArticles.slice(startIndex, endIndex)

  return {
    code: 200,
    msg: 'success',
    data: {
      articles,
      total
    }
  }
})

Mock.mock(/\/articles\/\d+/, 'get', (config) => {
  const id = parseInt(config.url.match(/\d+/)[0])
  const article = mockArticles.find(a => a.id === id)
  return {
    code: 200,
    msg: 'success',
    data: article
  }
})

Mock.mock(/\/articles/, 'post', (config) => {
  const newArticle = JSON.parse(config.body)
  const maxId = Math.max(...mockArticles.map(a => a.id))
  const article = {
    id: maxId + 1,
    ...newArticle,
    views: 0,
    likes: 0,
    comments: 0,
    author: 'Admin',
    createdAt: new Date().toISOString().slice(0, 19).replace('T', ' '),
    updatedAt: new Date().toISOString().slice(0, 19).replace('T', ' ')
  }
  mockArticles.unshift(article)
  return {
    code: 200,
    msg: 'success',
    data: article
  }
})

Mock.mock(/\/articles\/\d+/, 'put', (config) => {
  const id = parseInt(config.url.match(/\d+/)[0])
  const updatedArticle = JSON.parse(config.body)
  const index = mockArticles.findIndex(a => a.id === id)
  if (index !== -1) {
    mockArticles[index] = {
      ...mockArticles[index],
      ...updatedArticle,
      updatedAt: new Date().toISOString().slice(0, 19).replace('T', ' ')
    }
    return {
      code: 200,
      msg: 'success',
      data: mockArticles[index]
    }
  }
  return {
    code: 404,
    msg: 'Article not found'
  }
})

Mock.mock(/\/articles\/\d+/, 'delete', (config) => {
  const id = parseInt(config.url.match(/\d+/)[0])
  const index = mockArticles.findIndex(a => a.id === id)
  if (index !== -1) {
    mockArticles.splice(index, 1)
    return {
      code: 200,
      msg: 'success'
    }
  }
  return {
    code: 404,
    msg: 'Article not found'
  }
})

Mock.mock(/\/articles\/\d+\/status/, 'patch', (config) => {
  const id = parseInt(config.url.match(/\d+/)[0])
  const { status } = JSON.parse(config.body)
  const index = mockArticles.findIndex(a => a.id === id)
  if (index !== -1) {
    mockArticles[index].status = status
    mockArticles[index].updatedAt = new Date().toISOString().slice(0, 19).replace('T', ' ')
    return {
      code: 200,
      msg: 'success'
    }
  }
  return {
    code: 404,
    msg: 'Article not found'
  }
})

// 分类相关模拟接口
Mock.mock(/\/categories/, 'get', () => {
  return {
    code: 200,
    msg: 'success',
    data: categories
  }
})

Mock.mock(/\/categories\/\d+/, 'get', (config) => {
  const id = parseInt(config.url.match(/\d+/)[0])
  const category = categories.find(c => c.id === id)
  return {
    code: 200,
    msg: 'success',
    data: category
  }
})

Mock.mock(/\/categories/, 'post', (config) => {
  const newCategory = JSON.parse(config.body)
  const maxId = Math.max(...categories.map(c => c.id))
  const category = {
    id: maxId + 1,
    ...newCategory,
    createdAt: new Date().toISOString().slice(0, 19).replace('T', ' '),
    updatedAt: new Date().toISOString().slice(0, 19).replace('T', ' ')
  }
  categories.push(category)
  return {
    code: 200,
    msg: 'success',
    data: category
  }
})

Mock.mock(/\/categories\/\d+/, 'put', (config) => {
  const id = parseInt(config.url.match(/\d+/)[0])
  const updatedCategory = JSON.parse(config.body)
  const index = categories.findIndex(c => c.id === id)
  if (index !== -1) {
    categories[index] = {
      ...categories[index],
      ...updatedCategory,
      updatedAt: new Date().toISOString().slice(0, 19).replace('T', ' ')
    }
    return {
      code: 200,
      msg: 'success',
      data: categories[index]
    }
  }
  return {
    code: 404,
    msg: 'Category not found'
  }
})

Mock.mock(/\/categories\/\d+/, 'delete', (config) => {
  const id = parseInt(config.url.match(/\d+/)[0])
  // 检查是否有子分类
  const hasChildren = categories.some(c => c.parentId === id)
  if (hasChildren) {
    return {
      code: 400,
      msg: '该分类下有子分类，无法删除'
    }
  }
  // 检查是否有文章使用该分类
  const hasArticles = mockArticles.some(a => a.categoryId === id)
  if (hasArticles) {
    return {
      code: 400,
      msg: '该分类下有文章，无法删除'
    }
  }
  const index = categories.findIndex(c => c.id === id)
  if (index !== -1) {
    categories.splice(index, 1)
    return {
      code: 200,
      msg: 'success'
    }
  }
  return {
    code: 404,
    msg: 'Category not found'
  }
})

// 标签相关模拟接口
Mock.mock(/\/tags/, 'get', () => {
  return {
    code: 200,
    msg: 'success',
    data: tags
  }
})

Mock.mock(/\/tags/, 'post', (config) => {
  const newTag = JSON.parse(config.body)
  const maxId = Math.max(...tags.map(t => t.id))
  const tag = {
    id: maxId + 1,
    ...newTag,
    createdAt: new Date().toISOString().slice(0, 19).replace('T', ' '),
    updatedAt: new Date().toISOString().slice(0, 19).replace('T', ' ')
  }
  tags.push(tag)
  return {
    code: 200,
    msg: 'success',
    data: tag
  }
})

Mock.mock(/\/tags\/\d+/, 'put', (config) => {
  const id = parseInt(config.url.match(/\d+/)[0])
  const updatedTag = JSON.parse(config.body)
  const index = tags.findIndex(t => t.id === id)
  if (index !== -1) {
    tags[index] = {
      ...tags[index],
      ...updatedTag,
      updatedAt: new Date().toISOString().slice(0, 19).replace('T', ' ')
    }
    return {
      code: 200,
      msg: 'success',
      data: tags[index]
    }
  }
  return {
    code: 404,
    msg: 'Tag not found'
  }
})

Mock.mock(/\/tags\/\d+/, 'delete', (config) => {
  const id = parseInt(config.url.match(/\d+/)[0])
  // 检查是否有文章使用该标签
  const hasArticles = mockArticles.some(a => a.tags.includes(id))
  if (hasArticles) {
    return {
      code: 400,
      msg: '该标签下有文章，无法删除'
    }
  }
  const index = tags.findIndex(t => t.id === id)
  if (index !== -1) {
    tags.splice(index, 1)
    return {
      code: 200,
      msg: 'success'
    }
  }
  return {
    code: 404,
    msg: 'Tag not found'
  }
})

// 图片上传模拟接口
Mock.mock(/\/upload\/image/, 'post', () => {
  return {
    code: 200,
    msg: 'success',
    data: {
      url: 'https://picsum.photos/800/600?random=' + Math.random()
    }
  }
})
