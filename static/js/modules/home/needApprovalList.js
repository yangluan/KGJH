;
define(function(require, exports, module) {
	var needApprovalList = require("templates/home/needApprovalList.html");
	var common = require("common");
	var $conn = require("$conn");
	require('css/home/needApprovalList.css');
	var VueComponent = Vue.extend({
		template: needApprovalList,
		data: function() {
			return {
				isOneClick: true,
				isTwoClick: false,
				person: '',
				approvalingList: [], //待审批列表数据
				approvaledList: [],
				num: ''
			}
		},
		created: function() {
			this.getNoApprovalList();
			this.getYesApprovalList();
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
			goback: function() {
				history.go(-1);
			},
			switch1: function() {
				this.isOneClick = true;
				this.isTwoClick = false;

			},
			switch2: function() {
				this.isOneClick = false;
				this.isTwoClick = true;
			},
			getNoApprovalList: function() {
				var queryString = {
					pageNum: 1,
					count: 15,
					person: this.person
				};
				$conn.getConn("approval.vipBpmForMyApp")(queryString, function(resp) {
					console.log(resp.data)
					this.approvalingList = resp.data.list;
				}.bind(this));
			},
			getYesApprovalList: function() {
				var queryString = {
					pageNum: 1,
					count: 15,
					person: this.person
				};
				$conn.getConn("approval.vipBpmForMyApped")(queryString, function(resp) {
					console.log(resp.data)
					this.approvaledList = resp.data.list;
				}.bind(this));

			},
			//去审批详情页面
			goApprovalingDetail: function(id, workItemId, orderType) {
				console.log(id,workItemId,orderType)
				if(orderType == '' || orderType == undefined) {
					return false;
				} else {
					if(orderType == 11001) {
						Vue.router.goPath('/approvalDetail?orderId=' + id + '&workItemId=' + workItemId + '&orderType=' + orderType);
					} else if(orderType == 11002) {
						Vue.router.goPath('/approvalDetail?refundId=' + id + '&workItemId=' + workItemId + '&orderType=' + orderType);
					} else if(orderType == 11003) {
						Vue.router.goPath('/approvalDetail?changeId=' + id + '&workItemId=' + workItemId + '&orderType=' + orderType);
					} else if(orderType == 11099) {
						Vue.router.goPath('/approvalDetail?orderId=' + id + '&workItemId=' + workItemId + '&orderType=' + orderType);
					} else if(orderType == 11098){
						Vue.router.goPath('/approvalDetail?orderId=' + id + '&workItemId=' + workItemId + '&orderType=' + orderType);
					}
				}
			},

			// 搜索 出行人
			searchBookMan: function() {
				// 默认待审批
				setTimeout(function() {
					if(this.isOneClick) {
						this.getNoApprovalList();
					} else {
						this.getYesApprovalList();
					}
				}.bind(this), 1000)

			}
		}
	});

	module.exports = VueComponent;
});