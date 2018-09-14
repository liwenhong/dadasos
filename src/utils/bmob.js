import Bmob from "hydrogen-js-sdk";
export class Bmob_Serve{
  debug= true;
  constructor() {
    console.log('Hello Bmob_Serve is start....');
    //  初始化bmob
    Bmob.initialize('1245fbae9dd53f523ac14b293ee5dc60', '590809d4a7db3777c5647c2f8f17fd88')
  }
  /**
   * 获取当前用户信息---登录后才有值
   */
  getUserInfo(){
    return new Promise((resolve,reject) => {
      resolve(Bmob.User.current())
    })
  }
  /**
   * 发送短信验证码
   * @param mobile 电话号码
   * @param template 短信模版名称
   */
  sendSmsCode(mobile,template){
    return new Promise((resolve,reject) =>{
      let params = {
        mobilePhoneNumber: mobile, //string
        template: template
      }
      Bmob.requestSmsCode(params).then((response) => {
        response && resolve(response)
      })
      .catch((error) =>  {
        reject(error)
        console.log(error);
      });
    })
  }

  /**
   * 验证短信验证码
   * @param mobile 手机号码
   * @param smsCode 短信验证码
   */
  verifySmsCode(mobile,smsCode){
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
   * 登录
   * @param username 用户名
   * @param password 密码
   */
  login(username,password){
    return new Promise((resolve,reject) => {
      Bmob.User.login(username,password).then(res => {
        console.log(res)
        resolve(res)
      }).catch(err => {
       console.log(err)
       reject(err)
     });
    })
  }
  /**
   * 更新微信用户信息
   * @param {授权获取的用户信息} params
   */
  updateUserInfo(params){
    return new Promise((resolve,reject) => {
      Bmob.User.upInfo(params).then(result => {
        resolve(result)
      }).catch(err => {
        console.log(err)
        reject(err)
      })
    })
  }
  /**
   * 退出登录
   */
  logonOut(){
    return Bmob.User.logout()
  }
  /**
   * 查询--通过主键获取一行记录
   * @param {表名称} table
   * @param {主键id} objectId
   */
  Bmob_QueryByObjectId(table,objectId){
    return new Promise((resolve,reject) => {
      const query = Bmob.Query(table);
      query.get(objectId).then(res => {
      this.debug && console.log(res)
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
  Bmob_Update(table,objectId,params){
    return new Promise((resolve,reject) => {
      const query = Bmob.Query(table);
      query.get(objectId).then(res => {
        this.debug && console.log(res)
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
   * 根据条件查询数据
   * @param table 表名称
   * @param params 查询参数
   */
  Bomb_Search(table,params){
    return new Promise((resolve,reject) => {
      const query = Bmob.Query(table);
      for(let key in params){
        query.equalTo(key,"==", params[key])
      }
      query.find().then(t => {
        this.debug && console.log(t)
        resolve(t)
      }).catch(error => {
        reject(error)
      })
    })
  }
  /**
   * 添加数据
   * @param table 表名
   * @param params 参数
   */
  Bomb_Add(table,params){
    return new Promise((resolve,reject) => {
      const query = Bmob.Query(table);
      for(let key in params){
        query.set(key, params[key])
      }
      query.save().then(res => {
        this.debug && console.log(res)
        resolve(res)
      }).catch(err => {
        this.debug && console.log(err)
        reject(err)
      })
    })
  }
  /**
   * 查询Pointer 关联表数据
   * @param table 表名
   * @param params 参数
   */
  Bmob_IncludeQuery(table,params,include){
    return new Promise((resolve,reject) => {
      const query = Bmob.Query(table);
      query.include(include.key,include.value)
      for(let key in params){
        query.equalTo(key,'==',params[key])
      }
      query.find().then(res => {
        this.debug && console.log(res)
        resolve(res)
      }).catch(err => {
        this.debug && console.log(err)
        reject(err)
      })
    })
  }
  /**
   * 创建地理位置
   * @param latitude 纬度
   * @param longitude 经度
   */
  Bmob_CreateLocation(latitude,longitude){
    return Bmob.GeoPoint({ latitude: latitude,longitude: longitude })
  }
  /**
   * 修改地理位置
   * @param latitude 纬度
   * @param longitude 经度
   */
  Bmob_UpdateLocation(latitude,longitude,objectId,table,key){
    return new Promise((resolve,reject) => {
      const point = Bmob.GeoPoint({ latitude: latitude,longitude: longitude })
      const query = Bmob.Query(table)
      query.get(objectId).then(res => {
        res.set(key,point)
        res.save()
        resolve('success')
      }).catch(err => {
        reject(err)
      })
    })
  }
  /**
   * 根据地理位置查询附近的救援师傅
   * @param table 表名
   * @param latitude 纬度
   * @param langitude 经度
   * @param km 范围
   * @param key 地理位置字段名
   */
  Bmob_QueryLocation(table,latitude,langitude,km = 10,key,status,objectId){
    return new Promise((resolve,reject) => {
      const point = Bmob.GeoPoint({ latitude: latitude,longitude: langitude }) // 当前用户位置
      console.log(poiID);
      const query = Bmob.Query(table);
      query.withinKilometers(key, point, km);  //10指的是公里
      query.equalTo('status','==',status)
      query.find().then(res => {
        this.debug && console.log(res)
        resolve(res)
      }).catch(err => {
        this.debug && console.log(err)
        reject(err)
      })
    })
  }
  /**
   * 创建数据关联表
   * @param table 表名
   * @param objectId ID
   */
  Bmob_CreatePoint(table,objectId){
    const pointer = Bmob.Pointer(table)
    const poiID = pointer.set(objectId)
    return poiID
  }
}
