import Vue from 'vue'
import App from './App'
import '../static/css/weui.wxss'
import '../static/css/flex.wxss'
require('./utils/bmob_init')
import mpvueToastRegistry from 'mptoast/registry'
const Bmob = require('./utils/bomb')
Vue.config.productionTip = false
App.mpType = 'app'
Vue.prototype.$Bmob = Bmob

mpvueToastRegistry(Vue)
const app = new Vue(App)
app.$mount()

// export default {
//   // 这个字段走 app.json
//   config: {
//     // 页面前带有 ^ 符号的，会被编译成首页，其他页面可以选填，我们会自动把 webpack entry 里面的入口页面加进去
//     pages: [
//       'pages/index/main',
//       'pages/chooseAddress/main',
//       '^pages/login/main',
//     ],
//     window: {
//       backgroundTextStyle: 'light',
//       navigationBarBackgroundColor: '#fff',
//       navigationBarTitleText: '哒哒救援',
//       navigationBarTextStyle: 'black',
//       backgroundColor: '#f5f5f5'
//     },
//     // tabBar: {
//     //   "color":'#bbbbbb',
//     //   "selectedColor":"#D6AA59",
//     //   "backgroundColor":"#fff",
//     //   "list": [{
//     //     "pagePath": "pages/index/main",
//     //     "text": "首页",
//     //     "iconPath":"/static/img/foot/home.png",
//     //     "selectedIconPath":"/static/img/foot/home-active.png"
//     //   },{
//     //     "pagePath": "pages/logs/main",
//     //     "text": "好物",
//     //     "iconPath":"/static/img/foot/help.png",
//     //     "selectedIconPath":"/static/img/foot/help-active.png"
//     //   },{
//     //     "pagePath": "pages/my/main",
//     //     "text": "我的",
//     //     "iconPath":"/static/img/foot/me.png",
//     //     "selectedIconPath":"/static/img/foot/me-active.png"
//     //   }
//     // ]
//     // },
//     networkTimeout: {
//       "request": 10000,
//       "downloadFile": 10000
//     },
//     debug: false
//   }
// }
