// pages/cart/index/index.js
import Tips from '../../../utils/tips'
import Router from '../../../utils/router'
import CartService from '../../../service/CartService';
import TradeService from '../../../service/TradeService';

const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: -1,
    num: 0,
    idx: -1,
    index: -1,
    count: 0,
    scoll: 0,
    items: [],
    detail: {},
    mask: false,
    specIds: [],
    status: false,
    specsName: '',
    shopcount: 0,
    deviceH: 0,
    isLogin: true,
    confirm_btn: false,
    statusBarHeight: wx.getSystemInfoSync().statusBarHeight
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.getDeviceInfo()
    const token = wx.getStorageSync('token')
    if (!token) {
      const list = [
        {
          check: false,
          vendorAvatar: "https://wdzhanggui-app.oss-cn-hangzhou.aliyuncs.com/avatar/ABCD83809AA10C980D99875663B7D8B3",
          vendorId: 6,
          vendorName: "YRJ123",
          shoppingCartProductDtos: [
            {
              count: 2,
              id: 37,
              productAmount: "2.32",
              productId: 33,
              productImage: null,
              productName: "安卓没有属性",
              productPrice: "1.16",
              specIds: [],
              check: false,
              isTouchMove: false,
              specsName: "xl,嗷嗷嗷"
            }, {
              count: 2,
              id: 35,
              productAmount: "4.00",
              productId: 38,
              check: false,
              isTouchMove: false,
              productImage: "https://wdzhanggui-app.oss-cn-hangzhou.aliyuncs.com/goods/BD44BBC7544B0381FAED2BCB521CBB14",
              productName: "鸡排",
              productPrice: "2.00",
              specIds: [75],
              specsName: "abc"
            }
          ]
        }
      ]
      this.setData({
        items: list,
        isLogin: false
      })
    } else {
      this.getCartList()
    }
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
   * 获取购物车数据
   */
  async getCartList() {
    let num = 0
    const data = await CartService.getCartList()
    if (data && data.length) {
      data.forEach(d => {
        d.check = false
        if (d.shoppingCartProductDtos && d.shoppingCartProductDtos.length) {
          num += d.shoppingCartProductDtos.length
          d.shoppingCartProductDtos.forEach((item, index) => {
            d.shoppingCartProductDtos[index].isTouchMove = false
            d.shoppingCartProductDtos[index].check = false
          })
        }
      })
      this.setData({
        num,
        items: data,
        isLogin: true
      })
    }
  },

  /**
   * 打开弹出框和遮罩层
   */
  async chooseProperty(event) {
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
      const { idx, index, vendorid } = event.currentTarget.dataset
      const { items } = this.data
      const { productId, specsName, specIds, id, count } = items[idx].shoppingCartProductDtos[index]
      const newSpecIds = []
      const data = await TradeService.getProductDetail({ id: productId, vendorId: vendorid })
      if (data) {
        data.properties.map(t => {
          t.specs.map(d => {
            if (specIds.indexOf(d.id) > -1) {
              newSpecIds.push({
                id: d.id,
                propertyvalue: d.propertyValue
              })
            }
          })
        })
        this.setData({
          id,
          idx,
          index,
          specsName,
          mask: true,
          status: true,
          detail: data,
          shopcount: count,
          specIds: newSpecIds
        })
      }
    }
  },

  /**
   * 改变默认的选项
   */
  changeChoose(event) {
    let confirm_btn = this.data.confirm_btn
    const { detail, specIds } = this.data
    const { index, id, propertyvalue } = event.currentTarget.dataset
    if (specIds[index] && specIds[index].id == id) {
      specIds[index] = {}
    } else {
      specIds[index] = {
        id,
        propertyvalue
      }
    }
    for (let i = 0; i < detail.properties.length; i++) {
      if (specIds[i] && Object.keys(specIds[i]).length == 0 || !specIds[i]) {
        confirm_btn = true
        break
      }
      if (i == detail.properties.length - 1) {
        confirm_btn = false
      }
    }
    const specsName = []
    specIds.map(t => {
      specsName.push(t.propertyvalue)
    })
    this.setData({
      specIds,
      confirm_btn,
      specsName: specsName.toString()
    })
  },

  /**
   * 更新购物车属性
   */
  async confimAction() {
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
      const { detail, specIds, shopcount, id, items, idx, index, specsName } = this.data
      const params = {
        id,
        product: {
          count: shopcount,
          productId: detail.id,
          specIds: specIds.map(t => t.id)
        }
      }
      const data = await CartService.updateCartList(params)
      if (data) {
        items[idx].shoppingCartProductDtos[index].specsName = specsName
        items[idx].shoppingCartProductDtos[index].specIds = specIds.map(t => t.id)
        this.setData({
          items
        })
        this.close()
      }
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
      this.getCartList()
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
      this.getCartList()
    }
    wx.stopPullDownRefresh()
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

  //手指触摸动作开始 记录起点X坐标
  touchstart(event) {
    const { items } = this.data
    const item = items
    //开始触摸时 重置所有删除
    items.map((d, index) => {
      item[index].shoppingCartProductDtos = app.touch._touchstart(event, d.shoppingCartProductDtos)
    })
    this.setData({
      items: item
    })
  },

  //滑动事件处理
  touchmove: function (event) {
    const { items } = this.data
    const { idx } = event.currentTarget.dataset
    const data = app.touch._touchmove(event, items[idx].shoppingCartProductDtos)
    items[idx].shoppingCartProductDtos = data
    this.setData({
      items
    })
  },

  
  /**
   * 跳转登录页面
   */
  goLoginPage() {
    Router.loginPage()
  },

  /**
   * 删除购物车某一订单
   */
  async delCartOrder(event) {
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
      const { items } = this.data
      let { num } = this.data
      let count = 0
      let scoll = 0
      const { idx, id } = event.currentTarget.dataset
      if (items[idx].shoppingCartProductDtos.length == 1) {
        items.splice(idx, 1)
      } else {
        const index = items[idx].shoppingCartProductDtos.findIndex(t => t.id == id)
        if (id != -1) {
          items[idx].shoppingCartProductDtos.splice(index, 1)
        }
      }
      for (let i = 0; i < items.length; i++) {
        if (items[i].check) {
          count += items[i].shoppingCartProductDtos.length
          items[i].shoppingCartProductDtos.map(t => {
            scoll += Number((Number(t.productPrice) * t.count).toFixed(2))
          })
        } else {
          items[i].shoppingCartProductDtos.map(t => {
            if (t.check) {
              count++
              scoll += Number((Number(t.productPrice) * t.count).toFixed(2))
            }
          })
        }
      }
      const data = await CartService.delCartShop({ id })
      if (data) {
        num--
        this.setData({
          num,
          scoll,
          count,
          items,
        })
      }
    }
  },

  /**
   * 全选某个店的订单
   */
  checkAll(event) {
    let count = 0
    let scoll = 0
    const { items } = this.data
    const { index } = event.currentTarget.dataset
    if (!this.isOneShop(index)) {
      if (items[index].check) {
        items[index].check = false
        if (items[index].shoppingCartProductDtos) {
          items[index].shoppingCartProductDtos.map((t, i) => {
            items[index].shoppingCartProductDtos[i].check = false
          })
        }
      } else {
        items[index].check = true
        if (items[index].shoppingCartProductDtos) {
          items[index].shoppingCartProductDtos.map((t, i) => {
            items[index].shoppingCartProductDtos[i].check = true
          })
        }
      }
      for (let i = 0; i < items.length; i++) {
        if (items[i].check) {
          count += items[i].shoppingCartProductDtos.length
          items[i].shoppingCartProductDtos.map(t => {
            scoll += Number((Number(t.productPrice) * t.count).toFixed(2))
          })
        } else {
          items[i].shoppingCartProductDtos.map(t => {
            if (t.check) {
              count++
              scoll += Number((Number(t.productPrice) * t.count).toFixed(2))
            }
          })
        }
      }
      this.setData({
        scoll,
        count,
        items
      })
    } else {
      items[index].check = false
      this.setData({
        items
      })
    }
  },

  /**
   * 单选个产品
   */
  checkSingle(event) {
    const { items } = this.data
    let { count, scoll } = this.data;
    const { index, idx } = event.currentTarget.dataset
    if (!this.isOneShop(idx)) {
      items[idx].shoppingCartProductDtos[index].check = !items[idx].shoppingCartProductDtos[index].check
      for (let i = 0; i < items[idx].shoppingCartProductDtos.length; i++) {
        if (!items[idx].shoppingCartProductDtos[i].check) {
          items[idx].check = false
          break;
        }
        if (i == items[idx].shoppingCartProductDtos.length - 1) {
          items[idx].check = true
        }
      }
      if (items[idx].shoppingCartProductDtos[index].check) {
        count++
        scoll += Number((Number(items[idx].shoppingCartProductDtos[index].productPrice) * items[idx].shoppingCartProductDtos[index].count).toFixed(2))
      } else {
        count--
        scoll -= Number((Number(items[idx].shoppingCartProductDtos[index].productPrice) * items[idx].shoppingCartProductDtos[index].count).toFixed(2))
      }
      this.setData({
        scoll,
        count,
        items
      })
    }
  },

  /**
   * 更改某个产品的数量
   */
  async changeNum(event) {
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
      const { items } = this.data
      let { scoll } = this.data
      const { index, idx, name } = event.currentTarget.dataset
      if (name == 'plus') {
        items[idx].shoppingCartProductDtos[index].count += 1
        if (items[idx].shoppingCartProductDtos[index].check) {
          scoll += Number(Number(items[idx].shoppingCartProductDtos[index].productPrice).toFixed(2))
        }
      } else {
        if (items[idx].shoppingCartProductDtos[index].count >= 2) {
          items[idx].shoppingCartProductDtos[index].count -= 1
          if (items[idx].shoppingCartProductDtos[index].check) {
            scoll -= Number(Number(items[idx].shoppingCartProductDtos[index].productPrice).toFixed(2))
          }
        }
      }
      const { id, productId, specIds } = items[idx].shoppingCartProductDtos[index]
      const params = {
        id,
        product: {
          specIds,
          productId,
          count: items[idx].shoppingCartProductDtos[index].count
        }
      }
      const data = await CartService.updateCartList(params)
      if (data) {
        this.setData({
          scoll,
          items
        })
      }
    }
  },

  /**
   * 结算
   */
  async countShop() {
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
      let info = ''
      const { items } = this.data
      for (let i = 0; i < items.length; i++) {
        if (items[i].check) {
          info = items[i]
          break
        } else {
          for (let j = 0; j < items[i].shoppingCartProductDtos.length; j++) {
            if (items[i].shoppingCartProductDtos[j].check) {
              info = items[i]
              break
            }
          }
          if (info) {
            break
          }
        }
      }
      Router.payOrder('cart', JSON.stringify(info))
    }
  },

  /**
   * 结算
   */
  async countCart(obj) {
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
      const idsStr = []
      const { items } = this.data
      let list = items
      let { num } = this.data
      for (let i = 0; i < items.length; i++) {
        if (items[i].check) {
          items[i].shoppingCartProductDtos.map(t => {
            idsStr.push(t.id)
          })
        } else {
          items[i].shoppingCartProductDtos.map(t => {
            if (t.check) {
              idsStr.push(t.id)
            }
          })
        }
      }
      const data = await CartService.countCartList({ idsStr, ...obj })
      if (data) {
        for (let i = 0; i < items.length; i++) {
          if (items[i].check) {
            if (items[i].shoppingCartProductDtos.length) {
              num -= items[i].shoppingCartProductDtos.length
            }
            list.splice(i, 1)
          } else {
            items[i].shoppingCartProductDtos.map((t, index) => {
              if (t.check) {
                list[i].shoppingCartProductDtos.splice(index, 1)
                num--
              }
            })
          }
        }
        this.setData({
          num,
          scoll: 0,
          count: 0,
          items: list
        })
      }
    }
  },

  /**
   * 是否单选一家店
   */
  isOneShop(idx) {
    const { items } = this.data
    let flag = false
    for (let i = 0; i < items.length; i++) {
      if (i != idx) {
        if (items[i].check) {
          flag = true
          break
        } else {
          for (let j = 0; j < items[i].shoppingCartProductDtos.length; j++) {
            if (items[i].shoppingCartProductDtos[j].check) {
              flag = true
              break;
            }
          }
          if (flag) {
            break
          }
        }
      }
    }
    return flag
  }
})