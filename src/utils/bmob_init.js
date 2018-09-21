var Bmob = require('./bomb')
Bmob.initialize('1245fbae9dd53f523ac14b293ee5dc60', '590809d4a7db3777c5647c2f8f17fd88')
console.log('bmob init!!!')
const debug = true
/**
 * 查询--通过主键获取一行记录
 * @param {表名称} table
 * @param {主键id} objectId
 */
export function Bmob_QueryByObjectId(table,objectId){
  return new Promise((resolve,reject) => {
    const query = Bmob.Query(table);
    query.get(objectId).then(res => {
     debug && console.log(res)
     resolve(res)
    }).catch(err => {
      console.log(err)
      reject(err)
    })
  })
}
 /**
 * 根据条件查询数据
 * @param table 表名称
 * @param params 查询参数
 */
export function Bomb_Search(table,params){
  return new Promise((resolve,reject) => {
    const query = Bmob.Query(table);
    for(let key in params){
      query.equalTo(key,"==", params[key])
    }
    query.find().then(t => {
      debug && console.log(t)
      resolve(t)
    }).catch(error => {
      reject(error)
    })
  })
}
export function Bomb_Order(params){
  return new Promise((resolve,reject) => {
    const query = Bmob.Query('Order');
    const query1 = query.equalTo('status',"==", '0')
    const query2 = query.equalTo('status',"==", '1')
    const query3 = query.equalTo('status',"==", '2')
    query.or(query1, query2,query3);
    for(let key in params){
      query.equalTo(key,"==", params[key])
    }
    query.find().then(t => {
      debug && console.log(t)
      resolve(t)
    }).catch(error => {
      reject(error)
    })
  })
}
/**
 * 新增一行记录
 * @param {表名称} table
 * @param {添加的对象}} params
 */
export function Bmob_Add(table,params){
  return new Promise((resolve,reject) => {
    const query = Bmob.Query(table);
    for(let key in params){
      query.set(key,params[key])
    }
    query.save().then(res => {
      debug &&  console.log(res)
      resolve(res)
    }).catch(err => {
      console.log(err)
      reject(err)
    })
  })
}

/**
 * 修改一行记录
 * @param {表名称} table
 * @param {主键ID} objectId
 */
export function Bmob_Update(table,objectId,params){
  return new Promise((resolve,reject) => {
    const query = Bmob.Query(table);
    query.get(objectId).then(res => {
      debug && console.log(res)
      for(let key in params){
        res.set(key, params[key])
      }
      res.save()
      resolve('success')
    }).catch(err => {
      console.log(err)
      reject(err)
    })
  })
}
/**
 * 删除一行记录
 * @param {表名称} table
 * @param {逐渐ID} objectId
 */
export function Bmob_Del(table,objectId){
  return new Promise((resolve,reject) => {
    const query = Bmob.Query(table);
    query.destroy(objectId).then(res => {
      debug && console.log(res)
      resolve(res)
    }).catch(err => {
      console.log(err)
      reject(err)
    })
  })
}
/**
 * 查询所有数据
 * @param {表名称} table
 */
export function Bmob_QueryAll(table){
  return new Promise((resolve,reject) => {
    const query = Bmob.Query(table);
    query.find().then(res => {
      debug && console.log(res)
      resolve(res)
    }).catch(error => {
      console.log(error)
      reject(error)
    })
  })
 }
/**
 * 分页查询
 * @param {表名称} table
 * @param {页面数据大小} limit
 * @param {当前页数} curpage
 * @param {排序字段} order
 */
export function Bmob_QueryLimit(table,limit,curpage,order){
  return new Promise((resolve,reject) => {
    const query = Bmob.Query(table);
    query.limit(limit)
    query.skip((curpage-1) * limit)
    order && query.order(order)
    query.find().then(res => {
      debug && console.log(res)
      resolve(res)
    }).catch(err => {
      reject(err)
    })

  })
}

/**
 * 发送短信
 * @param {发送短信的号码} mobile
 */
export function sendMsg(mobile,template){
  return new Promise((resolve,reject) => {
    let params = {
      mobilePhoneNumber: mobile,
      template: template
    }
    Bmob.requestSmsCode(params).then(function (response) {
        console.log(response);
        resolve(response)
    })
    .catch(function (error) {
        console.log(error);
        reject(error)
    });
  })

}
/**
 * 验证短信验证码
 * @param mobile 手机号码
 * @param smsCode 短信验证码
 */
export function verifySmsCode(mobile,smsCode){
  return new Promise((resolve,reject) => {
    let data = {
      mobilePhoneNumber: mobile
    }
    Bmob.verifySmsCode(smsCode, data).then(function (response) {
      console.log(response);
      resolve(response)
    })
    .catch(function (error) {
      reject(error)
      console.log(error);
    });
  })
}
/**
 * 查询Pointer 关联表数据
 * @param table 表名
 * @param params 参数
 */
export function Bmob_IncludeQuery(table,params,include){
  return new Promise((resolve,reject) => {
    const query = Bmob.Query(table);
    for(let y in include){
      query.include(y,include[y])
    }
    for(let key in params){
      query.equalTo(key,"==",params[key])
    }
    query.find().then(res => {
      debug && console.log(res)
      resolve(res)
    }).catch(err => {
      debug && console.log(err)
      reject(err)
    })
  })
}
/**
 * 创建地理位置
 * @param latitude 纬度
 * @param longitude 经度
 */
export function Bmob_CreateLocation(latitude,longitude){
  return Bmob.GeoPoint({ latitude: latitude,longitude: longitude })
}
/**
 * 创建数据关联表
 * @param table 表名
 * @param objectId ID
 */
export function Bmob_CreatePoint(table,objectId){
  const pointer = Bmob.Pointer(table)
  const poiID = pointer.set(objectId)
  return poiID
}
/**
 * 获取当前用户信息---登录后才有值
 */
export function getUserInfo(){
  return new Promise((resolve,reject) => {
    resolve(Bmob.User.current())
  })
}
/**
 * 根据地理位置查询附近救援师傅
 * @param table 表名
 * @param latitude 维度
 * @param langitude 经度
 * @param km 范围
 * @param key 地理位置字段名
 * @param status 师傅状态
 */
export function Bmob_QueryLocation(table,latitude,langitude,km = 10,key,status){
  return new Promise((resolve,reject) => {
    const point = Bmob.GeoPoint({ latitude: latitude,longitude: langitude })
    const query = Bmob.Query(table);
    query.withinKilometers(key, point, km);  //10指的是公里
    query.equalTo('status','==',status)
    query.find().then(res => {
      debug && console.log(res)
      resolve(res)
    }).catch(err => {
      debug && console.log(err)
      reject(err)
    })
  })
}
export function Bmob_Socket(table){
  let BmobSocketIo =new Bmob.Socket()
  //初始连接socket.io服务器后，需要监听的事件都写在这个函数内
  BmobSocketIo.onInitListen = function () {
    //订阅Chat表的数据更新事件
    BmobSocketIo.updateTable(table); //聊天记录表
  };

  //监听服务器返回的更新表的数据
  BmobSocketIo.onUpdateTable = (tablename, data) => {
    if (tablename == "Order") {
      console.log(data);
    }
  };
}
