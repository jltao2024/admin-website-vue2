import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)

import users from './modules/users'
import auth from './modules/auth'
import articles from './modules/articles'
import categories from './modules/categories'
import tags from './modules/tags'
import settings from './modules/settings'
import roles from './modules/roles'
import logs from './modules/logs'

const store = new Vuex.Store({
    modules: {
        users,
        auth,
        articles,
        categories,
        tags,
        settings,
        roles,
        logs
    }
})

export default store
