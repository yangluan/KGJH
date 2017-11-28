	;
define(function(require, exports, module) {
	var applyAlterTicket = require("templates/alterTicket/applyAlterTicket.html");
	var common = require("common");
	var $conn = require("$conn");
	require('css/alterTicket/applyAlterTicket.css');
	var VueComponent = Vue.extend({
		template: applyAlterTicket,
		data: function() {
			return {
				tkOrderPsgBeanList: [],
				tkOrderRangeBeanList: [],
				// 查询航班    入参
				"alterType": 1,
				"departDate": "",
				//改签后数据数组
				alterHouFlight: [],
				//入参  大比拼
				changeReasonVip: '',
				changeReasonCodeVip: '',
				changeReason: '',
				changeReasonCode: '',

				// 乘机人 id 集合
				psgIdList: [],
				WillRangeArr: [],

				//返回列表参数
				findType: 1,

				//--------tip 提示  非改签原因
				isShowNoRefundReason: false,
			}
		},
		created: function() {
//			this.getRangeAndpass();
//			this.getRouteData();
		},
		mounted: function() {

		},
		activated: function() {
			this.getRouteData();
		},

		methods: {
			//初始状态判断路由
			getRouteData: function() {
				//改签航班数据 
				var cang = this.$route.query.cang || '';
				var flightNo = this.$route.query.flightNo || '';
				var rangeId = this.$route.query.rangeId;
				// 路由数据
				var chooseReason = this.$route.query.chooseReason || '';
				var orderId = this.$route.query.orderId || '';
				console.log(orderId)
				if(orderId=='' && !chooseReason){  // 如果查询航班，但不回显数据，就返回 false;
					return false;
				}
				if(orderId  && !cang) {  // 如果存在订单id ，并且路由参数 长度 =1 ， 走正常流程
					console.log('++++++');
					this.getRangeAndpass();
				};
				if(cang  && flightNo  && rangeId ) {  // 选择 改签航班 路由判断
					//调用函数 回显改签数据
					this.getFlightListRouter(cang, flightNo, rangeId);

				};
				if(chooseReason ) { // 选择原因 路由判断
					say(chooseReason)
					var companyReason = JSON.parse(this.$route.query.chooseReason);
					// 企业改签原因
					if(this.$route.query.refundType == '1') {
						this.changeReasonVip = companyReason.cName;
						this.changeReasonCodeVip = companyReason.id;
					};
					//企业 非自愿改签
					if(this.$route.query.refundType == '2') {
						this.changeReason = companyReason.cName;
						this.changeReasonCode = companyReason.id;

						// 判断 如果 在选择非自愿原因时，选择 了客人自愿退票  id=13001 时，tip出现，已经选择的非自愿退票原因清空！
						if(companyReason.id == 13001) {
							this.isShowNoRefundReason = false;
							this.changeReason = '';
						}

					};

				};
				console.log(this.$route.query, 'query')

			},

			// 选择改签开始时间
			getStartDate: function() {
				mui.init();
				var dtPicker = new mui.DtPicker({
					"type": "date"
				});
				var self = this;
				dtPicker.show(function(selectItems) {
					self.departDate = selectItems.y.value + '-' + selectItems.m.value + '-' + selectItems.d.value;
				})
			},
			// 返回
			goback: function() {
				common.sessionremove('alterFlightData');
				Vue.set(this, 'alterHouFlight', [])
				console.log(common.sessionget('alterFlightData'));
				Vue.router.goPath('/allorder?findType=' + this.findType)
			},
			// 航班回显操作    存储 改签航班 和 去重 改签航班
			getFlightListRouter: function(cang, flightNo, rangeId) {
				var AlterData = common.sessionget('alterFlightData');
				var flightItem;
				if(AlterData != undefined) {
					console.log(AlterData)
					flightItem = AlterData.flightMap[flightNo];
					if(this.alterHouFlight != undefined) {
						if(this.alterHouFlight.length == 0) {
							flightItem.cang = cang;
							flightItem.cacheId = AlterData.cacheId;
							flightItem.rangeId = rangeId;
							this.alterHouFlight.push(flightItem);
						} else {
							flightItem.cang = cang;
							flightItem.rangeId = rangeId;
							flightItem.cacheId = AlterData.cacheId;
							this.alterHouFlight.push(flightItem);
							for(var i = 0; i < this.alterHouFlight.length - 1; i++) {
								if(this.alterHouFlight[i][rangeId] == rangeId) {
									this.alterHouFlight.splice(i, 1)
								}
							}
						}
					};
				};
				say(this.alterHouFlight)
				say(AlterData.flightMap.flightNo);
			},

			//获取乘机人 和 航段
			getRangeAndpass: function() {
				var queryString = {
					orderId: this.$route.query.orderId
				};

				$conn.getConn("alterTicket.applyTkChange")(queryString, function(resp) {
					this.tkOrderPsgBeanList = resp.data.changePsgList;
					this.tkOrderRangeBeanList = resp.data.changeRangeList;
					this.orderId = resp.data.orderId;
				}.bind(this));
			},
			//选择一个航段  获取出发日期 和 出发地  目的地 
			chooseFLightItem: function(val, index) {
				if(typeof val.isChoosed == undefined) {
					Vue.set(val, 'isChoosed', true);
				} else {
					//					val.isChoosed =!val.isChoosed;
					if(!val.isChoosed) {
						Vue.set(val, 'isChoosed', true);
					} else {
						Vue.set(val, 'isChoosed', false);
					}
				};
				if(val.isChoosed) {
					this.departDate = val.departDate;
					var nowTime = this.getNowDate();
					if(nowTime > this.departDate) {
						this.departDate = nowTime;
					};
					say(val);
					//					for(var i = 0; i < this.tkOrderRangeBeanList.length; i++) {
					//						if(i != index) {
					//							Vue.set(val, 'isChoosed', false);
					//						};
					//					}
				}
			},
			// 选择要 改签 的乘机人
			choosePassItem: function(val, index) {
				if(typeof val.isChoosed == undefined) {
					Vue.set(val, 'isChoosed', true);
				} else {
					if(!val.isChoosed) {

						Vue.set(val, 'isChoosed', true);
					} else {
						Vue.set(val, 'isChoosed', false);
					}
				};
				if(val['isChoosed']) {
					this.psgIdList.push(val.psgId);
				} else {
					for(var i = 0; i < this.psgIdList.length; i++) {
						if(this.psgIdList[i] == val.psgId) {
							this.psgIdList.splice(i, 1);
							break;
						}
					}
				};
			},

			//选择改签  的 航段
			chooseAlterFlight: function(val, index) {
				if(typeof val.isChoosed == undefined) {
					Vue.set(val, 'isChoosed', true);
				} else {
					if(!val.isChoosed) {
						Vue.set(val, 'isChoosed', true);
					} else {
						Vue.set(val, 'isChoosed', false);
					}
				};

				say(val);
				var cabinKey = val.departDate + '_' + val.flightNo + '_' + val.cang;
				var obj = {
					"cabinKey": cabinKey,
					"cacheId": val.cacheId,
					"nCabin": val.cang,
					"nDepartTime": val.departDate,
					"nFlightNo": val.flightNo,
					"rangeId": val.rangeId
				};

				if(val['isChoosed']) {
					this.WillRangeArr.push(obj);
				};
				if(!val['isChoosed']) {
					for(var a = 0; a < this.WillRangeArr.length; a++) {
						if(this.WillRangeArr[a] == val.rangeId) {
							this.WillRangeArr.splice(a, 1);
							break;
						}
					}
				};
				say(this.WillRangeArr);

			},
			//获取改签出发日期

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

			//去 查询航班页面
			queryFlight: function(val) {
				if(this.departDate != undefined && this.departDate != '') {
					Vue.router.goPath('/alterFlightList?alterType=' + this.alterType +
						'&departDate=' + this.departDate + '&departAirport=' + val.departAirport +
						'&arriveAirport=' + val.arriveAirport + '&orderId=' + this.$route.query.orderId +
						'&rangeId=' + val.rangeId);
				} else {
					return false;
				}
			},
			//------选择非自愿原因--------
			toChooseNoReason: function() {
				this.isShowNoRefundReason = true;
				Vue.router.goPath('/chooseCompanyReason?type=applyAlterTicket&refundType=2');
			},
			// 去申请改签
			toApplyAlter: function() {
				if(this.changeReason == '') {
					this.changeType = 1;
				} else {
					this.changeType = 2;
				};

				if(this.WillRangeArr.length < 1) {
					mui.alert('请选择改签后航段！')
				};
				if(this.psgIdList.length < 1) {
					mui.alert('请选择改签乘机人！')
				};
				if(this.changeReasonVip == '') {
					mui.alert('请选择企业改签原因！')
				}
				var psgIds = this.psgIdList.join(',');
				var queryString = {
					"alterType": this.alterType,
					//					"changeProveUrl": "string",
					"changeReason": this.changeReason,
					"changeReasonCode": this.changeReasonCode,
					"changeReasonCodeVip": this.changeReasonCodeVip,
					"changeReasonVip": this.changeReasonVip,
					"changeType": this.changeType,
					"orderFrom": 10504,
					"orderId": this.orderId,
					"psgIds": psgIds,
					"ranges": this.WillRangeArr
				};
				say(queryString);
				$conn.getConn("alterTicket.tkChangeOrderAdd")(queryString, function(resp) {
					say(resp.data);
					var changeOrderId = resp.data;
					Vue.router.goPath('/alterTicketCompelete?changeOrderId=' + changeOrderId);
				});

			},

		}
	});

	module.exports = VueComponent;
});