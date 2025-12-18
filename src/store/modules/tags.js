import { tagApi } from '@/api/content'

const state = {
  tags: []
}

const mutations = {
  setTags(state, tags) {
    state.tags = tags
  },
  addTag(state, tag) {
    state.tags.push(tag)
  },
  updateTag(state, updatedTag) {
    const index = state.tags.findIndex(tag => tag.id === updatedTag.id)
    if (index !== -1) {
      state.tags.splice(index, 1, updatedTag)
    }
  },
  deleteTag(state, tagId) {
    state.tags = state.tags.filter(tag => tag.id !== tagId)
  }
}

const actions = {
  async getTags(context) {
    const result = await tagApi.getTags()
    if (result.code === 200) {
      context.commit('setTags', result.data)
    }
  },
  async createTag(context, tag) {
    const result = await tagApi.createTag(tag)
    if (result.code === 200) {
      context.commit('addTag', result.data)
      return result.data
    }
  },
  async updateTag(context, { id, tag }) {
    const result = await tagApi.updateTag(id, tag)
    if (result.code === 200) {
      context.commit('updateTag', result.data)
      return result.data
    }
  },
  async deleteTag(context, id) {
    const result = await tagApi.deleteTag(id)
    if (result.code === 200) {
      context.commit('deleteTag', id)
      return true
    }
    return false
  }
}

const getters = {
  getTagById: (state) => (id) => {
    return state.tags.find(tag => tag.id === id)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}