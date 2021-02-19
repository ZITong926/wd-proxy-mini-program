import zIndexMarge from "../dialog-modal/z-index-marge";

// var cityList = require('./cityList')
// cityList = cityList.sort(function (a, b) {
// 	return a.id > b.id ? -1 : 1
// })


// function getCurrentItemList(cityList, pid, defaultSelect) {
// 	let list = []
// 	let selectid, selectitem
// 	for (let i = cityList.length - 1; i >= 0; i--) {
// 		let item = cityList[i]
// 		if (item.pid == pid) {
// 			if (
// 				defaultSelect &&
// 				(defaultSelect.id == item.id || defaultSelect.name == item.name)
// 			) {
// 				selectid = item.id
// 				selectitem = Object.assign({}, item)
// 			}
// 			list.push(item)
// 		}
// 	}
// 	return {
// 		list,
// 		selectid,
// 		selectitem
// 	}
// }

Component({
	properties: {
		show: {
			type: Boolean,
			value: false,
			observer(newVal) {
				if (newVal) {
					this.setData({
						zIndex: zIndexMarge()
					})
				}
			}
		},
		zIndex: {
			type: Number,
			value: zIndexMarge()
		},
		addrSelect: {
			type: Array,
			value: [],
			observer() {
				// this._setInitSelectInit = true
				this._setInitSelect()
			}
		},
		currentTab: {
			type: Number,
			value: 0
		},
		autoClose: {
			type: Boolean,
			value: true
		},
		addrList: {
			type: Array,
			value: [],
			observer(addrList) {
				if (addrList) {
					const currentTab = this.data.currentTab
					let temp_currentTab = currentTab >= addrList.length - 1 ? currentTab : currentTab + 1
					this.setData({
						addrList,
					}, () => {
						this.setData({
							currentTab: temp_currentTab
						})
					})
				}
			}
		}
	},
	data: {
		// addrList: [],
		_addrSelect: []
	},
	ready() {

	},
	methods: {
		_touchmove(e) {
			this.triggerEvent('touchmove', e)
		},
		_setInitSelect() {
			this.setData({
				_addrSelect: this.data.addrSelect
			})
		},
		open() {
			this.setData({
				show: true
			})
			this.triggerEvent('open')
			return this
		},
		show() {
			this.open()
			return this
		},
		close() {
			this.setData({
				show: false
			})
			this.triggerEvent('close')
			return this
		},
		setAddrSelect(addrSelect) {
			if (({}).toString.call(addrSelect) !== '[object Array]') {
				return this
			}
			this.setData({
				addrSelect
			})
			return this
		},
		callback(callback, clear = false) {
			this._callback = callback || function () {
			}
			this._callbackClear = !!clear
			return this
		},
		autoClose(autoClose = true) {
			this.setData({
				autoClose
			})
			return this
		},
		tapTabBar(e) {
			var dataset = e.currentTarget.dataset
			this.setData({
				currentTab: dataset.currentTab
			})
		},
		swiperChange(e) {
			this.setData({
				currentTab: e.detail.current
			})
		},
		clickSelectArea(e) {
			var dataset = e.currentTarget.dataset
			var currentTab = dataset.currentTab
			var nextTab = currentTab + 1
			var _addrSelect = this.data._addrSelect
			//已选择地址
			_addrSelect[currentTab] = {
				name: dataset.itemName,
				id: dataset.itemId
			}
			const params = {
				index: nextTab,
				id: dataset.itemCode
			}
			this.triggerEvent('loadingAddress', params)
			this.setData({
				_addrSelect,
			})
			if(_addrSelect.length === 3 && currentTab == 2){
				this.triggerEvent('select', this.data._addrSelect)
				if(this.data.autoClose){
					this.close()
				}
				this._callback && this._callback(this.data._addrSelect, this)
				if (this._callbackClear) {
					this._callback = null
				}
			}
		}
	}
})
