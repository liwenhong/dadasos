import Vue from 'vue'
import App from './App'
import '../static/css/weui.wxss'
import '../static/css/flex.wxss'
import { Bmob_Serve } from './utils/bmob'

Vue.config.productionTip = false
App.mpType = 'app'
Vue.prototype.$Bmob = Bmob_Serve

const app = new Vue(App)
app.$mount()
