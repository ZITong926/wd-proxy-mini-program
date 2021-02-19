import Tips from '../utils/tips'
import Pagination from "../entity/Page"
import BaseService from './BaseService'
import { formdata } from '../utils/util'
/**
 * 订单
 */
class OrderService extends BaseService {

  /**
   * 订单列表分页对象
   */
  PageOrder() {
    const url = `${this.publicUrl}/a/order/list`
    return new Pagination(url, false)
  }

  /**
   * 订单详情
   * @param {*id} params 
   */
  OrderDetail(params) {
    const url = `${this.publicUrl}/a/order/get`
    return this.get(url, params).then(data => {
      return data
    }).catch(err => {
      Tips.error(err.msg)
      return false
    })
  }

  /**
   * 订单支付
   * @param {*id} params 
   */
  OrderPay(params) {
    const url = `${this.publicUrl}/a/order/pay`
    return this.get(url, params).then(data => {
      return data ? data : true
    }).catch(err => {
      Tips.error(err.msg)
      return false
    })
  }

  /**
   * 订单取消
   * @param {*id} params 
   */
  OrderCancel(params) {
    const url = `${this.publicUrl}/a/order/cancel`
    return this.get(url, params).then(data => {
      return data ? data: true
    }).catch(err => {
      Tips.error(err.msg)
      return false
    })
  }

  /**
   * 立即下单
   * @param {*id、receiverAddressId、products、remark} params 
   */
  OverBooking(params) {
    const url = `${this.publicUrl}/a/order/create`
    return this.get(url, params).then(data => {
      Tips.toast('下单成功')
      return data ? data : true
    }).catch(err => {
      Tips.error(err.msg)
      return false
    })
  }

  /**
   * 订单地址添加
   * @param {*name、phone、address、areaId} params 
   */
  addOrderAddress(params){
    const url = `${this.publicUrl}/a/address/add`
    return this.get(url, params).then(data => {
      return data
    }).catch(err => {
      Tips.error(err.msg)
      return false
    })
  }

  /**
   * 订单地址查询
   * @param {*id} params 
   */
  searchOrderAddress(params){
    const url = `${this.publicUrl}/a/address/get`
    return this.get(url, params).then(data => {
      return data
    }).catch(err => {
      Tips.error(err.msg)
      return false
    })
  }

  /**
   * 订单地址修改
   * @param {*id、name、phone、address、areaId} params 
   */
  editOrderAddress(params){
    const url = `${this.publicUrl}/a/address/update`
    return this.get(url, params).then(data => {
      return data
    }).catch(err => {
      Tips.error(err.msg)
      return false
    })
  }

  /**
   * 省市级
   */
  getProvinceAndCity(params){
    const url = `${this.publicUrl}/area/list`
    return this.post(
      url, 
      formdata(params), 
      { "content-type": "multipart/form-data; boundary=XXX" }
    ).then(data => {
      return data
    }).catch(err => {
      Tips.error(err.msg)
      return false
    })
  }

  /**
   * 订单地址识别
   */
  recognizeAddress(params){
    const url = `${this.publicUrl}/user/customer/address/autoDetect`
    return this.get(
      url,
      params
    ).then(data => {
      return data
    }).catch(err => {
      Tips.error(err.msg)
      return false
    })
  }

  /**
   * 订单物流查询
   */
  getLogistics(params){
    const url = `${this.publicUrl}/user/order/trace`
    return this.get(
      url,
      params
    ).then(data => {
      return data
    }).catch(err => {
      Tips.error(err.msg)
      return false
    })
  }
}

export default new OrderService()