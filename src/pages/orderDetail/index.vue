<template>
  <div>
    <mptoast />
    <map id="map" :longitude="longitude" :latitude="latitude" scale="15" bindcontroltap="controltap" :markers="markers" bindmarkertap="markertap"  show-location style="width: 100%; height: 250px;"></map>

    <view class="weui-form-preview" v-for="(item,index) in order" :key="index">
      <view class="weui-form-preview__hd">
          <view class="weui-form-preview__label">{{item.status ==='0'?'等待救援':'救援中'}}</view>
          <view class="weui-form-preview__value_in-hd">¥{{item.amount}}</view>
      </view>
      <view class="weui-form-preview__bd">
        <view class="weui-form-preview__item">
            <view class="weui-form-preview__label">订单时间</view>
            <view class="weui-form-preview__value">{{item.createdAt}}</view>
        </view>
          <view class="weui-form-preview__item">
              <view class="weui-form-preview__label">起点</view>
              <view class="weui-form-preview__value">{{item.addressFromDetail}}</view>
          </view>
          <view class="weui-form-preview__item">
              <view class="weui-form-preview__label">终点</view>
              <view class="weui-form-preview__value">{{item.addressToDetail}}</view>
          </view>
          <view class="weui-form-preview__item">
              <view class="weui-form-preview__label">救援师傅</view>
              <view class="weui-form-preview__value" v-if="!!item.carUser">{{item.carUser.username}}</view>
              <view class="weui-form-preview__value" v-else>暂无师傅接单</view>
          </view>
          <view class="weui-form-preview__item">
              <view class="weui-form-preview__label">离您距离</view>
              <view class="weui-form-preview__value" v-if="!!item.carUser">{{item.distance}}公里</view>
              <view class="weui-form-preview__value" v-else>暂无</view>
          </view>
          <view class="weui-form-preview__item">
              <view class="weui-form-preview__label">预计到达时间</view>
              <view class="weui-form-preview__value" v-if="!!item.carUser">{{item.duration}}分钟</view>
              <view class="weui-form-preview__value" v-else>暂无</view>
          </view>
      </view>
      <view class="weui-form-preview__ft">
          <a @click="toCall()" class="weui-form-preview__btn weui-form-preview__btn_default" hover-class="weui-form-preview__btn_active">联系客服</a>
          <a @click="!!item.carUser?toCall():''" class="weui-form-preview__btn weui-form-preview__btn_primary" hover-class="weui-form-preview__btn_active">联系师傅</a>
      </view>
    </view>
    <div class="tip">
      * 如订单超过五分钟没有师傅接单，请主动联系客服，为你指派离你最近的救援师傅。
    </div>
  </div>
</template>

<script>
import { map_getSuggestion, map_calculateDistance } from '@/utils/map.js'
import { Bomb_Search, Bmob_IncludeQuery, Bmob_QueryLocation } from '@/utils/bmob_init.js'
import mptoast from 'mptoast'
export default {
  data () {
    return {
      orderId: '',//  订单编号
      order:[],
      latitude:0,
      longitude:0,
      markers: [],
      polyline: [{
      points: [{
        longitude: 113.3245211,
        latitude: 23.10229
      }, {
        longitude: 113.324520,
        latitude: 23.21229
      }],
      color:"#FF0000DD",
      width: 2,
      dottedLine: true
    }],
    controls: [{
      id: 1,
      iconPath: '/resources/location.png',
      position: {
        left: 0,
        top: 300 - 50,
        width: 50,
        height: 50
      },
      clickable: true
    }]
    }
  },
  components: {
    mptoast
  },
  mounted () {
    this.getLocation()
    let obj = this.$root.$mp.query
    if(obj.objectId){
      this.latitude = obj.lat
      this.longitude = obj.lng
      this.getOrderInfo(obj.objectId)
    }else{
      this.$mptoast('未找到订单')
    }
  },
  methods: {
    toCall(){
      wx.makePhoneCall({
        phoneNumber: '18575501087'
      })
    },
    getOrderInfo(orderId){
      console.log(orderId)
      wx.showLoading();
      Bmob_IncludeQuery('Order',{ objectId: orderId },{ 'carUser': 'userInfo' }).then(res => {
        if(res.length > 0){
          this.order = res
          if(!!res[0].carUser){
            this.order = []
            map_calculateDistance(res[0].locationFrom,[res[0].carUser.location]).then(da => {
              res[0].distance = da.distance
              res[0].duration = da.duration
              this.order = res
              console.log(this.order)
              wx.hideLoading();
            })
          }
          wx.hideLoading();
          console.log(this.order)
        }
      }).catch(err => {
        console.log(JSON.stringify(err))
        wx.hideLoading();
      })
    },
    getLocation(){
      let self = this
      this.markers = []
      wx.getLocation({
        type: 'wgs84',
        success: (data) => {
          let p = {
            id: 0,
            latitude: data.latitude,
            longitude: data.longitude,
            width: 30,
            height: 30,
            iconPath: "/static/mapicon.png"
          }
          this.markers.push(p)
          //  根据位置获取附近10公里的救援师傅
          Bmob_QueryLocation('userInfo',data.latitude,data.longitude,10,'location','0').then(res => {
            if(res.length > 0){
              //  附近有师傅
              for(let i = 0;i< res.length;i++){
                let temp = {
                  id: i+1,
                  latitude: res[i].location.latitude,
                  longitude: res[i].location.longitude,
                  width: 30,
                  height: 30,
                  iconPath: "/static/mapicon.png"
                }
                this.markers.push(temp)
              }
              console.log(this.markers)
            }else{
              self.$mptoast('附近暂无救援师傅，请联系客服')
            }
          }).catch(err => {
            console.log(err)
          })
        },

      })
    },
  }
}
</script>

<style lang="scss" scoped>
.tip{
  margin: 10px;
  font-size: 14px;
  color: #999;
}
</style>

