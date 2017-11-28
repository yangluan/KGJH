
define(function (require,exports,module) {
    var chooseCompanyReason = require("templates/refundTicket/chooseCompanyReason.html");

	require('css/refundTicket/chooseCompanyReason.css');
	
    var $conn  = require("$conn");
	var common = require("common");
    var VueComponent = Vue.extend({
        template: chooseCompanyReason,
        data:function(){
        	return{
        		refundType:'1',
        		reasonList:[],
        		title:'',
        	}
        },
        created:function(){
        	this.getRouteData();
        },
        mounted:function(){
        	this.getCompanyReason();
        },
         activated:function(){
        	this.getRouteData();
        	this.getCompanyReason();
        },
        // 页面退出时，调用
        deactivated:function(){
        	
        },
        methods:{
        	goback:function(){
        		window.history.go(-1);
        	},
        	// 通过路由 判断状态  1. 企业退票原因  2. 非自愿退票原因
        	getRouteData:function(){
        		this.refundType = this.$route.query.refundType;
        		if(this.refundType=='1'){
        			this.title = "选择企业退票原因";
        		};
        		if(this.refundType == '2'){
        			this.title= "选择非自愿退票原因"
        		}
        	},
        	
        	getCompanyReason:function(){
        		//130 非自愿原因      135  自愿原因 
        		var parNo;
        		if(this.refundType=='1'){
        			parNo='135' 
        		};
        		if(this.refundType=='2'){
        			parNo='130' 
        		}
        		var queryString ={
        			parNo:parNo
        		}
        		// 如果参数 不为空
        		
        		 	$conn.getConn("refundTicket.getBClass")(queryString,function(resp){
        			say(resp.data)
        				this.reasonList = resp.data.list;	
        		}.bind(this));
        		 
        	},
        	chooseReason:function(val,index){
//      			if(typeof val.ischoosed ==undefined ){
        				Vue.set(val,'ischoosed',true);
        				var valString=JSON.stringify(val)
        				Vue.router.goPath("/applyRefundTicket?refundType="+ this.$route.query.refundType+"&chooseReason="+valString);
//      			}
        	}
        	
        	
        }
    });

    module.exports = VueComponent;
});
