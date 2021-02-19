// pages/shop/list/index.js
import Tips from '../../../utils/tips'
import Router from "../../../utils/router"
import CartService from '../../../service/CartService'
import TradeService from '../../../service/TradeService'

const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: -1,
    name: '',
    page: {},
    list: [],
    keyword: '',
    mask: false,
    cnName: '',
    vendorId: '',
    status: false,
    brandId: '',
    specIds: [],
    specsName: '',
    count: 2,
    deviceH: 0,
    brandObj: {},
    categoryId: '',
    categoryObj: {},
    confirm_btn: true,
    currentOrderDetail: {},
    statusBarHeight: wx.getSystemInfoSync().statusBarHeight
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.getDeviceInfo()
    Tips.loading()
    const { vendorId } = options
    this.setData({
      vendorId
    })
    this.page = TradeService.pageProduct()
    this.loadNextPage()
  },

  /**
   * 查商品列表
   */
  searchList(){
    this.page.reset()
    Tips.loading()
    this.loadNextPage()
  },

  /**
   * windowHeight
   */
  getDeviceInfo: function () {
    let that = this
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          // deviceW: res.windowWidth,
          deviceH: res.windowHeight
        })
      }
    })
  },

  /**
   * 查询的值变化
   */
  keywordChange(event){
    this.setData({
      keyword: event.detail
    })
  },

  /**
   * 清除信息
   */
  delInfo(event) {
    const name = event.currentTarget.dataset.name
    if (name == 'brand') {
      this.setData({
        brandId: '',
        brandObj: {}
      })
    } else {
      this.setData({
        categoryId: '',
        categoryObj: {}
      })
    }
    this.getNewList()
  },

  /**
   * 加载下一页
   */
  loadNextPage() {
    const { keyword, brandId, categoryId, vendorId } = this.data
    const params = {
      keyword,
      brandId,
      vendorId,
      categoryId
    }
    this.page.next(params).then(data => {
      this.setData({
        list: data.list
      })
      Tips.loaded();
    })
  },

  /**
   * 条件改变重新请求
   */
  getNewList() {
    this.page.reset()
    this.loadNextPage()
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
  onReachBottom: function () {
    if(!this.page.reachBottom){
      this.loadNextPage()
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  /**
   * 打开弹出框和遮罩层
   */
  async chooseProperty(event) {
    const { id, name } = event.currentTarget.dataset
    const data = await TradeService.getProductDetail({ id, vendorId: this.data.vendorId })
    if (data) {
      this.setData({
        id,
        name,
        mask: true,
        status: true,
        currentOrderDetail: data
      })
    }
  },

  /**
   * 关闭弹出框和遮罩层
   */
  close: function () {
    this.setData({
      mask: false,
      status: false
    })
  },

  /**
   * 改变默认的选项
   */
  changeChoose(event) {
    let confirm_btn = this.data.confirm_btn
    const { currentOrderDetail, specIds } = this.data
    const { index, id, propertyvalue } = event.currentTarget.dataset
    if (specIds[index] && specIds[index].id == id) {
      specIds[index] = {}
    } else {
      specIds[index] = {
        id,
        propertyvalue
      }
    }
    for (let i = 0; i < currentOrderDetail.properties.length; i++) {
      if (specIds[i] && Object.keys(specIds[i]).length == 0 || !specIds[i]) {
        confirm_btn = true
        break
      }
      if (i == currentOrderDetail.properties.length - 1) {
        confirm_btn = false
      }
    }
    let specsName = ''
    specIds.map((t, i) => {
      if(i != specIds.length-1){
        specsName += t.propertyvalue + ' / '
      }else{
        specsName += t.propertyvalue
      }
    })
    this.setData({
      specIds,
      specsName,
      confirm_btn
    })
  },

  /**
   * 修改商品数量
   */
  changeNum(event) {
    let { count }= this.data
    const { name } = event.currentTarget.dataset
    if (name == 'remove'){
      if(count >= 2){
        count--
      }
    }else{
      count++
    }
    this.setData({
      count
    })
  },

  /**
   * 跳转确认订单 || 或者加入购物车操作
   */
  async confimAction(){
    const { name, currentOrderDetail, count, specIds, vendorId, id } = this.data
    if(name == 'order'){
      const data = JSON.stringify({
        data: currentOrderDetail,
        count,
        specIds,
        vendorId,
        productId: id
      })
      this.close()
      Router.payOrder('order', data)
    }else{
      const params = {
        vendorId,
        products: JSON.stringify([{
          count,
          productId: id,
          specIds: specIds.map(t => t.id)
        }])
      }
      await CartService.addShopCart(params)
      this.close()
    }
  },

  /**
   * 跳转商品详情
   */
  onJumpShopDetail(event) {
    const { id } = event.currentTarget.dataset
    Router.goodsDetail(this.data.vendorId, id)
  },

  /**
   * 商品品牌
   */
  async onJumpChoose(event) {
    const dataset = event.currentTarget.dataset
    const { name, vendorid } = dataset
    if (name == 'brand') {
      Router.shopBrand(vendorid)
    } else {
      Router.shopCategory(vendorid)
    }
  }
})