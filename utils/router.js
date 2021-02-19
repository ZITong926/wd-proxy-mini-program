const app = getApp();

/**
 * 路由导航
 */
export default class Router {
  /**
   * 注册验证码界面
   */
  static registerPage(mobile) {
    this.goto(`/pages/login/register/index?mobile=${mobile}`)
  }

  /**
   * 登录页面
   */
  static loginPage() {
    this.goto(`/pages/login/index/index`)
  }

  /**
   * 登录成功跳转首页
   */
  static homePage() {
    wx.switchTab({
      url: "/pages/shop/index/index"
    });
  }
  /**
   * 地址添加或者编辑
   */
  static addressPage(id) {
    this.goto(`/pages/address/index/index?id=${id}`)
  }

  /**
   * 商品列表
   */
  static shopList(vendorId) {
    this.goto(`/pages/shop/list/index?vendorId=${vendorId}`);
  }

  /**
   * 商品详情
   */
  static goodsDetail(vendorid, id) {
    this.goto(`/pages/shop/detail/index?vendorId=${vendorid}&id=${id}`);
  }


  /**
   * 商品品牌
   */
  static shopBrand(vendorId) {
    this.goto(`/pages/shop/agent/index?vendorId=${vendorId}`);
  }

  /**
   * 商品分类
   */
  static shopCategory(vendorId) {
    this.goto(`/pages/shop/kind/index?vendorId=${vendorId}`);
  }

  /**
   * 创建订单 
   */
  static createTrade(trade) {
    this.goto(`/pages/order/trade/trade?trade=${trade}`);
  }


  /**
   * 订单列表 
   */
  static orderIndex() {
    wx.switchTab({
      url: "/pages/order/index/index"
    });
  }

  /**
   * 订单详情 
   */
  static orderDetail(id) {
    this.goto(`/pages/order/detail/index?id=${id}`);
  }

  /**
   * 订单积分支付页面
   */
  static payOrder(from, info){
    this.goto(`/pages/cart/order/index?from=${from}&info=${info}`)
  }

  /**
   * 订单物流信息 
   */
  static orderTrace(id) {
    this.goto(`/pages/address/express/index?id=${id}`);
  }

  //购物车
  static cartIndex() {
    wx.switchTab({
      url: "/pages/cart/index/index"
    });
  }

  /**
   * 地址详情页面
   */
  static addressEdit(address) {
    this.goto(`/pages/address/edit/edit?addr=${address}`);
  }

  /**
   * 积分对账
   */
  static scollPage(vendorId) {
    this.goto(`/pages/scoll/index/index?vendorId=${vendorId}`);
  }

  /**
   * 联系客服
   */
  static servicePage() {
    this.goto(`/pages/outpage/index/index`);
  }


  /**
   * 页面跳转
   */
  static goto(url) {
    wx.navigateTo({
      url: url
    });
  }

  /**
   * 页面重定向
   */
  static redirectTo(url) {
    wx.redirectTo({
      url: url
    });
  }

  /**
   * 页面返回上一层
   */
  static back() {
    wx.navigateBack({
      delta: 1,
    });
  }
}