import Tips from '../utils/tips'
import BaseService from './BaseService'
import { formdata } from '../utils/util'
/**
 * 订单
 */
class CartService extends BaseService {

  /**
   * 获取购物车列表
   */
  getCartList(){
    Tips.loading()
    const url = `${this.publicUrl}/a/cart/list`
    return this.get(url).then(data => {
      Tips.loaded()
      return data
    }).catch(err => {
      Tips.error(err.msg)
      return false
    })
  }

  /**
   * 添加商品到购物车
   */
  addShopCart(params){
    const url = `${this.publicUrl}/a/cart/addProduct`
    return this.post(
      url,
      formdata(params),
      { "content-type": "multipart/form-data; boundary=XXX" }
    ).then(data => {
      Tips.toast('添加成功')
      return data ? data : true
    }).catch(err => {
      Tips.error(err.msg)
      return false
    })
  }

  /**
   * 删除购物车中的商品
   */
  delCartShop(params){
    const url = `${this.publicUrl}/a/cart/deleteProduct`
    return this.get(url, params).then(data => {
      Tips.toast('删除成功')
      return data ? data : true
    }).catch(err => {
      Tips.error(err.msg)
      return false
    })
  }

  /**
   * 结算购物车
   */
  countCartList(params){
    const url = `${this.publicUrl}/a/cart/settle`
    return this.get(url, params).then(data => {
      Tips.toast('结算成功')
      return data ? data: true
    }).catch(err => {
      Tips.error(err.msg)
      return false
    })
  }

  /**
   * 更新购物车
   */
  updateCartList(params){
    const url = `${this.publicUrl}/a/cart/updateProduct`
    return this.get(url, params).then(data => {
      return data ? data : true
    }).catch(err => {
      Tips.error(err.msg)
      return false
    })
  }
}

export default new CartService()