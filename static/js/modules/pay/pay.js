define(function(require, exports, module) {
	var pay = require("templates/pay/pay.html");
	var common = require("common");
	var $conn = require("$conn");
	require('css/pay/pay.css');
	var count = '15:00';
	var VueComponent = Vue.extend({
		template: pay,
		data: function() {
			return {
				time: count,
				orderDetail: '',
				payList: [],
				payListgao: '',
				// ----------
				showAlert: false,
				chaoShi: false,
				payLose: false,
				// ------------获取支付列表入参-----
				orderType: '11001',
				payScene: '12706',
				// ------支付入参--------
				payMethod: '',
				payRemark: '',
				orderList: [],
				paySubject: '',
				reMsg: '',
			}
		},
		created: function() {

		},
		mounted: function() {
			this.resetCount();
			this.getOrderDetail();
			this.getPaySubject();

		},
		computed: {
			//			count:function(){
			//				
			//			}
		},
		filters: {
			DateYueOrRi: function(val) {
				var gao, hao;
				gao = val.substr(5, val.length - 5).split('-');
				hao = gao[0] + '月' + gao[1] + '日';
				return hao;
			},
		},
		methods: {
			resetCount: function() {
				count = '15:00';
				this.times();
			},
			// -------------倒计时处理--------------
			times: function() {
				var self = this;
				setInterval(function() {
					var countNum = self.chuLiTimeString(count)
					countNum = countNum - 1;
					//					console.log(countNum);
					count = self.chuLiTime(countNum);
					self.time = count;
					Vue.set(self, 'time', count);
					//					Vue.set([self.time], 'time', count)
					if(count <= 0) {
						count = 0;
					}
				}, 1000)
			},
			// 将ms 数转换为 15:00格式；
			chuLiTime: function(num) {
				var mm = parseInt(num / 1000 / 60 % 60, 10); //计算剩余的分钟数  
				var ss = parseInt(num / 1000 % 60, 10); //计算剩余的秒数 
				mm = checkTime(mm);
				ss = checkTime(ss);
				return mm + ' : ' + ss;

				function checkTime(i) {
					if(i < 10) {
						i = "0" + i;
					}
					return i;
				};
			},
			// 将15:00 转换为ms ；
			chuLiTimeString: function(countString) {
				var min = countString.split(':')[0];
				var sec = countString.split(':')[1];
				var countNum = Number(min * 60 * 1000) + Number(sec * 1000);
				return countNum;
			},

			//----------------获取订单详情
			getOrderDetail: function() {
				var queryString = {
					id: this.$route.query['orderId']
				};
				$conn.getConn("order.orderDetail")(queryString, function(resp) {
					console.log(resp)
					this.orderDetail = resp.data;

				}.bind(this));
			},
			//-----------获取支付科目
			getPaySubject: function() {
				this.orderType = this.$route.query.orderType;
				if(this.orderType == '11001') {
					this.payScene = '12706';
				};
				if(this.orderType == '11003') {
					this.payScene = '12707';
				};
				var queryString = {
					"orderBeans": [{
						"orderId": this.$route.query['orderId'],
						"orderType": this.orderType,
					}],
					"payScene": this.payScene
				};
				$conn.getConn("pay.getPaySubject")(queryString, function(resp) {
					this.payListgao = resp.data;
					this.payList = resp.data['paySubjects'];
					say(resp.data)
				}.bind(this));
			},

			//去支付
			// ---------点击下单按钮
			toPayCompelete: function() {
				if(this.count != "00:00") {
					this.toDiaoPayAjax();
				} else {
					mui.alert('支付超时了')
				}
			},
			toDiaoPayAjax: function() {
				var orderListgao = [];
				var obj = {
					"orderId": this.orderDetail.id,
					"orderType": this.orderDetail.orderType,
					"payAmount": this.orderDetail.totalPrice,
					"payRemark": ""
				};
				orderListgao.push(obj);
				var queryString = {
					"orderList": orderListgao,
					"payMethod": this.payMethod,
					"payScene": this.payScene,
					"paySubject": this.paySubject
				};
				$conn.getConn("pay.onlinePay")(queryString, function(resp) {
					say(resp);
					common.sessionset('payData', resp)
					this.reMsg = resp.data.reMsg;
					var that = this;
					setTimeout(function() {
						if(that.reMsg != undefined && that.reMsg != '') {
							var payDiv = that.$refs.mybox;
							say(payDiv)
							var form = payDiv.children[0]
//							console.log(form)
							form.submit();							
						};
					}, 500);

					console.log(this.reMsg)
				}.bind(this));
			},
			// --------单选问题-----
			toChoosePayType: function(val, i) {
				Vue.set(val, 'isChoose', true);
				if(val.isChoose) {
					this.payMethod = val['payMethod'];
					this.paySubject = val['subjectId'];
					for(var a = 0; a < this.payList.length; a++) {
						if(a != i) {
							Vue.set(this.payList[a], 'isChoose', false);
						}
					}
				};
			},
		}
	});

	module.exports = VueComponent;
});