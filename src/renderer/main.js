import Vue from 'vue'
// import Raven from 'raven-js'
// import RavenVue from 'raven-js/plugins/vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-default/index.css'
import App from './App'
import router from './router'
import store from './store'
import Header from './components/header'
import Bottom from './components/bottom'
import TableContent from './components/tableContent'
import NavBar from './components/navbar'
let tools = require('@/assets/JS/tools')
Vue.prototype.tools = tools;
Vue.config.productionTip = false
Vue.use(ElementUI)
if (!process.env.IS_WEB) Vue.use(require('vue-electron'))
// Sentry 错误报告
// Raven
//     .config('https://f3c58ec9eb8f47b584c42bed2771ea74@sentry.io/195260')
//     .addPlugin(RavenVue, Vue)
//     .install()

/* eslint-disable no-new */


//import global components
Vue.component('Header',Header)
Vue.component('Bottom',Bottom)
Vue.component('myTable',TableContent)
Vue.component('myNav',NavBar)
//filter
Vue.filter('reverseSize',(val)=>{
  if(val<1024){
    return val+'B';
  }else if(val>=1024 && val<Math.pow(1024,2)){
    return Math.round(val/1024*100)/100+'KB'
  }else if(val>=Math.pow(1024,2) && val<Math.pow(1024,3)){
    return Math.round(val/1024/1024*100)/100+'M'
  }else if(val>=Math.pow(1024,3) && val<Math.pow(1024,4)){
    return Math.round(val/1024/1024/1024*100)/100+'G';
  }else if(val>=Math.pow(1024,4) && val<Math.pow(1024,5)){
    return Math.round(val/1024/1024/1024*100)/100+'T';
  }
})

new Vue({
  router,
  store,
  components: {App},
  template: '<App/>'
}).$mount('#app')
