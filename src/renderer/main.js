import Vue from 'vue'
import axios from 'axios'

import Raven from 'raven-js'
import RavenVue from 'raven-js/plugins/vue'

import ElementUI from 'element-ui'
// 样式文件需要单独导入
import 'element-ui/lib/theme-default/index.css'

import App from './App'
import router from './router'
import store from './store'

if (!process.env.IS_WEB) Vue.use(require('vue-electron'))
Vue.http = Vue.prototype.$http = axios
Vue.config.productionTip = false

Vue.use(ElementUI)

Raven
    .config('http://840fea76e1374f4c9d6d507a99802a8a@54.223.218.118:9000/8')
    .addPlugin(RavenVue, Vue)
    .install()

/* eslint-disable no-new */
new Vue({
  router,
  store,
  components: { App },
  template: '<App/>'
}).$mount('#app')
