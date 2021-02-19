// pages/login/register/index.js
import Router from "../../../utils/router";
import LoginService from '../../../service/LoginService';

const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    mobile: '',
    is_show: false,
    length: 4,        //输入框个数
    isFocus: true,    //聚焦
    value: "",        //输入的内容
    time: 60,
    currentTime: 60
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const time = app.globalData.time
    this.setData({
      is_show: true,
      mobile: options.mobile
    })
    if (time == 0) {
      LoginService.getVerifyCode(this.data.mobile)
    } else {
      this.setData({
        time,
        currentTime: time,
      })
    }
    this.getCode()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    if (this.data.time != 0) {
      app.globalData.time = this.data.time
    }
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  /**
   * 验证码倒计时
   */
  getCode: function () {
    var that = this;
    var currentTime = that.data.currentTime
    const interval = setInterval(function () {
      currentTime--;
      that.setData({
        time: currentTime
      })
      if (currentTime <= 0) {
        clearInterval(interval)
        that.setData({
          currentTime: 60,
          is_show: false
        })
      }
    }, 1000)
  },
  /**
   * 验证码赋值
   */
  Focus(e) {
    var that = this;
    var inputValue = e.detail.value;
    that.setData({
      value: inputValue,
    })
    this.loginInVerifCode()
  },
  /**
   * 输入框聚焦
   */
  Tap() {
    var that = this;
    that.setData({
      isFocus: true,
    })
  },
  /**
   * 返回
   */
  goBack: function () {
    wx.navigateBack({
      delta: 1
    });
  },
  /**
   * 验证码登录
   */
  async loginInVerifCode() {
    if (this.data.value.length === 4) {
      this.setData({
        last_time: 0
      })
      const data = await LoginService.mobileCodeLogin({
        mobile: this.data.mobile,
        mobileCode: this.data.value
      })
      if (data) {
        Router.homePage()
      }
    }
  },
  /**
   * 重新获取验证码
   */
  reClickVerify: function () {
    if (!this.data.is_show) {
      this.setData({
        time: 60,
        is_show: !this.data.is_show
      })
      this.getCode()
      LoginService.getVerifyCode(this.data.mobile)
    }
  }
})