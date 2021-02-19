import Tips from '../utils/tips'
import Pagination from "../entity/Page"
import BaseService from './BaseService'
/**
 * 供应商
 */
class TradeService extends BaseService {

  /**
  * 返回积分分页对象
  */
  pageScoll() {
    const url = `${this.publicUrl}/a/agency/score/list`;
    return new Pagination(url, false);
  }

  /**
  * 返回商品分页对象
  */
  pageProduct() {
    const url = `${this.publicUrl}/a/agency/product/list`;
    return new Pagination(url, false);
  }

  /**
   * 获取供应商列表
   */
  getTradeList() {
    Tips.loading()
    const url = `${this.publicUrl}/a/agency/listVendors`
    return this.post(url, {}).then(data => {
      Tips.loaded()
      return data ? data : true
    }).catch(err => {
      Tips.loaded()
      Tips.error(err.msg)
      return false
    })
  }

  /**
   * 获取顶部对账数据
   */
  getTopScoll(vendorId) {
    const url = `${this.publicUrl}/a/agency/score/stat`
    return this.get(url, { vendorId }).then(data => {
      return data
    }).catch(err => {
      Tips.error(err.msg)
      return false
    })
  }

  /**
   * 商品品牌列表
   */
  getBrandList(params) {
    const url = `${this.publicUrl}/a/agency/product/brand/list`
    return this.get(url, params).then(data => {
      return data
    }).catch(err => {
      Tips.error(err.msg)
      return false
    })
  }
  /**
   * 商品分类列表
   */
  getCategoryList(params) {
    const url = `${this.publicUrl}/a/agency/product/category/list`
    return this.get(url, params).then(data => {
      return data
    }).catch(err => {
      Tips.error(err.msg)
      return false
    })
  }

  /**
   * 商品详情
   */
  getProductDetail(params) {
    const url = `${this.publicUrl}/a/agency/product/get`
    return this.get(url, params).then(data => {
      return data
    }).catch(err => {
      Tips.error(err.msg)
      return false
    })
  }
}

export default new TradeService()