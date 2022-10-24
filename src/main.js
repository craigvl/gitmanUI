import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import Vuefire from 'vuefire'
import VueResource from 'vue-resource'
import VueSnackbar from 'vue-snack'
import ElementUI from 'element-ui'
import Vuelidate from 'vuelidate'
import CloudFunction from '@/services/cloud-function-service'
import GithubPublicService from '@/services/github-public-service'
import { functions } from '@/firebase' // config and prepare firebase app
import './utils'
import SlideUpDown from 'vue-slide-up-down'

Vue.component('slide-up-down', SlideUpDown)
Vue.use(VueResource)
Vue.use(Vuefire)
Vue.use(ElementUI)

Vue.use(VueSnackbar, { close: false, time: 20000 })
Vue.use(Vuelidate)
Vue.use(CloudFunction, { firebaseFunctions: functions })
Vue.use(GithubPublicService, { apiUrl: `https://api.github.com` })

Vue.config.productionTip = false

// js config
Vue.prototype.$admins = ['thierry.rais@gmail.com', 'undead_craig@hotmail.com', 'craigvl@tpg.com.au']
Vue.prototype.$rewardAmounts = [0.001, 0.01, 0.06, 0.1, 0.2, 0.4, 0.8, 1]

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
