<script>
import qqmapsdk from './utils/map.js'
export default {
  created () {
    let self = this;
    //一键登录
    this.$Bmob.User.auth().then(res => {
      console.log('一键登陆成功')
      // console.log(res)
      // 获取位置信息
      wx.getLocation({
        type: 'gcj02',
        success: function (data) {
          //2、根据坐标获取当前位置名称，显示在顶部:腾讯地图逆地址解析
          qqmapsdk.reverseGeocoder({
            location: {
              latitude: data.latitude,
              longitude: data.longitude
            },
            success: function (addressRes) {
              var address = {}
              var address = addressRes.result.address_component;
              var location = addressRes.result.location;
              console.log(addressRes)
            }
          })
        }
      })
    }).catch(err => {
      console.log(err)
    });
  }
}
</script>

<style>
page{height:0;min-height:100%;background:#f5f5f5;}
.container {
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  /* padding: 200rpx 0; */
  box-sizing: border-box;
}
/* this rule will be remove */
* {
  transition: width 2s;
  -moz-transition: width 2s;
  -webkit-transition: width 2s;
  -o-transition: width 2s;
}
</style>
