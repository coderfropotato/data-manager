import Vue from 'vue';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-default/index.css';
import App from './App';
import router from './router';
import store from './store';
import Header from './components/header';
import Bottom from './components/bottom';
import TableContent from './components/tableContent';
import NavBar from './components/navbar';
import EditDom from './components/edit';


let tools = require('@/assets/JS/tools');
Vue.prototype.tools = tools;
Vue.config.productionTip = false
Vue.use(ElementUI)
if (!process.env.IS_WEB) Vue.use(require('vue-electron'));

//import global components
Vue.component('Header', Header);
Vue.component('Bottom', Bottom);
Vue.component('myTable', TableContent);
Vue.component('myNav', NavBar);
Vue.component('EditDom', EditDom);

//global filter
Vue.filter('reverseSize', (val) => {
  if (val < 1024) {
    return val + 'B';
  } else if (val >= 1024 && val < Math.pow(1024, 2)) {
    return Math.round(val / 1024 * 100) / 100 + 'KB'
  } else if (val >= Math.pow(1024, 2) && val < Math.pow(1024, 3)) {
    return Math.round(val / 1024 / 1024 * 100) / 100 + 'M'
  } else if (val >= Math.pow(1024, 3) && val < Math.pow(1024, 4)) {
    return Math.round(val / 1024 / 1024 / 1024 * 100) / 100 + 'G';
  } else if (val >= Math.pow(1024, 4) && val < Math.pow(1024, 5)) {
    return Math.round(val / 1024 / 1024 / 1024 * 100) / 100 + 'T';
  }
});
// 时间戳转换
Vue.filter('reverseTime', (val) => {
  let time = Math.round(val * 1000);
  let oDate = new Date(time);
  let y = oDate.getFullYear();
  let m = oDate.getMonth() + 1;
  let d = oDate.getDate();
  let h = oDate.getHours();
  let mm = oDate.getMinutes();
  let s = oDate.getSeconds();
  return y + '-' + addZero(m) + '-' + addZero(d) + ' ' + addZero(h) + ':' + addZero(mm) ;
});

function addZero(m) {
  return m < 10 ? '0' + m : m
}

// mount
new Vue({
  router,
  store,
  components: {
    App
  },
  template: '<App/>'
}).$mount('#app')