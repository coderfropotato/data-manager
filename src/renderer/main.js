import Vue from 'vue'
// import Raven from 'raven-js'
// import RavenVue from 'raven-js/plugins/vue'

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-default/index.css'

import App from './App'
import router from './router'
import store from './store'

if (!process.env.IS_WEB) Vue.use(require('vue-electron'))
// Vue.http = Vue.prototype.$http = axios
Vue.config.productionTip = false

Vue.use(ElementUI)
// Sentry 错误报告
// Raven
//     .config('https://f3c58ec9eb8f47b584c42bed2771ea74@sentry.io/195260')
//     .addPlugin(RavenVue, Vue)
//     .install()

/* eslint-disable no-new */
new Vue({
  router,
  store,
  components: {App},
  template: '<App/>'
}).$mount('#app')
