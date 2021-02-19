const app = getApp()

Component({
  properties: {
    headerHeight: {
      type: Number,
      value: 50
    },
    small_title: {
      type: String,
      value: ''
    },
    placeholder: {
      type: String,
      value: ''
    },
    keyword: {
      type: String,
      value: ''
    },
    searchBar: {
      type: Boolean,
      value: false
    },
    title: {			// 设置标题
      type: String,
      value: ''
    },
    title_color: {			// 设置标题颜色
      type: String,
      value: '#fff'
    },
    show_left: {			// 控制返回箭头是否显示
      type: Boolean,
      value: true
    },
    show_right: {			// 控制返回箭头是否显示
      type: Boolean,
      value: true
    },
    my_class: {			// 控制样式(背景是否透明)
      type: Boolean,
      value: false
    },
    background_color: {//背景颜色
      type: String,
      value: "#24AFFF"
    },
    linear_gradient: {  //是否渐变
      type: Boolean,
      value: true
    },
    direction: {  //颜色渐变方向
      type: String,
      value: "top"
    },
    color_stops: { //渐变的起止颜色数组
      type: Array,
      value: ["#FD4C72", "#FF83AB"]
    },
    content_offset: { //内容是否偏移（不让导航栏遮挡内容）
      type: Boolean,
      value: true
    },
  },
  /* 组件的初始数据 */
  data: {
    type: "组件",
    bar_Height: wx.getSystemInfoSync().statusBarHeight	// 获取手机状态栏高度
  },
  attached: function () { 
    app.globalData.statusBarHeight = wx.getSystemInfoSync().statusBarHeight
  },
  methods: {
    // 返回事件
    goBack: function () {
      wx.navigateBack({
        delta: 1,
      })
    },

    // 查询
    search(){
      this.triggerEvent('search')
    },

    // 查询value变化
    inputOnchange(event){
      const value = event.detail.value
      this.triggerEvent('keywordChange', value)
    }
  }
})