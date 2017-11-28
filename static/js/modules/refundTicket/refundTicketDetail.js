define(function(require, exports, module) {
	var refundTicketDetail = require("templates/refundTicket/refundTicketDetail.html");
	var common = require("common");
	var $conn = require("$conn");
	require('css/refundTicket/refundTicketDetail.css');
	var VueComponent = Vue.extend({
		template: refundTicketDetail,
		data: function() {
			return {
				exitDetailData: {},
				tkOrderPsgBean: {},
				//退票状态
				zhuangTai: '1',
				isShowTai1: true,
				isShowTai2: false,
				isShowTai3: false,
				isShowTai4: false,
				isShowTai5: false,
				isShowTai6: false,
				//--------
				isShowApproval: 0,
			}
		},
		created: function() {
			this.getRefundDetail();
		},
		mounted: function() {

		},
		methods: {
			goback: function() {
				Vue.router.goPath('/home');
			},
			getRefundDetail: function() {
				var queryString = {
					refundId: this.$route.query.refundId
				};
				$conn.getConn("refundTicket.refundOrderDetail")(queryString, function(resp) {
					say(resp.data)
					this.exitDetailData = resp.data;
					this.tkOrderPsgBean = resp.data.tkOrderPsgBean;
					this.isShowApproval = resp.data['isShowApproval'];
					this.zhuangTai = resp.data['refundStatus'];
					this.xianShiPanDuan(this.zhuangTai);
				}.bind(this));
			},
			//送审
			sendApply: function(id) {
				//      		Vue.router.goPath('/orderApprove?orderId=' + id);
				Vue.router.goPath('/approvalSend?orderId=' + id + "&orderType=11002");
			},
			//取消退票
			cancleRefundTicket: function(id) {
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
					say(resp.data);
				})
			},
			// 查看退票政策
			lookRefundDetail: function(rule) {
				if(rule==''){
					mui.alert('退票政策为空！')
				}else{
					mui.alert(rule)
				}
				
			},
			//------------------
			xianShiPanDuan: function(tai) {

				if(tai == '1') {
					this.isShowTai1 = true,
						this.isShowTai2 = false,
						this.isShowTai3 = false,
						this.isShowTai4 = false,
						this.isShowTai5 = false,
						this.isShowTai6 = false;
				};
				if(tai == '2') {
					this.isShowTai1 = true,
						this.isShowTai2 = true,
						this.isShowTai3 = false,
						this.isShowTai4 = false,
						this.isShowTai5 = false,
						this.isShowTai6 = false;
				};
				if(tai == '3') {
					this.isShowTai1 = true,
						this.isShowTai2 = true,
						this.isShowTai3 = true,
						this.isShowTai4 = false,
						this.isShowTai5 = false,
						this.isShowTai6 = false;
				};
				if(tai == '4') {
					this.isShowTai1 = true,
						this.isShowTai2 = true,
						this.isShowTai3 = true,
						this.isShowTai4 = true,
						this.isShowTai5 = false,
						this.isShowTai6 = false;
				};
				if(tai == '5') {
					this.isShowTai1 = true,
						this.isShowTai2 = true,
						this.isShowTai3 = true,
						this.isShowTai4 = true,
						this.isShowTai5 = true,
						this.isShowTai6 = false;
				};
				if(tai == '6') {
					this.isShowTai1 = true,
						this.isShowTai2 = true,
						this.isShowTai3 = true,
						this.isShowTai4 = true,
						this.isShowTai5 = true,
						this.isShowTai6 = true;
				}

			},
			// 
		}
	});

	module.exports = VueComponent;
});