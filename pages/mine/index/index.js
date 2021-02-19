// pages/mine/index/index.js
import Router from '../../../utils/router'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    avatar: '',
    isLogin: true,
    showNumber: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const token = wx.getStorageSync('token')
    if (!token) {
      this.setData({
        isLogin: false
      })
    } else {
      const userInfo = wx.getStorageSync('userInfo')
      const showNumber = userInfo.mobile.slice(0, 3) + '****' + userInfo.mobile.slice(-4)
      this.setData({
        showNumber,
        isLogin: true,
        avatar: userInfo.avatar
      })
    }
  },

  /**
   * 跳转登录页面
   */
  goLoginPage() {
    Router.loginPage()
  },

  /**
   * 跳转客服页面
   */
  goService() {
    Router.servicePage()
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
    const token = wx.getStorageSync('token')
    if (token) {
      const userInfo = wx.getStorageSync('userInfo')
      const showNumber = userInfo.mobile.slice(0, 3) + '****' + userInfo.mobile.slice(-4)
      this.setData({
        showNumber,
        isLogin: true,
        avatar: userInfo.avatar
      })
    }
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

  }
})