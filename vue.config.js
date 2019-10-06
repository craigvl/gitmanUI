// vue.config.js

module.exports = {
  css: {
    modules: true
  },
  configureWebpack: config => {

    // fiddle with webpack here, if needed

    // console.debug(process.env)
    // if (process.env.NODE_ENV === 'production') {
    //   process.env.config = require('./environments/config.env.pre')
    // } else {
    //   process.env.config = require('./environments/config.env.dev')
    // }
  }
}
