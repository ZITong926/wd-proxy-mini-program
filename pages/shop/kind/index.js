// pages/shop/kind/index.js
import TradeService from '../../../service/TradeService'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [],
    index: 0,
    curNav: '0',
    winHeight: 0,
    categoryId: -1,
    statusBarHeight: wx.getSystemInfoSync().statusBarHeight,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  async onLoad(options) {
    const data = await TradeService.getCategoryList({ vendorId: 5 })
    if (data) {
      this.setData({
        list: data,
        curNav: data[0].id
      })
    }
  },

  /**
   * 选中分类
   */
  selectedKind(event){
    const id = event.currentTarget.dataset.id
    this.setData({
      categoryId: id
    })
  },

  /**
   * 返回上一级
   */
  backToShop(){
    const { list, categoryId } = this.data
    let categoryObj = {}
    list.map(t => {
      if(t && t.children){
        t.children.map(d => {
          if(d && d.children){
            d.children.map(x => {
              if(x.id == categoryId){
                categoryObj = {
                  level1: t.name,
                  level2: d.name,
                  level3: x.name
                }
              }
            })
          }
        })
      }
    })
    var pages = getCurrentPages();
    // var currPage = pages[pages.length - 1];   //当前页面
    var prevPage = pages[pages.length - 2];  //上一个页面
    prevPage.setData({
      categoryId,
      categoryObj
    })
    prevPage.getNewList()
    wx.navigateBack({})
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    var that = this;
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          winHeight: res.windowHeight,
        })
      }
    })
  },
  //点击左侧 tab ，右侧列表相应位置联动 置顶 
  switchRightTab: function (e) {
    const { id, index } = e.currentTarget.dataset
    this.setData({
      // 动态把获取到的 id 传给 scrollTopId      
      scrollTopId: 'kind_' + id,
      // 左侧点击类样式      
      curNav: id,
      index,
    })
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