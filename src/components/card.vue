<template>
  <div>
    <mptoast />
    <!--阴影遮罩-->
    <div class="backdrop"></div>

    <view class="weui-cells weui-cells_after-title tiparea">
      <div class="logo">
        <img src="http://bmob-cdn-20712.b0.upaiyun.com/2018/09/16/a9f1a554402e0b3f809909429d117c21.png" alt="">
      </div>
      <view class="weui-cell weui-cell_input card-input">
          <view class="weui-cell__hd">
              <view class="weui-label">手机号</view>
          </view>
          <view class="weui-cell__bd">
              <input class="weui-input" v-model.trim="mobile" placeholder="请输入手机号"/>
          </view>
      </view>
      <view class="weui-cell weui-cell_input weui-cell_vcode card-input">
          <view class="weui-cell__hd">
              <view class="weui-label">验证码</view>
          </view>
          <view class="weui-cell__bd">
              <input class="weui-input" v-model.trim="code" placeholder="请输入验证码" />
          </view>
          <view class="weui-cell__ft">
              <view class="weui-vcode-btn" @click="msg != '获取验证码'?'':getCode()">{{msg}}</view>
          </view>
      </view>
      <form report-submit="true" @submit="toAddOrder" >
        <!-- <button type="default" formType="submit" >发送</button> -->
        <button style="width:80%;margin-bottom:20px;" class="weui-btn" type="primary" formType="submit" :disabled="!(mobile.length===11 && code >2)">立即救援</button>
      </form>
    </view>
  </div>
</template>

<script>
import { sendMsg, verifySmsCode, getUserInfo, Bmob_Update } from '@/utils/bmob_init.js'
import mptoast from 'mptoast'
export default {
  // props: ["mobile","code"]
  data:function(){
    return {
      mobile: '',
      code: '',
      msg: '获取验证码',
      timer: null
    }
  },
  components:{
    mptoast
  },
  methods:{
    getCode(){
      if(!this.isMobile(this.mobile)){
        this.$mptoast("手机号码格式不正确")
        // wx.showToast({
        //     title: '手机号码格式不正确',
        //     icon:'',
        //     duration: 3000
        // });
        return
      }
      sendMsg(this.mobile,'注册').then(res => {
        //  发送成功
        let number = 180;
        this.timer = setInterval(() => {
          number--;
          if (number < 0) {
            this.msg = "获取验证码";
            clearInterval(this.timer);
          } else {
            this.msg = number + "s后重新获取";
          }
        }, 1000);
      }).catch(err => {
        this.$mptoast("验证码发送失败，请稍后再试")
        // wx.showToast({
        //   title:'验证码发送失败，请稍后再试',
        //   duration: 2000
        // })
      })
    },
    toAddOrder(e){
      //  此处做好判断
      if(this.code == undefined || this.code == ''){
        // wx.showToast({
        //     title: '请输入验证码',
        //     duration: 3000
        // });
        this.$mptoast("请输入验证码")
        return
      }
      console.log('form发生了submit事件，携带数据为：', e.mp.detail.formId)
      let objectId = this.$Bmob.User.current().objectId
      // console.log(objectId)
      // Bmob_Update('_User',objectId,{'phone':this.mobile,formId:e.mp.detail.formId}).then(res => {

      // })
      // this.$emit('addOrder',true)
      //  短信验证
      verifySmsCode(this.mobile,this.code).then(data => {
        //  验证成功
        !!this.timer && clearInterval(this.timer)
        //  更新用户表
        getUserInfo().then((res) => {
          // objectId = res.objectId
          Bmob_Update('_User',res.objectId,{phone:this.mobile,formId:e.mp.detail.formId }).then(da => {

          })
        })
        this.$emit('addOrder',true)
      }).catch(err => {
        if(err.code === 207){
          this.$mptoast("验证码错误")
        }else{
          this.$mptoast("验证码验证失败")
        }
      })
    },
    /**
     * 验证是否是手机号码
     * @param mobile 手机号码
     */
    isMobile(mobile) {
      if (mobile) {
        let moreg = /^1\d{10}$/;
        return moreg.test(mobile.trim());
      } else {
        return false;
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.card {
  padding: 10px;
}
.backdrop {
  position: fixed;
  z-index: 998;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background: rgba(153, 153, 153, 0.8);
  transition-duration: 400ms;
}
.logo{
  height: 48px;
  margin: 10px 0;
  img{
    width: 150px;
    height: inherit;
  }
}
.card-input{
  .weui-label{
    width:60px;
  }
}
.tiparea {
  border-radius: 5px;
  z-index: 999;
  background: #ffffff;
  position: fixed;
  top: 30%;
  left: 10%;
  margin: 0 auto;
  right: 10%;
}
</style>
