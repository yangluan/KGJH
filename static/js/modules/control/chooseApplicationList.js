define(function(require, exports, module) {
	var chooseApplicationList = require("templates/control/chooseApplicationList.html");
	var common = require("common");
	var $conn = require("$conn");
	require('css/control/chooseApplicationList.css');
	var VueComponent = Vue.extend({
		template: chooseApplicationList,
		data: function() {
			return {
				chooseApplyList: [],
				userUrl:'',
			}
		},
		created: function() {
			//函数调用
			this.getUrlData();
			this.getApplicationList();
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
			
			//获取接口，设置函数回调
			getApplicationList: function() {
				var queryString = {
					pageNum: '1',  //默认显示第一页
					count:'9999',  //每页显示10条数据
					status:'2'     //已经审批通过的
					
				};
				$conn.getConn("user.vipCcsqdGetList")(queryString, function(resq) {
					console.log(resq.data);
					//获取到列表数据
					this.chooseApplyList=resq.data.list;
					
				}.bind(this));
			},
			//选择某一项
			chooseRightApply:function(val,index){
				Vue.set(val,'isChoosed',true);
				console.log(val.ccsqdId);
				if(this.userUrl!= ''){
					Vue.router.goPath('/'+this.userUrl+'?ccsqdid='+val.ccsqdId);

				}
			},
			back:function(){
				mui.back();
			},
		}
	});
	
	module.exports = VueComponent;
});

    
 // 调用说明     路由传参       yourUrl 指你自己的路由  
// /path: '/chooseApplicationList?type='+  yourUrl;
  