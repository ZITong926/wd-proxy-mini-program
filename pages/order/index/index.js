// pages/order/index/index.js
import Tips from '../../../utils/tips'
import Router from '../../../utils/router'
import OrderService from '../../../service/OrderService'

const lists = [
  {
    id: 130,
    orderNo: "",
    productCount: 4,
    receiverAddress: "sdf",
    receiverId: 57,
    receiverName: "df",
    receiverPhone: "sdf",
    status: 3,
    totalAmount: "888.00",
    vendorAvatar: "https://wdzhanggui-app.oss-cn-hangzhou.aliyuncs.com/avatar/ABCD83809AA10C980D99875663B7D8B3",
    vendorName: "YRJ123",
    vendorUserId: 6,
    items: [
      {
        count: 2,
        id: 177,
        productImage: "https://wdzhanggui-app.oss-cn-hangzhou.aliyuncs.com/goods/A5729B18A520BA6226CCAAFDF9762052",
        productName: "测试",
        proxyPrice: "222.00",
        specName: "m,黑"
      }, {
        count: 2,
        id: 176,
        productImage: "https://wdzhanggui-app.oss-cn-hangzhou.aliyuncs.com/goods/A5729B18A520BA6226CCAAFDF9762052",
        productName: "测试",
        proxyPrice: "222.00",
        specName: "m,白"
      }
    ]
  }, {
    id: 129,
    orderNo: "",
    productCount: 2,
    receiverAddress: "ds",
    receiverId: 57,
    receiverName: "xcv",
    receiverPhone: "sdf",
    totalAmount: "40.00",
    status: 1,
    vendorAvatar: "https://wdzhanggui-app.oss-cn-hangzhou.aliyuncs.com/avatar/ABCD83809AA10C980D99875663B7D8B3",
    vendorName: "YRJ123",
    vendorUserId: 6,
    items: [
      {
        count: 2,
        id: 175,
        productImage: "https://wdzhanggui-app.oss-cn-hangzhou.aliyuncs.com/goods/BD44BBC7544B0381FAED2BCB521CBB14",
        productName: "鸡排",
        proxyPrice: "20.00",
        specName: "abc"
      }
    ]
  }, {
    id: 113,
    orderNo: "",
    productCount: 2,
    receiverAddress: null,
    receiverId: 57,
    receiverName: null,
    receiverPhone: null,
    status: 4,
    totalAmount: "40.00",
    vendorAvatar: "https://wdzhanggui-app.oss-cn-hangzhou.aliyuncs.com/avatar/ABCD83809AA10C980D99875663B7D8B3",
    vendorName: "YRJ123",
    vendorUserId: 6,
    items: [
      {
        count: 2,
        id: 156,
        productImage: "https://wdzhanggui-app.oss-cn-hangzhou.aliyuncs.com/goods/BD44BBC7544B0381FAED2BCB521CBB14",
        productName: "鸡排",
        proxyPrice: "20.00",
        specName: "efg"
      }
    ]
  }
]

