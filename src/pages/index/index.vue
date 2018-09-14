<template>
  <div class="page-content">
    <div :class="{'pickerMask':isShowMask}"></div>
    <div class="weui-navbar">
      <block v-for="(item,index) in tabs" :key="index">
        <div :id="index" :class="{'weui-bar__item_on':activeIndex == index}" class="weui-navbar__item" @click="tabClick">
          <div class="weui-navbar__title">{{item}}</div>
        </div>
      </block>
      <div class="weui-navbar__slider" :class="navbarSliderClass"></div>
    </div>
    <div class="weui-tab__panel">
      <div class="weui-tab__content" :hidden="activeIndex != 0">
        <img src="http://bmob-cdn-20712.b0.upaiyun.com/2018/08/26/a10f8e79403974148078dfbc768c130f.jpeg" alt="">
        <div class="row row-no-padding car-price">
          <div class="col">200元(10公里)</div>
          <div class="col">7.0元/公里</div>
          <!-- <div class="col">500公斤</div> -->
        </div>
        <div class="row row-no-padding car-detail">
          <div class="col">起步价</div>
          <div class="col">超里程费</div>
          <!-- <div class="col">载重</div> -->
        </div>
      </div>
      <div class="weui-tab__content" :hidden="activeIndex != 1">
        <img src="http://bmob-cdn-20712.b0.upaiyun.com/2018/08/26/a10f8e79403974148078dfbc768c130f.jpeg" alt="">
        <div class="row row-no-padding car-price">
          <div class="col">200元(10公里)</div>
          <div class="col">5.0元/公里</div>
          <!-- <div class="col">1吨</div> -->
        </div>
        <div class="row row-no-padding car-detail">
          <div class="col">起步价</div>
          <div class="col">超里程费</div>
          <!-- <div class="col">载重</div> -->
        </div>
      </div>


      <div class="car-content">
        <div class="car-time" @click="chooseTime">
          <img class="img1" src="http://bmob-cdn-20712.b0.upaiyun.com/2018/08/25/479ad44d403b83e980b9122ffa488898.png" alt="">
          <img class="img2" src="http://bmob-cdn-20712.b0.upaiyun.com/2018/08/25/22d4e4ba4074b08980f7bb78e9eae6bb.png" alt="">
          <p>用车时间 <span style="font-size:14px;color:red;">{{curDate}}</span> </p>
        </div>
        <div class="car-time">
          <img class="img-from" src="http://bmob-cdn-20712.b0.upaiyun.com/2018/08/25/3cbe168e40d28ffd80202cf2aacb19a9.png" alt="">
          <img class="img2" src="http://bmob-cdn-20712.b0.upaiyun.com/2018/08/25/22d4e4ba4074b08980f7bb78e9eae6bb.png" alt="">
          <input type="text" v-model="addressFrom.title" placeholder="请输入起点"  @click="addressChange(1)">
          <!-- <button></button> -->
        </div>
        <div class="car-time">
          <img class="img-from" src="http://bmob-cdn-20712.b0.upaiyun.com/2018/08/25/9869ee6340320453801bb9761856a235.png" alt="">
          <img class="img2" src="http://bmob-cdn-20712.b0.upaiyun.com/2018/08/25/22d4e4ba4074b08980f7bb78e9eae6bb.png" alt="">
          <input type="text" v-model="addressTo.title" placeholder="请输入终点" @click="addressChange(2)">
        </div>
      </div>
      <div class="fee">
        <div class="price">约 <span style="font-size:28px;"> {{money}} </span>元</div>
        <div class="price-detail">实际费用可能因实际行驶里程\等候时间等因素而异</div>
      </div>
    </div>

    <div class="weui-picker" :class="{'weui_picker_view_show':pickerShow}">
      <div class="weui-picker__hd">
        <div href="javascript:;" class="weui-picker__action" @click="pickerCancel">取消</div>
        <div href="javascript:;" class="weui-picker__action" @click="pickerConfirm">确定</div>
      </div>
      <picker-view indicator-style="height: 40px;" :value="pickerValue" class="weui_picker_view" @change="pickerChange">
        <picker-view-column>
          <div class="picker-item" v-for="(item,index) in columuOne" :key="index">{{item}}</div>
        </picker-view-column>
        <picker-view-column>
          <div class="picker-item" v-for="(item,index) in columnTwo" :key="index">{{item}}时</div>
        </picker-view-column>
         <picker-view-column>
          <div class="picker-item" v-for="(item,index) in columnThree" :key="index">{{item}}</div>
        </picker-view-column>
      </picker-view>
    </div>
    <div class="fee tips">
      <ul>
        <li>下单后，为你匹配距你最近的救援师傅，最快5～20分钟到达</li>
        <li>请保持通话顺畅，以便救援师傅能及时联系上你</li>
        <li>上面计算费用不包含过路费/过桥费等其它费用</li>
      </ul>
    </div>

    <div class="btn">
      <button type="primary" @click="toCall()" :disabled="money<=0"> 立即救援 </button>
    </div>
  </div>
