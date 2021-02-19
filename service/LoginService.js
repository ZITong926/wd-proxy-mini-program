import Http from '../utils/http'
import Tips from '../utils/tips'
import { formdata } from '../utils/util'
import BaseService from './BaseService'

const app = getApp()

class LoginService extends BaseService {

  getVerifyCode(mobile) {
    const url = `${this.publicUrl}/user/sendVerifyCode`;
    const params = formdata({
      mobile,
      userType: 2
    })
    return Http.post(
      url,
      params,
      { "content-type": "multipart/form-data; boundary=XXX" }
    ).then(data => {
      return data;
    }).catch((err) => {
      Tips.error(err.msg)
      return false
    })
  }

  mobileCodeLogin(obj) {
    const url = `${this.publicUrl}/user/mobileCodeLogin`;
    const params = formdata({
      ...obj,
      userType: 2
    })
    return Http.post(
      url,
      params,
      { "content-type": "multipart/form-data; boundary=XXX" }
    ).then(data => {
      app.globalData.userInfo = data
      app.globalData.token = data.token
      wx.setStorageSync('token', data.token)
      wx.setStorageSync('userInfo', data)
      return data
    }).catch(err => {
      Tips.error(err.msg)
      return false
    })
  }

}

export default new LoginService()