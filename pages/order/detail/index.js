// pages/order/detail/index.js
import Tips from '../../../utils/tips'
import Router from '../../../utils/router'
import OrderService from '../../../service/OrderService'

const order_status = ['', '待支付', '待发货', '已发货', '已取消']

Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: {},
    count: 0,
    small_title: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  async onLoad(options) {
    const data = await OrderService.OrderDetail(options)
    if (data) {
      this.setData({
        list: data,
        small_title: '- ' + order_status[data.status] + ' -',
        count: (Number(data.receivableAmount)- Number(data.discountAmount)+ Number(data.otherAmount)).toFixed(2)
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
   * 复制剪切板
   */
  copyOrder(e){
    const { id } = e.currentTarget.dataset
    if(!id){
      return 
    }
    wx.setClipboardData({
      data: id
    })
  },
  
  /**
   * 支付订单
   */
  async onJumpPayOrder(event) {
    const id = event.currentTarget.id
    const data = await OrderService.OrderPay({ id })
    if(data){
      Tips.toast('支付成功')
      const { list } = this.data
      list.status = 2
      this.setData({
        list
      })
      var pages = getCurrentPages();
      var prevPage = pages[pages.length - 2];  //上一个页面
      prevPage.updateList()
    }
  },

  /**
   * 物流查询
   */
  getLogis(event){
    const id = event.currentTarget.id
    Router.orderTrace(id)
  },

  /**
   * 取消订单
   */
  async cancalOrder(event){
    const id = event.currentTarget.id
    const data = await OrderService.OrderCancel({ id })
    if(data){
      Tips.toast('取消成功')
      const { list } = this.data
      list.status = 4
      this.setData({
        list
      })
      var pages = getCurrentPages();
      var prevPage = pages[pages.length - 2];  //上一个页面
      prevPage.updateList()
    }
  }
})