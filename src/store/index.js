require('es6-promise').polyfill()
import Vue from 'vue/dist/vue.common.js'
import Vuex from 'vuex/dist/vuex.js'

Vue.use(Vuex)

import * as types from './mutation-types'
import * as actions from './actions'
import * as getters from './getters'

const state = {
  items: []
}

const mutations = {
  [types.setItems] (state, items) {
    state.items = items
  }
}

const options = {
  state,
  mutations,
  actions,
  getters
}

export default new Vuex.Store(options)
export { options }
