export default {
  getItems: function () {
    return new Promise((resolve, reject) => {
      // imagine we're making an API request here
      const response = require('./items.json')
      resolve(response.body)
    })
  }
}
