<template>
  <div>
    <div class="tip">
      <!--阴影遮罩-->
      <div class="backdrop"></div>
      <div class="tiparea">
        <div class="content">
          <div class="contentarea">
            <h3 class="title">{{title}}</h3>
            <p class="subtitle">{{subtitle}}</p>
          </div>

          <div class="row">
            <div class="col" @click="doSomething(false)">
              取消
            </div>
            <div class="col" @click="doSomething(true)">
              确定
            </div>
          </div>

        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props:{
    title:String,
    subtitle: String
  },
  methods:{
    doSomething(val){
      this.$emit('confirm',val)
    }
  }
}
</script>
<style lang="scss" scoped>
.tip {
    height: 400px;
    overflow: hidden;
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
    .tiparea {
      border-radius: 5px;
      z-index: 999;
      background: #ffffff;
      position: fixed;
      top: 30%;
      left: 10%;
      margin: 0 auto;
      right: 10%;
      .content {
        height: 200px;
        text-align: center;
        position: relative;
        .contentarea {
          position: absolute;
          top: 18%;
          left: 0;
          bottom: 0;
          right: 0;
          h3 {
            color: #373f52;
            font-size: 18px;
            font-weight: bold;
            margin-top: 0;
          }
          p {
            color: #5f6575;
            font-size: 16px;
            margin-top: 12px;
            padding: 0 10px;
          }
        }

        .row {
          position: absolute;
          bottom: 0;
          width: 100%;
          height: 50px;
          line-height: 50px;
          border-top: 1px solid #f2f2f2;
          padding:0;
          font-size: 14px;
          .col {
            font-size: 1.4em;
            padding: 0;
          }
          .col:first-child {
            color: #333;
          }
          .col:nth-child(2) {
            background: #f76754;
            color: #fff;
          }

        }
        .col-100{
            width:100%;
            background: #f76754;
            color: #fff !important;
          }
      }
    }
  }
</style>



