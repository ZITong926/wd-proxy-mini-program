// pages/scoll/index/index.js
import Tips from '../../../utils/tips'
import TradeService from '../../../service/TradeService'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    page: {},
    deviceH: -1,
    scollObj: {},
    scollList: [],
    customerId: -1,
    statusBarHeight: wx.getSystemInfoSync().statusBarHeight,
    status: ['','手动充值','手动扣减','订单撤销充值','订单消费扣减']
  },

  /**
   * 生命周期函数--监听页面加载
   */
  async onLoad(options) {
    this.getDeviceInfo()
    Tips.loading()
    const { vendorId } = options
    const data = await TradeService.getTopScoll(vendorId)
    if (data) {
      this.setData({
        vendorId,
        scollObj: data
      })
    }
    this.page = TradeService.pageScoll()
    this.loadNextPage()
  },

  /**
   * 加载下一页
   */
  loadNextPage(){
    this.page.next({ vendorId: this.data.vendorId }).then(data => {
      this.setData({
        scollList: data.list
      })
      Tips.loaded();
    })
  },

  /**
   * windowHeight
   */
  getDeviceInfo: function () {
    let that = this
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          deviceH: res.windowHeight
        })
      }
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

  onRefreshTo(){
    if(!this.page.loading){
      this.page.reset()
      this.loadNextPage()
    }
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {
    if(!this.page.reachBottom){
      this.loadNextPage()
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})