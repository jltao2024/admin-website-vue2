import { userApi } from '@/api/user'

const state = {
    users: []
}

const mutations = {
    setUsers(state, users) {
        state.users = users
    },
    addUser(state, user) {
        state.users.push(user)
    },
    updateUser(state, updatedUser) {
        const index = state.users.findIndex(user => user.id === updatedUser.id)
        if (index !== -1) {
            state.users.splice(index, 1, updatedUser)
        }
    },
    deleteUser(state, userId) {
        state.users = state.users.filter(user => user.id !== userId)
    }
}

const actions = {
    async getUsers(context) {
        let result = await userApi.getUserList()
        if (result.code === 200) {
            context.commit('setUsers', result.data)
        }
    },
    async createUser(context, userData) {
        let result = await userApi.createUser(userData)
        if (result.code === 200) {
            context.commit('addUser', result.data)
            return result.data
        }
    },
    async updateUser(context, { userId, userData }) {
        let result = await userApi.updateUser(userId, userData)
        if (result.code === 200) {
            context.commit('updateUser', result.data)
            return result.data
        }
    },
    async deleteUser(context, userId) {
        let result = await userApi.deleteUser(userId)
        if (result.code === 200) {
            context.commit('deleteUser', userId)
            return true
        }
        return false
    }
}

const getters = {
    getUserById: (state) => (id) => {
        return state.users.find(user => user.id === id)
    }
}

export default {
    namespaced: true,
    state,
    mutations,
    actions,
    getters
}
