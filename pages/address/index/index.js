// pages/address/index.js
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
    phone: '',
    address: '',
    areaId: -1,
    confirm: false,
    addrList: [],
    addrSelect: [],
    smartValue: '',
    showArea: false,
    detail_address: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  async onLoad(options) {
    const { id } = options
    this.loadingAddress({
      detail: {
        index: 0,
        id: 'A000086000'
      }
    })
    if(id != "undefined"){
      const data = await OrderService.searchOrderAddress({ id })
      if(data){
        let newAddress = ''
        let { confirm } = this.data
        const { addrList } = this.data
        const { name, phone, address, areaId, areaName, cityId, cityName, provinceId, provinceName } = data
        const addrSelect = []
        if (provinceId && provinceName) {
          newAddress += provinceName + ' / '
          if(addrList[0] && addrList[0].length){
            const list = addrList[0].find(t => t.id == provinceId)
            if(list){
              addrSelect.push({
                id: list.code,
                name: provinceName
              })
              await this.loadingAddress({
                detail: {
                  id: list.code,
                  index: 1
                }
              })
            }
          }
        }
        if (cityId && cityName) {
          newAddress += cityName + ' / '
          if(addrList[1] && addrList[1].length){
            const list = addrList[1].find(t => t.id == cityId)
            if(list){
              addrSelect.push({
                id: list.code,
                name: cityName
              })
              await this.loadingAddress({
                detail: {
                  id: list.code,
                  index: 2
                }
              })
            }
          }
        }
        if (areaId && areaName) {
          newAddress += areaName
          if(addrList[2] && addrList[2].length){
            const list = addrList[2].find(t => t.id == areaId)
            if(list){
              addrSelect.push({
                id: list.code,
                name: areaName
              })
            }
          }
        }
        if(name && phone && address && newAddress){
          confirm = true
        }else{
          confirm = false
        }
        this.setData({
          name,
          phone,
          areaId,
          confirm,
          addrSelect,
          address: newAddress,
          detail_address: address
        })
      }
    }
  },

  /**
   * 智能填写
   */
  async smartWrite(e) {
    let newAddress = ''
    let { smartValue, confirm } = this.data
    const { addrList } = this.data
    smartValue = smartValue.replace(/(^\s*)|(\s*$)/g, "") //清除文本前后空格
    if (smartValue && smartValue.length && smartValue.split(' ').length == 3) {
      const data = await OrderService.recognizeAddress({ customerInput: smartValue })
      if (data) {
        const { name, phone, address, areaId, areaName, cityId, cityName, provinceId, provinceName } = data
        const addrSelect = []
        if (provinceId && provinceName) {
          newAddress += provinceName + ' / '
          if(addrList[0] && addrList[0].length){
            const list = addrList[0].find(t => t.id == provinceId)
            if(list){
              addrSelect.push({
                id: list.code,
                name: provinceName
              })
              await this.loadingAddress({
                detail: {
                  id: list.code,
                  index: 1
                }
              })
            }
          }
        }
        if (cityId && cityName) {
          newAddress += cityName + ' / '
          if(addrList[1] && addrList[1].length){
            const list = addrList[1].find(t => t.id == cityId)
            if(list){
              addrSelect.push({
                id: list.code,
                name: cityName
              })
              await this.loadingAddress({
                detail: {
                  id: list.code,
                  index: 2
                }
              })
            }
          }
        }
        if (areaId && areaName) {
          newAddress += areaName
          if(addrList[2] && addrList[2].length){
            const list = addrList[2].find(t => t.id == areaId)
            if(list){
              addrSelect.push({
                id: list.code,
                name: areaName
              })
            }
          }
        }
        if(name && phone && address && newAddress){
          confirm = true
        }else{
          confirm = false
        }
        this.setData({
          name,
          phone,
          areaId,
          confirm,
          addrSelect,
          address: newAddress,
          detail_address: address
        })
      }
    } else {
      Tips.toast('格式不对！请重新输入')
    }
  },

  /**
   * 隐藏键盘
   */
  hideKeyBoard(){
    wx.hideKeyboard({
      complete: (res) => {},
    })
  },

  /**
   * 添加地址
   */
  async addAddress() {
    const { name, phone, detail_address, areaId } = this.data
    const params = {
      name,
      phone,
      address: detail_address,
      areaId,
      vendorId: app.globalData.shop.vendorId
    }
    const data = await OrderService.addOrderAddress(params)
    var pages = getCurrentPages();
    var prevPage = pages[pages.length - 2];  //上一个页面
    if (data) {
      prevPage.setData({
        receiverAddressId: data.id
      })
      prevPage.getReciveAdress()
      wx.navigateBack({})
    }
  },

  /**
   * 逐步请求地址
   */
  async loadingAddress(value) {
    if (value.detail.index < 3) {
      const data = await OrderService.getProvinceAndCity({
        parentCode: value.detail.id
      })
      if (data) {
        const addrList = this.data.addrList
        addrList[value.detail.index] = data
        this.setData({
          addrList
        })
      }
    }
  },

  /**
   * 删除输入框的值
   */
  delValue(event) {
    const name = event.currentTarget.dataset.name
    this.setData({
      [name]: "",
      confirm: false
    })
  },

  /**
   * 输入框变化
   */
  changeInput(event) {
    const name = event.currentTarget.dataset.name
    const value = event.detail.value
    this.setData({
      [name]: value
    })
    const { address, detail_address, phone } = this.data
    if(this.data.name && address && detail_address && phone){
      this.setData({
        confirm: true
      })
    }else{
      this.setData({
        confirm: false
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

  closeArea() {

  },

  /**
   * 返回已选地址
   */
  selectArea(e) {
    let address = ''
    e.detail.map((d, i) => {
      if (i == e.detail.length - 1) {
        address += d.name
      } else {
        address += d.name + ' / '
      }
    })
    this.setData({
      address,
      areaId: e.detail[2].id
    })
  },

  /**
   * 打开地址选项框
   */
  openArea() {
    this.setData({
      showArea: !this.data.showArea
    })
  }
})