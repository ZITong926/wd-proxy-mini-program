// pages/shop/detail/index.js
import tips from '../../../utils/tips'
import Router from '../../../utils/router'
import CartService from '../../../service/CartService'
import TradeService from '../../../service/TradeService'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    data: {},
    count: 2,
    specIds: [],
    vendorId: -1,
    productId: -1,
    specsName: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  async onLoad(options) {
    const data = await TradeService.getProductDetail({ ...options })
    if (data) {
      this.setData({
        data,
        productId: options.id,
        vendorId: options.vendorId
      })
    }
  },

  /**
   * 下单跳转
   */
  onJumpPayOrder() {
    Router.payOrder('order', JSON.stringify(this.data))
  },

  /**
   * 商品数量
   */
  changeNum(event) {
    let { count } = this.data
    const { name } = event.currentTarget.dataset
    if (name == 'remove') {
      if (count >= 2) {
        count--
      }
    } else {
      count++
    }
    this.setData({
      count
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

  },

  async addToCart() {
    const { vendorId, count, specIds, productId } = this.data
    const params = {
      vendorId,
      products: JSON.stringify([{
        count,
        productId,
        specIds: specIds.map(t => t.id)
      }])
    }
    await CartService.addShopCart(params)
  },

  /**
   * 改变默认的选项
   */
  changeChoose(event) {
    const { index, id, propertyvalue } = event.currentTarget.dataset
    const { specIds } = this.data
    if (specIds[index] && specIds[index].id == id) {
      specIds[index] = {}
    } else {
      specIds[index] = {
        id,
        propertyvalue
      }
    }
    let specsName = ''
    specIds.map((t, i) => {
      if(i == specIds.length - 1){
        specsName += t.propertyvalue
      }else{
        specsName += t.propertyvalue + ' / '
      }
    })
    this.setData({
      specIds,
      specsName
    })
  }
})