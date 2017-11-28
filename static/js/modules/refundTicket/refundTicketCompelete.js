

define(function (require,exports,module) {
    var refundTicketCompelete = require("templates/refundTicket/refundTicketCompelete.html");
    var common = require("common");
    var $conn  = require("$conn");
	require('css/refundTicket/refundTicketCompelete.css');
    var VueComponent = Vue.extend({
        template: refundTicketCompelete,
        data:function(){
        	return {
            refundOrderId: '',
            exitDataList:[],		
        	}
        },
        created:function(){
        	this.getRefundDetail();
        },
        mounted:function(){
        	
        },
        methods:{
        	// 返回首页
        	goback:function(){
        		Vue.router.goPath('/home');
        	},
        	//
        	getRefundDetail:function(){
        		
        		var refundIdListString = this.$route.query.refundIdList;
        		if(refundIdListString.indexOf(',') >= 0){
        			var refundIdList = refundIdListString.split(',');
        			for (var a = 0; a < refundIdList.length; a++) {
                    this.getOrderListData(refundIdList[a]);
                  };
        		}else{
        			this.getOrderListData(refundIdListString);
        		};	
        	},
        	//请求获取  单个 退票详情
        	getOrderListData:function(id){
        		var queryString = {
        			refundId: id
        		};
        		$conn.getConn("refundTicket.refundOrderDetail")(queryString,function(resp){ 		
        		  say(resp.data);
        		  var exitDataItem = resp.data;
        		  this.exitDataList.push(exitDataItem);
        		}.bind(this));
        	},
        	//取消退票 
        	cancleRefundTicket:function(id){
        		var queryString = {
        			refundOrderId: id
        		};
        		$conn.getConn("refundTicket.refundCancel")(queryString,function(resp){ 		
                      say(resp.data);
        		})
        	},
        	//查看 退票详情
        	lookRefundTicketDetail:function(id){
        		Vue.router.goPath('/refundTicketDetail?refundId=' + id);
        	},
        	//去送审
        	sendApply:function(id){
        		Vue.router.goPath('/orderApprove?orderId=' + id);
        	},
        	
        }
    });

    module.exports = VueComponent;
});