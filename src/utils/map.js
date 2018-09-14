
const QQMapWX = require('./qqmap-wx-jssdk.min.js');
const qqmapsdk = new QQMapWX({
  key: 'ENNBZ-ZKKLV-ACYPX-UVJM3-AK7UO-S7FQG'
});
const debug = true
//  地点搜索
export function map_search(keyword){
  return new Promise((resolve,reject) => {
    qqmapsdk.search({
      keyword: keyword,
      success:(res) => {
       debug && console.log(res);
        resolve(res)
      },
      fail: function(res) {
        debug && console.log(res);
        reject(res)
      }
    })
  })
}

//  关键词输入提示
export function map_getSuggestion(keyword){
  return new Promise((resolve,reject) => {
    qqmapsdk.getSuggestion({
      keyword: keyword,
      region: '长沙市',
      success:(res) => {
        debug && console.log(res);
        resolve(res)
      },
      fail: function(res) {
        debug && console.log(res);
        reject(res)
      }
    })
  })
}
//  逆地址解析
// 本接口提供由坐标到坐标所在位置的文字描述的转换，输入坐标返回地理位置信息和附近poi列表。
export function map_reverseGeocoder(latitude,longitude){
  return new Promise((resolve,reject) => {
    qqmapsdk.reverseGeocoder({
      location: {
        latitude: latitude,
        longitude: longitude
      },
      success: (res) => {
        debug && console.log(res);
        resolve(res)
      },
      fail: (res) => {
        debug && console.log(res);
        reject(res)
      }
    })
  })
}

// 提供由地址描述到所述位置坐标的转换，与逆地址解析reverseGeocoder()的过程正好相反。
// 地址（注：地址中请包含城市名称，否则会影响解析效果），如：'北京市海淀区彩和坊路海淀西大街74号'
export function map_geocoder(address){
  return new Promise((resolve,reject) => {
    qqmapsdk.geocoder({
      address:address,
      success: (res) => {
        debug && console.log(res);
        resolve(res)
      },
      fail: (res) => {
        debug && console.log(res);
        reject(res)
      }
    })
  })
}
//  距离计算
export function map_calculateDistance(from,to){
  return new Promise((resolve,reject) => {
    qqmapsdk.calculateDistance({
      mode: 'driving',
      from: from,
      to: to,
      success: (res) => {
        debug && console.log(res);
        let result ={
          distance: 0,
          duration: 0
        }
        if(res.status === 0){
          let e = res.result.elements[0]
          result.distance = Math.ceil(e.distance / 1000)
          result.duration = Math.ceil(e.duration / 60)
        }
        resolve(result)
      },
      fail: (res) => {
        debug && console.log(res);
        reject(res)
      }
    })
  })
}
//  获取全国城市列表数据。
export function map_getCityList(){
  return new Promise((resolve,reject) => {
    qqmapsdk.getCityList({
      success: (res) => {
        debug && console.log(res);
        resolve(res)
      },
      fail: (res) => {
        debug && console.log(res);
        reject(res)
      }
    })
  })
}
//  获取城市区县
export function map_getDistrictByCityId(id){
  return new Promise((resolve,reject) => {
    qqmapsdk.getDistrictByCityId({
      id: id,
      success: (res) => {
        debug && console.log(res);
        resolve(res)
      },
      fail: (res) => {
        debug && console.log(res);
        reject(res)
      }
    })
  })
}
export default qqmapsdk
