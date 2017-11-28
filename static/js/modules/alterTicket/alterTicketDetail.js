define(function(require, exports, module) {
	var alterTicketDetail = require("templates/alterTicket/alterTicketDetail.html");
	var common = require("common");
	var $conn = require("$conn");
	require('css/alterTicket/alterTicketDetail.css');
	var VueComponent = Vue.extend({
		template: alterTicketDetail,
		data: function() {
			return {
				alterDataDetail: '',
				payWay: '',

				isShowApproval: 0,
				//----改签进度
				isShowTai1: true,
				isShowTai2: false,
				isShowTai3: false,
				isShowTai4: false,
				isShowTai5: false,
				isShowTai6: false,
			}
		},
		created: function() {

		},
		mounted: function() {
			this.getAlterTicketDetail();
		},
		filters: {
			filterArriveTime: function(val) {
				return val.substr(11, 5);
			},
			DateYueOrRi: function(val) {
				var gao, hao;
				gao = val.substr(5, val.length - 5).split('-');
				hao = gao[0] + '月' + gao[1] + '日';
				return hao;
			},
			filterWeek: function(val) {
				var date = new Date(val);
				var week;
				if(date.getDay() == 0) week = "周日";
				if(date.getDay() == 1) week = "周一";
				if(date.getDay() == 2) week = "周二";
				if(date.getDay() == 3) week = "周三";
				if(date.getDay() == 4) week = "周四";
				if(date.getDay() == 5) week = "周五";
				if(date.getDay() == 6) week = "周六";
				return week;
			},
		},
		computed: {

		},
		methods: {
			getAlterTicketDetail: function() {
				var queryString = {
					changeOrderId: this.$route.query.changeId
				};
				$conn.getConn("alterTicket.tkChangeOrderDetail")(queryString, function(resp) {
					this.alterDataDetail = resp.data;
					console.log(resp.data)
				}.bind(this));

			},
			panDuanZhuangTai: function(Tai) {
				var Num = Tai - 0;
				if(Tai > 0) {
					for(var i = 0; i < Num; i++) {
						if(i < num) {
							var a = i + 1;
							Vue.set(this, 'isShowTai' + a, true);
						}
					}
				};
			},
			//操作按钮
			toPay: function(id) {
				Vue.router.goPath('/pay?orderId=' + id + "&orderType=" + orderType);
			},
			toSend: function(id) {
				Vue.router.goPath('/approvalSend?orderId=' + id + "&orderType=" + orderType + '&type=allorder')
			},
			//取消改签单
			cancleAlter: function(id) {
				mui.confirm('您确定要取消退票吗？', '', ['取消', '确定'], function(e) {
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

		},
	});

	module.exports = VueComponent;
});