// pages/login/index/index.js
import Router from "../../../utils/router";
import LoginService from '../../../service/LoginService';

const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    mobile: '',
    disabled: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
 
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
   * 设置手机号码
   */
  bindKeyInput: function(e){
    this.setData({
      mobile: e.detail.value
    })
    if(e.detail.value.length === 11){
      this.setData({
        disabled: false
      })
    }
  },
  /**
   * 跳转验证码界面
   */
  onJumpRegister: function(){
    Router.registerPage(this.data.mobile)
  }
})