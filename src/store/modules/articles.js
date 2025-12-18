import { articleApi } from '@/api/content'

const state = {
  articles: [],
  total: 0,
  currentArticle: null
}

const mutations = {
  setArticles(state, { articles, total }) {
    state.articles = articles
    state.total = total
  },
  setCurrentArticle(state, article) {
    state.currentArticle = article
  },
  addArticle(state, article) {
    state.articles.unshift(article)
    state.total++
  },
  updateArticle(state, updatedArticle) {
    const index = state.articles.findIndex(article => article.id === updatedArticle.id)
    if (index !== -1) {
      state.articles.splice(index, 1, updatedArticle)
    }
  },
  deleteArticle(state, articleId) {
    state.articles = state.articles.filter(article => article.id !== articleId)
    state.total--
  }
}

const actions = {
  async getArticles(context, params) {
    const result = await articleApi.getArticles(params)
    if (result.code === 200) {
      context.commit('setArticles', result.data)
    }
  },
  async getArticle(context, id) {
    const result = await articleApi.getArticle(id)
    if (result.code === 200) {
      context.commit('setCurrentArticle', result.data)
    }
  },
  async createArticle(context, article) {
    const result = await articleApi.createArticle(article)
    if (result.code === 200) {
      context.commit('addArticle', result.data)
      return result.data
    }
  },
  async updateArticle(context, { id, article }) {
    const result = await articleApi.updateArticle(id, article)
    if (result.code === 200) {
      context.commit('updateArticle', result.data)
      return result.data
    }
  },
  async deleteArticle(context, id) {
    const result = await articleApi.deleteArticle(id)
    if (result.code === 200) {
      context.commit('deleteArticle', id)
      return true
    }
    return false
  },
  async updateArticleStatus(context, { id, status }) {
    const result = await articleApi.updateArticleStatus(id, status)
    if (result.code === 200) {
      context.dispatch('getArticles')
      return true
    }
    return false
  }
}

const getters = {
  getArticleById: (state) => (id) => {
    return state.articles.find(article => article.id === id)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}