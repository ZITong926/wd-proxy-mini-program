// pages/shop/index/index.js
import Router from "../../../utils/router"
import TradeService from "../../../service/TradeService"

const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [],
    isLogin: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    const token = wx.getStorageSync('token')
    if (!token) {
      this.setData({
        list: [{
          customerId: 59,
          scoreBalance: "100000.00",
          vendorAvatar: "https://wdzhanggui-app.oss-cn-hangzhou.aliyuncs.com/avatar/f23243c331f9bb8099bf72fbc7e9e4b41598458561092",
          vendorId: 5,
          vendorNickName: "毛毛姐姐的店"
        }, {
          customerId: 57,
          scoreBalance: "97680.00",
          vendorAvatar: "https://wdzhanggui-app.oss-cn-hangzhou.aliyuncs.com/avatar/ABCD83809AA10C980D99875663B7D8B3",
          vendorId: 6,
          vendorNickName: "YRJ123"
        }],
        isLogin: false
      })
    } else {
      this.getProxyList()
    }
  },


  /**
   * 获取代理列表
   */
  async getProxyList() {
    const data = await TradeService.getTradeList()
    if (data) {
      this.setData({
        list: data,
        isLogin: true
      })
    }
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
      this.getProxyList()
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
    if (this.data.isLogin) {
      this.getProxyList()
    } else {
      wx.showModal({
        title: '提示',
        content: '想了解更多,请先登录!',
        success: function (result) {
          if (result.confirm) {
            Router.loginPage()
          }
        }
      })
    }
    wx.stopPullDownRefresh()
  },

  /**
   * 跳转登录页面
   */
  goLoginPage() {
    Router.loginPage()
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
   * 跳转积分页面
   */
  onJumpScoll: function (event) {
    if (this.data.isLogin) {
      const vendorId = event.currentTarget.dataset.id
      Router.scollPage(vendorId)
    } else {
      wx.showModal({
        title: '提示',
        content: '想了解更多,请先登录!',
        success: function (result) {
          if (result.confirm) {
            Router.loginPage()
          }
        }
      })
    }
  },
  /**
   * 跳转商品列表
   */
  onJumpShopList: function (event) {
    if (this.data.isLogin || true) {
      const vendorId = event.currentTarget.dataset.vendorid
      const data = this.data.list.find(t => t.vendorId == vendorId)
      if (data) {
        app.globalData.shop = data
      }
      Router.shopList(vendorId)
    } else {
      wx.showModal({
        title: '提示',
        content: '想了解更多,请先登录!',
        success: function (result) {
          if (result.confirm) {
            Router.loginPage()
          }
        }
      })
    }
  }
})