// https://vuex.vuejs.org/zh-cn/intro.html
// make sure to call Vue.use(Vuex) if using a module system
import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    addressFrom:{},
    addressTo: {},
    curDate: ''
  },
  mutations: {
    setCurDate: (state,value) => {
      const obj = state
      obj.curDate = value
    },
    setAddressFrom: (state,value) => {
      state.addressFrom = value
    },
    setAddressTo: (state,value) => {
      state.addressTo = value
    }
  },
  getters: {
    getCurDate: (state) => {
      return state.curDate
    },
    getAddressFrom: state => {
      return state.addressFrom
    },
    getAddressTo: state => {
      return state.addressTo
    }
  }
})

export default store