</template>

<script>
import { map_calculateDistance } from '@/utils/map.js'
// import { Bmob_Add, sendMsg } from '@/utils/bmob_init.js'
import store from './store'
export default {
  data () {
    return {
      tabs: ["市内救援", "长途运输"],
      activeIndex: 0,
      fontSize: 30,
      pickerShow: false,
      isShowMask: false,
      columuOne: [],
      columnTwo: [],
      columnThree: ['00分','15分','30分','45分'],
      pickerValue: [0, 0,0],
      curHours: '',
      curDate: '现在',
      addressFrom: {},
      addressTo: {},
      money: 0,
      moneyObj: { 0: 7, 1: 5 },
    }
  },

  mounted () {
    let p = this.$root.$mp.query,address = {}
    if(p.type){
      address = JSON.parse(p.address)
      this.curDate = !!store.getters.getCurDate ? store.getters.getCurDate : '现在'
      if(p.type === '1'){
        store.commit('setAddressFrom',address)
        this.addressFrom = address
        //  从store 里获取addressTo的信息
        this.addressTo = store.getters.getAddressTo
        console.log(this.addressTo)
        if(this.addressTo.title){
          //  调用计算距离点接口
          this.calDistance()
        }
      }else{
        this.addressTo = address
        store.commit('setAddressTo',address)
        this.addressFrom = store.getters.getAddressFrom
        console.log(this.addressFrom)
        if(this.addressFrom.title){
          //  调用计算距离点接口
          this.calDistance()
        }
      }
    }else{
      this.calTime()
    }

  },
  computed: {
    navbarSliderClass() {
      if (this.activeIndex == 0) {
        return 'weui-navbar__slider_0'
      }
      if (this.activeIndex == 1) {
        return 'weui-navbar__slider_1'
      }
    }
  },

  methods:{
    toCall(){
      let username = wx.getStorageSync('username')
      let from = this.addressFrom
      let to = this.addressTo
      //  创建订单
      let form = {
        username: username,
        fromAddress: from.title,
        fromAddressDetail: from.address,
        toAddress: to.title,
        toAddressDetail: to.address,
        fromLat: from.location.lat,
        fromLng: from.location.lng,
        toLat: to.location.lat,
        toLng: to.location.lng,
        time: this.curDate,
        status: '0',
        money: this.money
      }
      console.log(this.form)
      Bmob_Add('banJiaOrder',form).then(res => {
        wx.redirectTo({
          url: '../yysuccess/main'
        })
        //  短信通知
        sendMsg(this.config.banjiaMobile).then(r => {

        })
      }).catch(err => {

      })

    },
    calDistance(){
      let from = {
        latitude: this.addressFrom.location.lat,
        longitude: this.addressFrom.location.lng
      }
      let to = [{
        latitude: this.addressTo.location.lat,
        longitude: this.addressTo.location.lng
      }]
      map_calculateDistance(from,to).then(res => {
        this.money = res.distance<=10 ? 200 : (res.distance - 10) * this.moneyObj[this.activeIndex] + 200
      })
    },
    addressChange(type){
      wx.redirectTo({
        url: '../chooseAddress/main?type='+ type + '&path=index'
      })
    },
    pickerChange(e){
      let value = e.mp.detail.value;
      if(value[0] !== this.pickerValue[0]){
        if(value[0] === 0){
          this.calHours(this.curHours)
        }else{
          this.calHours(0)
        }
        this.pickerValue[1] = 0;
      }
      this.pickerValue = value;

    },
    chooseTime(){
      this.calHours(this.curHours)
      this.isShowMask = true;
      this.pickerShow = true;
    },
    calHours(hours){
      this.columnTwo = []
      for(let i = hours;i<24;i++){
        this.columnTwo.push((i<10?'0':'')+i)
      }
    },
    calTime(){
      let cur = new Date()
      // this.curDate = (cur.getMonth()+1) + '月' + cur.getDate() +'日' + cur.getHours() + '时'
      this.curHours = cur.getHours()
      this.columuOne =[]
      for(let i = 0;i<5;i++){
        this.columuOne.push((cur.getMonth()+1) + '月' + (cur.getDate()+i) +'日')
      }
    },
    tabClick(e) {
      console.log(e);
      this.activeIndex = e.currentTarget.id;
      if(this.money>0){
        this.calDistance()
      }
    },
    pickerConfirm() {
      this.curDate = this.columuOne[this.pickerValue[0]] + this.columnTwo[this.pickerValue[1]] + '时' + this.columnThree[this.pickerValue[2]]
      store.commit('setCurDate',this.curDate)
      this.isShowMask = false;
      this.pickerShow = false;
    },
    pickerCancel() {
      this.isShowMask = false;
      this.pickerShow = false;
    },
  }
}
</script>

