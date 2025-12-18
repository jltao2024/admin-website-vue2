import { categoryApi } from '@/api/content'

const state = {
  categories: [],
  currentCategory: null
}

// 构建分类树结构
const buildCategoryTree = (categories) => {
  const tree = []
  const categoryMap = {}
  
  // 创建分类映射表
  categories.forEach(category => {
    categoryMap[category.id] = { ...category, children: [] }
  })
  
  // 构建树形结构
  categories.forEach(category => {
    if (category.parentId === 0 || !category.parentId) {
      tree.push(categoryMap[category.id])
    } else if (categoryMap[category.parentId]) {
      categoryMap[category.parentId].children.push(categoryMap[category.id])
    }
  })
  
  return tree
}

// 递归查找分类
const findCategoryRecursive = (categories, id, callback) => {
  for (let i = 0; i < categories.length; i++) {
    if (categories[i].id === id) {
      return callback(categories, i)
    }
    if (categories[i].children && categories[i].children.length > 0) {
      const result = findCategoryRecursive(categories[i].children, id, callback)
      if (result) {
        return result
      }
    }
  }
  return false
}

const mutations = {
  setCategories(state, categories) {
    state.categories = buildCategoryTree(categories)
  },
  setCurrentCategory(state, category) {
    state.currentCategory = category
  },
  addCategory(state, category) {
    // 如果是根分类，直接添加到categories数组
    if (category.parentId === 0 || !category.parentId) {
      state.categories.push(category)
    } else {
      // 如果是子分类，找到父分类并添加到children数组
      findCategoryRecursive(state.categories, category.parentId, (categories, index) => {
        if (!categories[index].children) {
          categories[index].children = []
        }
        categories[index].children.push(category)
        return true
      })
    }
  },
  updateCategory(state, updatedCategory) {
    findCategoryRecursive(state.categories, updatedCategory.id, (categories, index) => {
      categories[index] = updatedCategory
      return true
    })
  },
  deleteCategory(state, categoryId) {
    findCategoryRecursive(state.categories, categoryId, (categories, index) => {
      categories.splice(index, 1)
      return true
    })
  }
}

const actions = {
  async getCategories(context) {
    const result = await categoryApi.getCategories()
    if (result.code === 200) {
      context.commit('setCategories', result.data)
    }
  },
  async getCategory(context, id) {
    const result = await categoryApi.getCategory(id)
    if (result.code === 200) {
      context.commit('setCurrentCategory', result.data)
    }
  },
  async createCategory(context, category) {
    const result = await categoryApi.createCategory(category)
    if (result.code === 200) {
      context.commit('addCategory', result.data)
      return result.data
    }
  },
  async updateCategory(context, { id, category }) {
    const result = await categoryApi.updateCategory(id, category)
    if (result.code === 200) {
      context.commit('updateCategory', result.data)
      return result.data
    }
  },
  async deleteCategory(context, id) {
    const result = await categoryApi.deleteCategory(id)
    if (result.code === 200) {
      context.commit('deleteCategory', id)
      return true
    }
    return false
  }
}

const getters = {
  getCategoryById: (state) => (id) => {
    let result = null
    findCategoryRecursive(state.categories, id, (categories, index) => {
      result = categories[index]
      return true
    })
    return result
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}