
import Tips from './tips'
import Router from './router'

const app = getApp();


/**
 * HTTP工具类
 */
export default class HttpRequest {

  static request(method, url, data, headers) {

    return new Promise((resolve, reject) => {
      const header = this.createAuthHeader(headers);
      wx.request({
        url,
        method,
        data,
        header,
        success: (res) => {
          const wxCode = res.statusCode
          // 微信状态校验
          if (wxCode !== 200) {
            this.handleHttpException(res)
            reject(res)
          } else {
            // 服务端状态校验
            const wxData = res.data
            if (!wxData.success) {
              reject(wxData)
            } else {
              resolve(wxData.data)
            }
          }
        },
        fail: (res) => {
          reject(res)
        }
      })
    })
  }

  /**
   * 错误处理器 
   */
  static handleHttpException(res) {
    const status = res.statusCode;
    switch (status) {
      case 401:
        this.handleHttp401Exception(res);
        break;
      case 403:
        this.handleHttp403Exception(res);
        break;
      case 500:
        this.handleHttp500Exception(res);
        break;
      default:
        console.info('其他错误', res);

    }
  }


  /**
   * 处理401错误
   */
  static handleHttp401Exception(res) {
    Tips.toast('401-Token失效')
    Router.loginPage()
    console.error(`401-Token失效：${res.data.message}`);
  }

  /**
   * 处理403错误
   */
  static handleHttp403Exception(res) {
    console.error(`403-权限错误：${res.data.message}`);
  }

  /**
   * 处理500错误
   */
  static handleHttp500Exception(res) {
    console.error(`500-服务器内部错误：${res.data.message}`);
  }

  /**
   * 携带token
   */
  static createAuthHeader(headers) {
    const header = headers ? headers : {
      'content-type': 'application/json'
    }
    const token = wx.getStorageSync('token')
    if (token) {
      header["token"] = token;
    }
    return header;
  }


  /**
   * 处理GET请求
   */
  static get(url, data, header) {
    return this.request('get', url, data, header)
  }


  /**
   * 处理POST请求
   */
  static post(url, data, header) {
    return this.request('post', url, data, header)
  }
}