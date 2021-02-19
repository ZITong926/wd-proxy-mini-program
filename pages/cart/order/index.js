// pages/cart/order/index.js
import Tips from '../../../utils/tips'
import Router from '../../../utils/router'
import OrderService from '../../../service/OrderService'

const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    name: '',
    list: {},
    shop: {},
    show: true,
    total: 0,
    remark: '',
    specName: '',
    addressInfo: {},
    add_address: true,
    receiverAddressId: -1
  },

  /**
   * 生命周期函数--监听页面加载
   */
  async onLoad(options) {
    let total = 0
    let { show, specName } = this.data
    const data = JSON.parse(options.info)
    if (options.from != 'order') {
      show = false
      app.globalData.shop.vendorId = data.vendorId
      data.shoppingCartProductDtos.map(d => {
        if(d.check){
          total = (Number(total) + Number(d.productAmount)).toFixed(2)
        }
      })
    }else{
      data.specIds.map(t => {
        specName += t.propertyvalue ? t.propertyvalue + ';' : ''
      })
      total = data.count * data.data.proxyPrice
    }
    this.setData({
      show,
      total,
      specName,
      list: data,
      name: options.from,
      shop: app.globalData.shop
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
  onShow() {
 
  },

  /**
   * 获取地址
   */
  async getReciveAdress(){
    const { receiverAddressId } = this.data
    const data = await OrderService.searchOrderAddress({ id: receiverAddressId })
    if(data){
      this.setData({
        addressInfo: data,
        add_address: false
      })
    }
  },

  /**
   * 提交订单
   */
  async submitOrder(){
    const { receiverAddressId, remark, list, shop, name } = this.data
    if(name != 'cart'){
      const specIds = list.specIds.map(t => t.id)
      const params = {
        remark,
        products: [{
          specIds,
          count: list.count,
          productId: list.productId
        }],
        receiverAddressId,
        vendorId: shop.vendorId
      }
      if(receiverAddressId == -1){
        Tips.alert('请填写收件地址!')
      }else{
        const data = await OrderService.OverBooking(params)
        if(data){
          setTimeout(() => {
            wx.navigateBack({})
          }, 500)
        }
      }
    }else{
      if(receiverAddressId == -1){
        Tips.alert('请填写收件地址!')
      }else{
        var pages = getCurrentPages();
        var prevPage = pages[pages.length - 2];  //上一个页面
        prevPage.countCart({
          remark,
          receiverAddressId,
          vendorId: list.vendorId
        })
        setTimeout(() => {
          wx.navigateBack({})
        }, 500)
      }
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

  },

  /**
   * 编辑或者添加地址
   */
  addOrEditAddress: function () {
    const { receiverAddressId } = this.data
    if(receiverAddressId >= 0){
      Router.addressPage(receiverAddressId)
    }else{
      Router.addressPage()
    }
  }
})