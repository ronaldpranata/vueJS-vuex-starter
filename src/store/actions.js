import * as types from './mutation-types'
import api from './api'

export const setItems = ({ commit }) => {
  api.getItems()
    .then((items) => {
      commit(types.setItems, items)
    })
    .catch((err) => console.log(err))
}
