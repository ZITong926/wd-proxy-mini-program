// pages/shop/agent/index.js
import TradeService from '../../../service/TradeService'
import Tips from '../../../utils/tips'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [],
    deviceW: 0,
    deviceH: 0,
    oHeight: [],
    keyword: '',
    fixedTop: 0,
    vendorId: -1,
    toView: 'inToA',
    isActive: null,
    scroolHeight: 0,
    fixedTitle: null,
    statusBarHeight: wx.getSystemInfoSync().statusBarHeight
  },

  /**
   * 生命周期函数--监听页面加载
   */
  async onLoad(options) {
    const { vendorId } = options
    const { keyword } = this.data
    this.setData({
      vendorId
    })
    this.getDeviceInfo()
    Tips.loading()
    const data = await TradeService.getBrandList({ vendorId, keyword })
    if (data) {
      Tips.loaded()
      this.setData({
        list: data
      })
    }
    this.getBrands()
  },

  /**
   * 查询匹配的品牌
   */
  async searchList() {
    Tips.loading()
    const { vendorId, keyword } = this.data
    const data = await TradeService.getBrandList({ vendorId, keyword })
    if (data) {
       Tips.loaded()
      this.setData({
        list: data
      })
    }
    this.getBrands()
  },

  /**
   * 搜索框的值
   */
  keywordChange(event) {
    this.setData({
      keyword: event.detail
    })
  },

  /**
   * 获取设备基本信息
   */
  getDeviceInfo: function () {
    let that = this
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          deviceW: res.windowWidth,
          deviceH: res.windowHeight
        })
      }
    })
  },

  /**
   * 选择品牌分类
   */
  chooseItem(event) {
    const brandObj = {}
    const list = this.data.list
    const id = event.currentTarget.dataset.id
    list.map(t => {
      if (t.items && t.items.length) {
        t.items.map(d => {
          if (d.id == id) {
            brandObj.info = d.info
            brandObj.cnName = d.cnName
          }
        })
      }
    })
    var pages = getCurrentPages();
    // var currPage = pages[pages.length - 1];   //当前页面
    var prevPage = pages[pages.length - 2];  //上一个页面
    prevPage.setData({
      brandId: id,
      brandObj
    })
    prevPage.getNewList()
    wx.navigateBack({})
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
   * 显示指定的分类
   */
  scrollToViewFn: function (e) {
    const that = this;
    const _id = e.target.dataset.id;
    for (var i = 0; i < that.data.list.length; ++i) {
      if (that.data.list[i].alpha == _id) {
        that.setData({
          isActive: _id,
          toView: 'inTo' + _id,
          fixedTitle: that.data.list[i].alpha
        })
        break
      }
    }
  },

  /**
   * 页面滚动
   */
  onPageScroll: function (e) {
    this.setData({ scroolHeight: e.detail.scrollTop });
    for (let i in this.data.oHeight) {
      if (e.detail.scrollTop < this.data.oHeight[i].height) {
        this.setData({
          isActive: this.data.oHeight[i].key,
          fixedTitle: this.data.oHeight[i].name
        });
        return false;
      }
    }
  },

  /**
   * 获取节点信息
   */
  getBrands: function () {
    var number = 0;
    var that = this;
    //计算分组高度,wx.createSelectotQuery()获取节点信息
    for (let i = 0; i < that.data.list.length; i++) {
      wx.createSelectorQuery().select('#inTo' + that.data.list[i].alpha).boundingClientRect(function (rect) {
        number = rect.height + number;
        var newArry = [{ 'height': number, 'key': rect.dataset.id, "name": that.data.list[i].alpha }]
        that.setData({
          oHeight: that.data.oHeight.concat(newArry)
        })
      }).exec()
    }
  }
})