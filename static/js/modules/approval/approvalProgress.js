define(function(require, exports, module) {
	var approvalProgress = require("templates/approval/approvalProgress.html");
	var common = require("common");
	var $conn = require("$conn");
	require('css/approval/approvalProgress.css');
	var VueComponent = Vue.extend({
		template: approvalProgress,
		data: function() {
			return {
				spjd: '',
				// 默认是正常 机票单
				orderType: 11001,
				// 审批进度数据
				approvalData: ''
			}
		},
		created: function() {
			this.getOrderType();
//			this.getApprovalData();
		},
		filters: {
			filterApprovalWay: function(val) {
				//      		审批状态 0.未开始1已通过 2未通过 3审批中 ,
				//              完成方式 1.PC2.手机app3.邮件4.短信 ,
				if(val == 1) {
					return 'PC';
				};
				if(val == 2) {
					return '手机app';
				};
				if(val == 3) {
					return '邮件';
				};
				if(val == 4) {
					return '短信';
				};
			},
			filterApprovalStatus: function(val) {
				if(val == 0) {
					return '未开始';
				};
				if(val == 1) {
					return '审批通过';
				};
				if(val == 2) {
					return '审批拒绝';
				};
				if(val == 3) {
					return '审批中';
				};
			},
		},
		methods: {
			getOrderType: function() {
				if(this.$route.query.orderType != undefined) {
					this.orderType = this.$route.query.orderType;
				}
				this.getApprovalProgress(this.$route.query.orderId);
			},
			getApprovalProgress: function(id) {
				//  11001     正常         11002  退票       11003     改签
				var queryString = {
					"orderId": id,
					"orderType": this.orderType
				};
//				var queryString = {
//					"orderId": 'dc7e88d66fa5427e829ce8ac56f54253',
//					"orderType": 11001
//				};
console.log(queryString)
				$conn.getConn("approval.vipOrderAppProgress")(queryString, function(resp) {
					console.log(resp,'审批进度详情')
					if(resp.data!=undefined&&resp.data!=''){
						this.approvalData = resp.data;
					}else{
						mui.alert('没有审批进度数据！')
					}
					

				}.bind(this));

			},
			// 模拟审批进度  数据
//			getApprovalData: function() {
//				this.approvalData = {
//					"sentEmpId": 0000000,
//					"sentEmpName": "侯鹏程",
//					"sentTime": "2017-10-10 05:50",
//					"spjd": "2/3",
//					"spjdInfoList": [
//					{
//						"appRemark": "我看好你啊",
//						"approveEmpName": "高山流水",
//						"completeTime": "2017-10-10 05:50",
//						"completeWay": 0,
//						"flowState": 1,
//						"sendUsageStats": "已发送"
//					},
//					{
//						"appRemark": "我看好你啊",
//						"approveEmpName": "雨雪霏霏",
//						"completeTime": "2017-10-10 05:50",
//						"completeWay": 0,
//						"flowState": 1,
//						"sendUsageStats": "已发送"
//					},
//					{
//						"appRemark": "我看好你啊",
//						"approveEmpName": "秋意绵绵",
//						"completeTime": "2017-10-10 05:50",
//						"completeWay": 0,
//						"flowState": 3,
//						"sendUsageStats": "已发送"
//					},
//					]
//				};
//			},

		}
	});

	module.exports = VueComponent;
});