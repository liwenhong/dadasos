<template>
  <div>
    <mptoast />
    <map id="map" :longitude="longitude" :latitude="latitude" scale="15" bindcontroltap="controltap" :markers="markers" bindmarkertap="markertap"  show-location style="width: 100%; height: 250px;"></map>

    <view class="weui-form-preview" v-for="(item,index) in order" :key="index">
      <view class="weui-form-preview__hd">
          <view class="weui-form-preview__label">{{status[item.status]}}</view>
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
              <view class="weui-form-preview__value" v-if="!!item.carUser && !!item.carUser.nickName">{{item.carUser.nickName}}</view>
              <view class="weui-form-preview__value" v-else>暂无师傅接单</view>
          </view>
          <view class="weui-form-preview__item">
              <view class="weui-form-preview__label">离您距离</view>
              <view class="weui-form-preview__value" v-if="!!item.carUser && !!item.carUser.location">{{item.distance}}公里</view>
              <view class="weui-form-preview__value" v-else>暂无</view>
          </view>
          <view class="weui-form-preview__item">
              <view class="weui-form-preview__label">预计到达时间</view>
              <view class="weui-form-preview__value" v-if="!!item.carUser && !!item.carUser.location">{{item.duration}}分钟</view>
              <view class="weui-form-preview__value" v-else>暂无</view>
          </view>
      </view>
      <view class="weui-form-preview__ft">
          <a v-if="item.status === '3'" @click="toPay()" class="weui-form-preview__btn weui-form-preview__btn_default" hover-class="weui-form-preview__btn_active">立即支付</a>
          <a v-else @click="cancelOrder()" class="weui-form-preview__btn weui-form-preview__btn_default" hover-class="weui-form-preview__btn_active">取消订单</a>
          <a v-if="!!item.carUser && !!item.carUser.location" @click="toCall()" class="weui-form-preview__btn weui-form-preview__btn_primary" hover-class="weui-form-preview__btn_active">联系师傅</a>
          <a v-else @click="toCall()" class="weui-form-preview__btn weui-form-preview__btn_primary" hover-class="weui-form-preview__btn_active">联系客服</a>
      </view>
    </view>
    <div class="tip">
      * 如订单超过五分钟没有师傅接单，请主动联系客服，为你指派离你最近的救援师傅。
    </div>
  </div>
</template>

<script>
import { map_getSuggestion, map_calculateDistance, transferLocation } from '@/utils/map.js'
import { Bomb_Search, Bmob_IncludeQuery, Bmob_QueryLocation, Bmob_Update, sendMsg, Bmob_CreatePoint, Bmob_Add } from '@/utils/bmob_init.js'
import mptoast from 'mptoast'
export default {
  data () {
    return {
      orderId: '',//  订单编号
      order:[],
      latitude:0,
      longitude:0,
      markers: [],
      status:{'-1':'已取消','0':'等待救援','1':'师傅已接单','2':'救援中','3':'等待支付','4':'救援完成'}
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
      this.orderId = obj.objectId
      this.getOrderInfo(obj.objectId).then(res => {
        console.log(res)
      })
    }else{
      this.$mptoast('未找到订单')
    }
  },
  methods: {
    toPay(){
      wx.showLoading()
      //  支付，支付完成后更改车主状态，添加车主流水记录-----未对接支付，此处模拟支付
      Bmob_Update('Order',this.orderId,{ 'status': '4'}).then(data => {
        let uPoint =  Bmob_CreatePoint('_User',this.order[0].carUser.user.objectId)
        let ls ={
            type: 1,
            amount: parseInt((this.order[0].amount * 0.9).toFixed(2)),
            user: uPoint,
            status: '0',
            mobile:this.order[0].carUser.username,
            username:this.order[0].carUser.nickName,
            carNumber: this.order[0].carUser.carNumber,
          }
          if(!!this.order[0].carUser.company && this.order[0].carUser.company.objectId !=""){
            ls.company = this.order[0].carUser.company
          }
          console.log(ls)
          //  添加流水
          Bmob_Add('bankAccount',ls).then(t => {
            console.log('流水添加成功')
          })
          //  更改救援师傅状态
          Bmob_Update('userInfo',this.order[0].carUser.objectId,{status:'0'}).then(r => {
            console.log()
          })
          wx.hideLoading()
          wx.redirectTo({
            url: '../index/main'
          })
      })
    },
    //  取消订单
    cancelOrder(){
      this.getOrderInfo(this.orderId).then(res => {
        //  判断订单状态
        if(res.length > 0){
          let status = res[0].status
          let mobile = (!!res[0].carUser && !!res[0].carUser.username) ? res[0].carUser.username:''
          let objId =  (!!res[0].carUser && !!res[0].carUser.objectId) ? res[0].carUser.objectId:''
          console.log('.............')
          console.log(status,'....',mobile,'....',objId)
          this.changeOrderStatus(status,mobile,objId).then(data => {

          })
        }
      })
    },
    changeOrderStatus(type,mobile,cObjectId){
      return new Promise((resolve,reject) => {
        wx.showLoading()
        Bmob_Update('Order',this.orderId,{ 'status': '-1'}).then(data => {
          this.$mptoast("订单取消成功")

          if((type === '1' || type === '2') && mobile !=''){
            // 通知救援师傅，订单取消了 订单取消
            sendMsg(mobile,'订单取消').then(tt => {
              //  更改师傅状态
              Bmob_Update('userInfo',cObjectId,{'status':'0'}).then(n => {

              })
            }).catch(err => {
              //  短信告知师傅失败
            })
          }else if(type === '3'){
            this.$mptoast("该订单已经不可取消")
            return
          }
           wx.redirectTo({
            url: '../index/main'
           })
          wx.hideLoading();
        }).catch(err => {
          wx.hideLoading();
          this.$mptoast("订单取消失败，稍后再试")
          reject(err)
        })
      })

    },
    toCall(){
      wx.makePhoneCall({
        phoneNumber: '18575501087'
      })
    },
    getOrderInfo(orderId){
      console.log(orderId)
      return new Promise((resolve,reject) => {
        wx.showLoading();
        Bmob_IncludeQuery('Order',{ objectId: orderId },{ 'carUser': 'userInfo' }).then(res => {
          console.log(res)
          if(res.length > 0){
            this.order = res
            if(!!res[0].carUser && res[0].carUser.location){
              this.order = []
              map_calculateDistance(res[0].locationFrom,[res[0].carUser.location]).then(da => {
                res[0].distance = da.distance
                res[0].duration = da.duration
                this.order = res
                wx.hideLoading();
                resolve(this.order)
              }).catch(error => {
                wx.hideLoading();
                console.log(error)
              })
            }else{
              resolve(this.order)
            }
            wx.hideLoading();

          }
        }).catch(err => {
          console.log(JSON.stringify(err))
          reject(err)
          wx.hideLoading();
        })
      })
    },
    getLocation(){
      let self = this
      this.markers = []
      wx.getLocation({
        type: 'wgs84',
        success: (data) => {
          transferLocation(data.latitude,data.longitude).then(d => {
            let p = {
              id: 0,
              latitude: d[1],
              longitude: d[0],
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

                // self.$mptoast('附近暂无救援师傅，请联系客服')
              }
            }).catch(err => {
              console.log(err)
            })
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

