require('es6-promise').polyfill()
import Vue from 'vue/dist/vue.common.js'
import Vuex from 'vuex/dist/vuex.js'
import Items from '../../../src/components/Items.vue'
import * as types from '../../../src/store/mutation-types'
import * as getters from '../../../src/store/getters'

describe('Items.vue', () => {
  it('test initial rendering with mock data', (done) => {
    const actionsInjector = require('inject-loader!../../../src/store/actions')
    const actions = actionsInjector({
      './api': {
        getItems () {
          return new Promise((resolve, reject) => {
            const arr = ['Cat', 'Dog', 'Fish', 'Snail']
            resolve(arr)
          })
        }
      }
    })

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

    const mockStore = new Vuex.Store(options)

    const vm = new Vue({
      template: '<div><test></test></div>',
      store: mockStore,
      components: {
        'test': Items
      }
    }).$mount()

    Vue.nextTick()
      .then(() => {
        expect(vm.$el.querySelectorAll('.items').length).to.equal(4)
        done()
      })
      .catch(done)
  })
})