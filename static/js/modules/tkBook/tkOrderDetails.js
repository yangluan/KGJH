define(function(require, exports, module) {
	var common = require("common");
	var $conn = require("$conn");
	var tkOrderDetailss = require("templates/tkBook/tkOrderDetails.html");

	var tkOrderDetails = Vue.extend({
		template: tkOrderDetailss,
		data: function() {
			return {
				"hbInfo":"",
				"id":"",
				
			}
		},
		created: function() {
			this.getUrlData();
			
			var self=this;
			this.id=this.$route.query.orderId;
			var orderDetail=$conn.getConn('tkQuery.orderDetail');
			orderDetail('?id='+this.id,function(res){
				self.hbInfo=res.data;
			},function(res){
				
			})
		},
	
		methods: {
			//
			getUrlData:function(){
			    var type = this.$route.query.type;
			    if(type!=undefined){
			    	this.userUrl = type;
			    }else{
			    	this.userUrl=''
			    }
			},
			refundTips:function(m,n){
				mui.alert('<span class="font-bold">退票规则:</span>'+m+'。<br><span class="font-bold">改签规则:</span>'+n,'','知道了')
			},
			back:function(){
				mui.back();
			},
			btnClick:function(n){
				switch(n){
					case 0:
					Vue.router.goPath('/pay?orderId='+this.id+'&orderType=11001');
					break;
					case 1:
					break;
					case 2:
					break;
					case 3:
					break;
				}
			},
		}
	});
	
	module.exports = tkOrderDetails;
});

    
 // 调用说明     路由传参       yourUrl 指你自己的路由  
// /path: '/chooseApplicationList?type='+  yourUrl;
  