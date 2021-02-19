// pages/address/express/index.js
import OrderService from '../../../service/OrderService'
import Tips from '../../../utils/tips'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [],
    total: 0,
    size: 0,
    currentTab: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  async onLoad(options) {
    Tips.loading()
    const list = await OrderService.getLogistics({ orderId: options.id })
    if (list) {
      Tips.loaded()
      this.setData({
        list,
        size: list.length
      })
      this.getShowOrder()
    }
  },

  /**
   * 更改包裹信息
   */
  changeOrder(event) {
    const name = event.currentTarget.dataset.name
    let { currentTab } = this.data
    if (name == 'left') {
      currentTab--
    } else {
      currentTab++
    }
    this.setData({
      currentTab
    })
    this.getShowOrder()
  },

  /***
   * 获取默认订单信息
   */
  getShowOrder() {
    const { currentTab, list } = this.data
    let total = 0
    if (list[currentTab]) {
      list[currentTab].orderProductItemList.map(d => {
        total += d.itemCount
      })
      this.setData({
        total
      })
    }
  },

  /**
   * 复制剪切板
   */
  copyTBL: function (e) {
    const { list, currentTab } = this.data
    let expressNo = list[currentTab].expressNo
    wx.setClipboardData({
      data: expressNo
    })
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

  }
})