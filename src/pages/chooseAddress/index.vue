<template>
  <div>
    <div class="car-time">
      <img class="img-from" src="http://bmob-cdn-20712.b0.upaiyun.com/2018/08/25/1db33c12403cd86980e911b258e87a6b.png" alt="">
      <input type="text" v-model="address" placeholder="请输入地址"  @input="addressChange(1)">
    </div>
    <div class="content">
      <ul :class="{'padd-address':addressList.length>0}">
        <li v-for="(item,index) in addressList" :key="index" @click="chooseAddress(item)">
          <p>{{item.title}}</p>
          <span>{{item.address}}</span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { map_getSuggestion } from '@/utils/map.js'
export default {
  data () {
    return {
      address: '',
      addressList: [],
      type: 0,
      path: ''
    }
  },

  mounted () {
    let param = this.$root.$mp.query
    this.type = !!param.type ? param.type : 0
    this.path = !!param.path ? param.path : 'index'
    this.address = ''
  },
  methods: {
    addressChange(){
      if(this.address){
        // setTimeout(()=> {

          map_getSuggestion(this.address).then(res => {
            if(res.status === 0){
              this.addressList = res.data
            }
          }).catch(err => {
            console.log(err)
          })
        // },1500)
      }
    },
    chooseAddress(item){
      wx.redirectTo({
        url: '../'+this.path+'/main?type='+ this.type +'&address='+ JSON.stringify(item)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.car-time{
  line-height: 50px;
  border-bottom: 1px solid #eaeaea;
  background: #fff;
  img{
    height:20px;
    width:20px;
    float:left;
    margin:15px;
  }
  .img1{
    float:left;
  }
  .img2{
    width: 10px;
    float: right;
  }
  .img-from{
    width:20px;
    height:20px;
    margin:15px;
    float: left;
  }
  input{
    height: 50px;
    font-size: 16px;
  }

  .btn {
    position:fixed;
    bottom:10px;
    width:100%;
    margin: 0 auto;
    button{
      width:90%;
    }
  }

}
.content{
  margin:10px 15px 10px 15px;
  background:#fff;
  .padd-address{
    padding:10px 10px 0 10px;
  }
  ul{
    li{
      border-bottom: 1px solid #eaeaea;
      p{
        font-size: 16px;
      }
      span{
        color: #999;
        font-size: 14px;
      }
    }
  }

}
</style>

