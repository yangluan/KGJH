define(function (require,exports,module) {
    var common = require("common");
    var $conn  = require("$conn");
    var tkBookcmps = require("templates/tkBook/tkBookcmp.html");

    var tkBookcmp = Vue.extend({
        template: tkBookcmps,
        data:function(){
        	return {
				"orderIds":"",
				"orderlist":[],
        	}
        },
        created:function(){
			this.init();
		},
		//created --END--
        methods:{
			toBook:function(){
				Vue.router.goPath("/tkQuery");
			},
			init:function(){
				var self=this;
				this.orderIds=common.sessionget('tkOrderList');
				console.log(this.orderIds);
				for(var i=0;i<this.orderIds.length;i++){
					var orderDetail=$conn.getConn('tkQuery.orderDetail');
					orderDetail("?id=882b03c9ac55441fbb5f28a975be55bf",function(res){
						self.orderlist.push(res.data);
						console.log(self.orderlist);
					},function(res){
						
					})
				}
				//同行
				var queryTxOrder=$conn.getConn('tkQuery.queryTxOrder');
				queryTxOrder("?orderIds=882b03c9ac55441fbb5f28a975be55bf",function(res){
					console.log(res.data);
				},function(res){
				
				})
			},
			toDetail:function(id){
				Vue.router.goPath("/tkOrderDetails?orderId=" + id);
			},
      	},
      	watch:{

       	},
       	activated:function(){
		
       	}

    });
    
    module.exports = tkBookcmp;
});