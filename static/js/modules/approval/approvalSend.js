;
define(function(require, exports, module) {
	var approvalSend = require("templates/approval/approvalSend.html");
	var common = require("common");
	var $conn = require("$conn");
	require('css/approval/approvalSend.css');
	var VueComponent = Vue.extend({
		template: approvalSend,
		data: function() {
			return {
				orderType: '11001',
				orderId: "",
				spgzId: '',
				spDetail: '',
			}
		},
		created: function() {

		},
		mounted: function() {
			this.getApplyRuleId();

		},
		methods: {
			goback:function(){
				history.go(-1);
			},
			getApplyRuleId: function() {
				this.orderType = this.$route.query.orderType;
				var spgzId = this.$route.query.spgzId;
				// 判断是否  从路由里 获取 规则id
				if(spgzId!=undefined&&spgzId!=''){
					this.getApprovaDetail();
				}else{
					var userInfo = common.sessionget('userInfo');
				var bookEmpId = userInfo.empInfo.empId;
				var queryString = {
					bookEmpId: bookEmpId,
					djlx: this.orderType //单据类型
				};

				$conn.getConn("approval.vipSpkzNeedApproval")(queryString, function(resp) {
					this.spgzId = resp.data.spgzId;
					console.log(resp, '我的审批规则id');
					if(this.spgzId != '' && this.spgzId != undefined) {
						this.getApprovaDetail();
					};
				}.bind(this));
				}
				
			},
			//获取审批规则详情
			getApprovaDetail: function() {
				var queryString = {
					spgzId: this.spgzId
				};
				$conn.getConn("approval.vipSpgzGetInfo")(queryString, function(resp) {
					console.log(resp.data);
					this.spDetail = resp.data;
				}.bind(this));
			},
			//送审 
			getSendRule: function() {
				this.orderType = this.$route.query.orderType;
				var queryString = {
					orderId: this.$route.query.orderId,
					orderType: this.orderType,
					spgzId: this.spgzId,
					againApp: "0"
				};
				console.log(queryString)
				$conn.getConn("approval.vipBpmSendApp")(queryString, function(resp) {
//					mui.alert('送审成功！')	
					Vue.router.goPath('/subSuccess?orderId='+this.$route.query.orderId);
				}.bind(this));
			},
			// 去  送审
			toSend: function() {
				this.getSendRule();
			},
		},
	});
	module.exports = VueComponent;
});