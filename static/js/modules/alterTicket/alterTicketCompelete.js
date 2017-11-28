define(function(require, exports, module) {
	var alterTicketCompelete = require("templates/alterTicket/alterTicketCompelete.html");
	var common = require("common");
	var $conn = require("$conn");
	require('css/alterTicket/alterTicketCompelete.css');
	var VueComponent = Vue.extend({
		template: alterTicketCompelete,
		data: function() {
			return {
				alterRangeArr: [],

			}
		},
		created: function() {

		},
		mounted: function() {
			this.getAlterDetail();
		},
		methods: {
			getAlterDetail: function() {
				//				var queryString = {
				//					changeId: 'c60a08e112f944bdb3fd36f4ebeb9c33'
				//				}
				var queryString = {
					changeId: this.$route.query.changeOrderId
				};
				console.log(queryString)
				$conn.getConn("alterTicket.findChangeOrderByChangeId")(queryString, function(resp) {
					this.alterRangeArr = resp.data;
					console.log(resp.data)
				}.bind(this));

			},
			lookAlterDetail: function(id) {
				Vue.router.goPath('/alterTicketDetail?changeId=' + id);
			},
			toSendApply: function(id) {
				Vue.router.goPath('/approvalSend?changeId=' + id);
			},
			toPay: function(id) {
				Vue.router.goPath('/pay?changeId=' + id);
			},
			toCancleAlter: function(id) {
				Vue.router.goPath('/alterTicketDetail?changeId=' + id);
			},
		}

	});

	module.exports = VueComponent;
});