Page({

  /**
   * 页面的初始数据
   */
  data: {
    page: {},
    list: [],
    status: -1,
    currtab: 0,
    deviceW: 0,
    deviceH: 0,
    keyword: '',
    isLogin: true,
    swiperHeight: 0,
    swipertab: [
      { name: '全部', index: 0 },
      { name: '待支付', index: 1 },
      { name: '待发货', index: 2 },
      { name: '已发货', index: 3 }
    ],
    status: ['', '待支付', '待发货', '已发货', '已取消'],
    statusBarHeight: wx.getSystemInfoSync().statusBarHeight
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    const token = wx.getStorageSync('token')
    if (!token) {
      this.setData({
        list: lists,
        isLogin: false
      })
    } else {
      this.page = OrderService.PageOrder()
      this.page.reset()
      this.loadNextPage()
    }
  },

  searchList() {
    if (!this.data.isLogin) {
      wx.showModal({
        title: '提示',
        content: '想了解更多,请先登录!',
        success: function (result) {
          if (result.confirm) {
            Router.loginPage()
          }
        }
      })
    } else {
      this.loadNextPage()
    }
  },

  /**
   * 跳转登录页面
   */
  goLoginPage() {
    Router.loginPage()
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
  * 加载下一页
  */
  loadNextPage() {
    const { currtab, keyword } = this.data
    Tips.loading()
    const params = {
      keyword
    }
    if (currtab != 0) {
      params.status = currtab
    }
    this.page.next(params).then(data => {
      Tips.loaded()
      this.setData({
        isLogin: true,
        list: data.list
      })
    })
  },

  /**
   * 物流查询
   */
  getLogis(event) {
    if (!this.data.isLogin) {
      wx.showModal({
        title: '提示',
        content: '想了解更多,请先登录!',
        success: function (result) {
          if (result.confirm) {
            Router.loginPage()
          }
        }
      })
    } else {
      const id = event.currentTarget.id
      Router.orderTrace(id)
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    let _this = this
    this.getDeviceInfo()
    const query = wx.createSelectorQuery()
    query.select('#scoll-view').boundingClientRect()
    query.selectViewport().scrollOffset()
    query.exec(function (res) {
      _this.setData({
        swiperHeight: res[0].height
      })
      // res[0].top       // #the-id节点的上边界坐标
      // res[1].scrollTop // 显示区域的竖直滚动位置
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
  },

  /**
   * 取消订单
   */
  async cancalOrder(event) {
    if (!this.data.isLogin) {
      wx.showModal({
        title: '提示',
        content: '想了解更多,请先登录!',
        success: function (result) {
          if (result.confirm) {
            Router.loginPage()
          }
        }
      })
    } else {
      const id = event.currentTarget.id
      const data = await OrderService.OrderCancel({ id })
      if (data) {
        Tips.toast('取消成功')
        this.page.reset()
        this.loadNextPage()
      }
    }
  },

  /**
   * 某个订单状态更新
   */
  updateList() {
    this.page.reset()
    this.loadNextPage()
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
    if (!this.data.isLogin) {
      wx.showModal({
        title: '提示',
        content: '想了解更多,请先登录!',
        success: function (result) {
          if (result.confirm) {
            Router.loginPage()
          }
        }
      })
    } else {
      if (!this.page.reachBottom) {
        this.loadNextPage()
      } else {
        Tips.alert('没有更多数据了')
      }
    }
  },

  /**
   * 下拉刷新
   */
  onRefreshTo() {
    if (!this.data.isLogin) {
      wx.showModal({
        title: '提示',
        content: '想了解更多,请先登录!',
        success: function (result) {
          if (result.confirm) {
            Router.loginPage()
          }
        }
      })
    } else {
      if (!this.page.loading) {
        this.page.reset()
        this.loadNextPage()
      }
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  /**
   * 点击tab切换
   */
  tabSwitch: function (e) {
    var that = this
    if (!this.data.isLogin) {
      if (this.data.currtab == e.currentTarget.dataset.current) {
        return false
      } else {
        that.setData({
          currtab: e.currentTarget.dataset.current
        })
      }
      Tips.loading()
      const list = []
      lists.map(t => {
        if (t.status == this.data.currtab || this.data.currtab == 0) {
          list.push(t)
        }
      })
      Tips.loaded()
      this.setData({
        list
      })
    } else {
      if (this.data.currtab == e.currentTarget.dataset.current) {
        return false
      } else {
        that.setData({
          currtab: e.currentTarget.dataset.current
        })
        this.page.reset()
        this.loadNextPage()
      }
    }
  },

  /**
   * 复制剪切板
   */
  copyOrder(e) {
    const { id } = e.currentTarget.dataset
    if (!id) {
      return
    }
    wx.setClipboardData({
      data: id
    })
  },

  /**
   * swiper滑动切换
   */
  tabChange: function (e) {
    this.setData({
      currtab: e.detail.current
    })
    let _this = this
    this.getDeviceInfo()
    const query = wx.createSelectorQuery()
    query.select('#scoll-view').boundingClientRect()
    query.selectViewport().scrollOffset()
    query.exec(function (res) {
      _this.setData({
        swiperHeight: res[0].height
      })
      // res[0].top       // #the-id节点的上边界坐标
      // res[1].scrollTop // 显示区域的竖直滚动位置
    })
    if (!this.data.isLogin) {
      Tips.loading()
      const list = []
      lists.map(t => {
        if (t.status == this.data.currtab || this.data.currtab == 0) {
          list.push(t)
        }
      })
      Tips.loaded()
      this.setData({
        list
      })
    } else {
      this.page.reset()
      this.loadNextPage()
    }
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
   * 跳转订单详情页
   */
  onJumpOrderDetail(event) {
    if (!this.data.isLogin) {
      wx.showModal({
        title: '提示',
        content: '想了解更多,请先登录!',
        success: function (result) {
          if (result.confirm) {
            Router.loginPage()
          }
        }
      })
    } else {
      const id = event.currentTarget.id
      Router.orderDetail(id)
    }
  },

  /**
   * 支付订单
   */
  async onJumpPayOrder(event) {
    if (!this.data.isLogin) {
      wx.showModal({
        title: '提示',
        content: '想了解更多,请先登录!',
        success: function (result) {
          if (result.confirm) {
            Router.loginPage()
          }
        }
      })
    } else {
      const id = event.currentTarget.id
      const data = await OrderService.OrderPay({ id })
      if (data) {
        Tips.toast("支付成功")
        this.page.reset()
        this.loadNextPage()
      }
    }
  }
})