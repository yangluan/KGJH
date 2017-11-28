define(function(require, exports, module) {
	var alterFlightList = require("templates/alterTicket/alterFlightList.html");
	var common = require("common");
	var $conn = require("$conn");
	require('css/alterTicket/alterFlightList.css');
	var VueComponent = Vue.extend({
		template: alterFlightList,
		data: function() {
			return {
				flightMap: {},
				alterFlightData: {},
				flightList: [],
			}
		},
		created: function() {
			this.getAlterFlightList();
		},
		mounted: function() {

		},
		methods: {
			goback: function() {
//				history.go(-1);
            Vue.router.goPath('/applyAlterTicket')
			},
			setFlightData: function() {

				//				function transform(obj) {
				//					var arr = [];
				//					for(var item in obj) {
				//						arr.push(obj[item]);
				//					}
				//					return arr;
				//				};
				//			this.flightList =	transform(this.flightMap);
				//			Vue.set(this.flightList[0],'isChoosed',true)
				//				console.log(this.flightList)

			},
			getAlterFlightList: function() {
				var queryString = {
					"alterType": this.$route.query.alterType,
					"arriveAirport": this.$route.query.arriveAirport,
					"departAirport": this.$route.query.departAirport,
					"departDate": this.$route.query.departDate,
					"orderId": this.$route.query.orderId,
					"rangeId": this.$route.query.rangeId,
					'showNoSeat':1,
				};
				$conn.getConn("alterTicket.tkChangeQueryFlight")(queryString, function(resp) {
					this.alterFlightData = resp.data;
					common.sessionset('alterFlightData',resp.data)
					this.flightMap = resp.data.flightMap;
					this.setFlightData();
					say(resp.data)
				}.bind(this));
			},
			// 选中一个 舱位 回显 信息
			chooseFlightItem: function(val, flight) {
				// 如果 航班数据
				
				//
				if(typeof val.isChoosed == undefined) {
					Vue.set(val, 'isChoosed', true);
				} else {
					val.isChoosed = !val.isChoosed;
				};
				if(val.isChoosed) {
					say('+++++++')
					Vue.set(val, 'isChoosed', true);
					for(var key in this.flightMap) {
						if(key != flight) {
							Vue.set(this.flightMap[key], 'isChoosed', false);
						}
					}
				};
				if(val.isChoosed == false){
					say('---------')
					Vue.set(val, 'isChoosed', false);
				};
			},
			// 选择舱位
			chooseCang:function(cang,flightNo){
				Vue.router.goPath('/applyAlterTicket?cang=' + cang + '&flightNo=' + flightNo + 
				'&rangeId=' + this.$route.query.rangeId + '&orderId=' + this.$route.query.orderId);
			},

		},
	});

	module.exports = VueComponent;
});