<style lang="scss" scoped>
  .page-content{
    padding-bottom: 70px;
    .page-top{
      height: 200px;
      img{
        // width: 100%;
        height: inherit;
      }
    }
    min-height: 100%;
    // background: #fff;
    .weui-grid__icon{
      width: 100rpx;
      height: 100rpx;
    }
    .weui-tab__content {
      text-align: center;
      background:#fff;
      img{
        // width:100%;
        height:125px;
      }
      .car-price{
        font-size: 14px;
      }
      .car-detail{
        font-size: 12px;
        color: #888;
      }
    }
    .weui-navbar__slider_0 {
      left: 29rpx;
      transform: translateX(10px);
    }
    .weui-navbar__slider_1 {
      left: 29rpx;
      transform: translateX(400rpx);
    }
    .weui-navbar__slider{
      width: 7.4em;
    }
    .car-content{
      background: #fff;
      margin-top: 10px;
      .car-time{
        line-height: 50px;
        border-bottom: 1px solid #eaeaea;
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
          // height: 23px;
          float: right;
        }
        .img-from{
          width:10px;
          height:10px;
          margin:20px;
          float: left;
        }
        input{
          height: 50px;
        }

      }
    }
    .fee{
      margin: 10px;
      background: #fff;
      border-radius: 5px;
      .price{
        color: red;
        text-align: center;
        height: 80px;
        line-height: 80px;
        span{
          font-size: 18px;
        }
      }
      .price-detail{
        font-size: 13px;
        color: #888;
        border-top: 1px solid #eaeaea;
        text-align: center;
        padding: 10px 0;
      }
    }
    .tips{
      font-size: 13px;
      color: #999;
      padding: 10px;
    }
    .pickerMask {
      position: fixed;
      z-index: 1000;
      top: 0;
      right: 0;
      left: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.6);
    }
    .weui-picker {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    transition: all 0.3s ease;
    transform: translateY(100%);
    z-index: 3000;
  }
  .weui_picker_view {
    position: relative;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 238px;
    background-color: rgba(255, 255, 255, 1);
  }
  .weui-picker__hd {
    display: flex;
    padding: 9px 15px;
    background-color: #fff;
    position: relative;
    text-align: center;
    font-size: 17px;
  }
  .weui-picker__action {
    display: block;
    flex: 1;
    color: #1aad19;
    cursor: pointer;
  }
  .weui-picker__action:first-child {
    text-align: left;
    color: #888;
  }
  .weui-picker__action:last-child {
    text-align: right;
  }
  .weui-picker__hd:after {
    content: " ";
    position: absolute;
    left: 0;
    bottom: 0;
    right: 0;
    height: 1px;
    border-bottom: 1px solid #e5e5e5;
    color: #e5e5e5;
    transform-origin: 0 100%;
    transform: scaleY(0.5);
  }
  .weui_picker_view_show {
    transform: translateY(0);
  }
  .picker-item {
    text-align: center;
    line-height: 40px;
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
</style>

