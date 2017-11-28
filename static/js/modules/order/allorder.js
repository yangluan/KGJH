define(function(require, exports, module) {
	var allOrder = require("templates/order/allorder.html");
	var common = require("common");
	var $conn = require("$conn");
	require('css/order/allorder.css');
	var VueComponent = Vue.extend({
		template: allOrder,
		data: function() {
			return {
				isPersonOrder: true,
				isAllOrder: false,
				isActiveTabItem: 0,
				// ------------------
				orderList: [],
				// ---------获取全部订单入参---------
				dateEnd: "2017-11-10",
				dateStart: "2017-07-17",
				dateType: 1,
				findScope: 1,
				findType: 1,
				pageNum: 1,
				psgName: '',
				productType: '10901',
				tripType: '',
				count: '40',
				// ----------
				zongCount: 0,
				willPayCount: 0,
				noTravelCount: 0,
				exitOrAlterCount: 0,
				//--------
				isShowErr: '',
			}
		},
		created: function() {
			this.routerChuLi();
		},
		mounted: function() {

		},
		activated: function() {},
		filters: {
			gongOrSiChuLi: function(val) {
				if(val == 1) {
					return '公';

				} else {
					return '私';
				}
			},
			chuliDate:function(val){
				return val.substr(5,val.length - 5)
			}
		},
		methods: {
			//			返回上一级
			goback: function() {
				Vue.router.goPath('/userCenter')
			},
			// 路由处理
			routerChuLi: function() {
				if(this.$route.query.filterData != undefined && this.$route.query.filterData != '') {
					var fliterData = JSON.parse(this.$route.query.filterData);
					console.log(fliterData)
					this.dateStart = fliterData.dateStart;
					this.dateEnd = fliterData.dateEnd;
					this.dateType = fliterData.dateType;
					this.productType = fliterData.productType;
					this.tripType = fliterData.tripType;
					this.findType = fliterData.findType;
					this.findScope = fliterData.findScope;
					if(this.findScope==1){
						this.toPersonOrder();
					}else{
						this.toAllOrder();
					}
					this.getRouterAndSetTabStyle(this.findType);
				} else {
					this.findType = this.$route.query.findType;
					this.getRouterAndSetTabStyle(this.findType);
				}

			},
			// 路由获取 默认样式
			getRouterAndSetTabStyle: function(val) {
				this.getOrderNum();
				if(val == 1) {
					this.toAllTab();
				} else if(val == 2) {
					this.toNoPay();
				} else if(val == 3) {
					this.toNoTravel();
				} else {
					this.toExitOrAlter();
				}
			},
			//个人订单 
			toPersonOrder: function() {
				this.isPersonOrder = true;
				this.isAllOrder = false;
				this.findScope = 1;
				this.isLoadedLe = false;
				this.getOrderNum();
				this.getOrderList();
			},
			//全部订单
			toAllOrder: function() {
				this.isPersonOrder = false;
				this.isAllOrder = true;
				this.findScope = 2;
				this.isLoadedLe = false;
				this.getOrderNum();
				this.getOrderList();
			},
			//全部 tab
			toAllTab: function() {
				this.isActiveTabItem = 0;
				this.findType = 1;
				this.isLoadedLe = false;
				this.getOrderList();
			},
			//未支付 tab
			toNoPay: function() {
				this.isActiveTabItem = 1;
				this.findType = 2;
				this.isLoadedLe = false;
				this.getOrderList();
			},
			//未出行  tab
			toNoTravel: function() {
				this.isActiveTabItem = 2;
				this.findType = 3;
				this.isLoadedLe = false;
				this.getOrderList();
			},
			// 退改签 tab
			toExitOrAlter: function() {
				this.isActiveTabItem = 3;
				this.findType = 4;
				this.isLoadedLe = false;
				this.getOrderList();
			},

			// 获取列表
			getOrderList: function() {
				var queryString = {
					//                  "ccsqdId": this.ccsqdId,
					//出差申请单id
					"count": this.count,
					//每个页面显示数量
					"dateEnd": this.dateEnd,
					//日期止
					"dateStart": this.dateStart,
					//日期始
					"dateType": this.dateType,
					//1 预订日期,2 是出发/入住日期) ,
					"findScope": this.findScope,
					//1是个人订单,2是全部订单 ,
					"findType": this.findType,
					//1全部订单 2待支付 3待出行 4退改 5指定的业务订单（productType必须传值） ,
					//              "orderNo": this.orderNo,
					// 订单号 
					"pageNum": this.pageNum,
					//当前页
										"productType": this.productType,
					//: 产品类型(10901国内机票,10902国际机票,10903酒店,10904火车票,10999其他)
					//              "psgName": this.psgName,
					// 乘机人
					"tripType": this.tripType,
				};
				$conn.getConn("order.totalOrderList")(queryString, function(resp) {
					say(resp.data);
					this.orderList = resp.data.list;
				}.bind(this));
			},
			// 获取订单数量
			getOrderNum: function() {
				var queryString = {
					"dateEnd": this.dateEnd,
					"dateStart": this.dateStart,
					"dateType": this.dateType,
					"findScope": this.findScope,
					"findType": this.findType,
					//					"productType": this.productType,
					//                 "psgName": this.psgName,
					"tripType": this.tripType,
				};
				$conn.getConn("order.totalCount")(queryString, function(resp) {
					say(resp)
					this.zongCount = resp.data.totalOrderCount;
					this.willPayCount = resp.data.willPayCount;
					this.noTravelCount = resp.data.willTravelCount;
					this.exitOrAlterCount = resp.data.refundChangeCount;
				}.bind(this));
			},
			//获取当前时间
			getNowDate: function() {
				var date = new Date();
				var month = date.getMonth() + 1;
				var strDate = date.getDate();
				if(month >= 1 && month <= 9) {
					month = "0" + month;
				};
				if(strDate >= 0 && strDate <= 9) {
					strDate = "0" + strDate;
				};
				return date.getFullYear() + '-' + month + '-' + strDate;
			},

			//按钮 操作
			// 改签  操作
			toAlterTicket: function(id) {
				console.log(id)
				Vue.router.goPath('/applyAlterTicket?orderId=' + id);
			},
			//退票 按钮 操作
			toExitTicket: function(id) {
				Vue.router.goPath('/applyRefundTicket?orderId=' + id)
				console.log(id)
			},
			//支付操作
			toPay: function(id, orderType) {
				Vue.router.goPath('/pay?orderId=' + id + "&orderType=" + orderType);
			},

			//送审操作
			toSendApply: function(id, orderType) {
				Vue.router.goPath('/approvalSend?orderId=' + id + "&orderType=" + orderType + '&type=allorder');
			},

			//取消改签    
			cancleAlter: function(id) {
				mui.confirm('您确定要取消改签吗？', '', ['取消', '确定'], function(e) {
					e.index == 0 ? '' : this.toCancleAlterAjax(id);
					Vue.nextTick(function() {});
				}.bind(this));
			},
			toCancleAlterAjax: function(id) {
				var queryString = {
					changeId: id
				};
				$conn.getConn("alterTicket.cancelChangeOrder")(queryString, function(resp) {
					console.log(resp)
					mui.alert('取消改签成功！')
				}.bind(this));
			},
			//取消退票
			cancleRefund: function(id) {
				mui.confirm('您确定要取消退票吗？', '', ['取消', '确定'], function(e) {
					e.index == 0 ? '' : this.toCancleRefundAjax(id);
					Vue.nextTick(function() {});
				}.bind(this));
			},
			toCancleRefundAjax: function(id) {
				var queryString = {
					refundOrderId: id
				};
				$conn.getConn("refundTicket.refundCancel")(queryString, function(resp) {
					console.log(resp)
					mui.alert('取消退票成功！')
				}.bind(this));
			},
			//取消 订单
			cancleOrder: function(id) {
				mui.confirm('您确定要取消订单吗?', '', ['取消', '确定'], function(e) {
					e.index == 0 ? '' : this.toCancleOrderAjax(id);
					Vue.nextTick(function() {});
				}.bind(this));
			},
			toCancleOrderAjax: function(id) {
				var queryString = {
					orderId: id
				};
				$conn.getConn("order.cancelTkOrder")(queryString, function(resp) {
					console.log(resp)
					mui.alert('取消订单成功！')
				}.bind(this));
			},
			//去筛选页面     列表大筛选
			toOrderFilter: function() {

				Vue.router.goPath('/orderFilter?findScope=' + this.findScope + '&findType=' + this.findType);
			},
			//去订单详情
			toOrderDetail: function(id) {
				Vue.router.goPath('/tkOrderDetails?orderId=' + id);
			}

		}
	});

	module.exports = VueComponent;
});