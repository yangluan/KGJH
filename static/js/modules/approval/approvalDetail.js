;
define(function(require, exports, module) {
	var approvalDetail = require("templates/approval/approvalDetail.html");
	var common = require("common");
	var $conn = require("$conn");
	require('css/approval/approvalDetail.css');
	var alterTicketDetail = require('js/modules/alterTicket/alterTicketDetail.js');
	var refundTicketDetail = require('js/modules/refundTicket/refundTicketDetail.js');
	var tkOrderDetails = require('js/modules/tkBook/tkOrderDetails.js');
	var applicationDetail = require('js/modules/application/DetailsApplications.js');
	var VueComponent = Vue.extend({
		template: approvalDetail,
		components:{
			alterTicketDetail,
			refundTicketDetail,
			tkOrderDetails,
			applicationDetail
		},
		data: function() {
			return {
				appRemark: '',
				orderType:'11001',
				orderId:'',
			}
		},
		created:function(){
			this.getRouteQuery();
		},
		methods: {
			// 获取路由参数 ,根据单据类型  记载 模块详情；
			getRouteQuery: function() {
				var orderType = this.$route.query.orderType;	
				console.log(orderType);
				if(orderType == undefined ){
					return false;
				}else{
					this.orderType=orderType;
					if(orderType==11001){
						this.orderId = this.$route.query.orderId;
					}else if(orderType==11002){
						this.orderId = this.$route.query.refundId;
					}else if (orderType==11003){
						this.orderId = this.$route.query.changeId;
					}else if(orderType == 11099){
						this.orderId = this.$route.query.orderId;
					}
					console.log(this.orderId,'订单id')
				};
				

			},
			//审批结果操作
			approvalResult: function(num) {
				//审批方式(1.PC2.手机app3.邮件4.短信) ,
				var queryString = {
					"appRemark": this.appRemark,
					"completeState": num,
					"completeWay": 2,
					"orderId": this.orderId,
					"phoneNumber": "string",
					
					"workItemId": this.$route.query.workItemId
				};
				console.log(queryString)
				$conn.getConn("approval.vipBpmReceiveAppResult")(queryString, function(resp) {

				}.bind(this));
			},
		}

	});

	module.exports = VueComponent;
});