define(function (require,exports,module) {
    var common = require("common");
    var $conn  = require("$conn");
    var tkViolateItems = require("templates/tkBook/tkViolateItem.html");
	require('css/tkBook/flightlist.css');

    var tkViolateItem = Vue.extend({
        template: tkViolateItems,
        data:function(){
        	return {
				"wbsx":"",//违背事项
				"reason":"",
				"reasonDesc":"",//违背原因说明
				"reasonCode":"",//违背原因代码
				"cacheId":"",
				"recomFlight":[],//前后两小时航班
				"ishow":false,//推荐航班显示
				"writeReason":"",//填写原因
				"ccsqdSearch":""
        	}
        },
        created:function(){
        	this.cacheId=common.sessionget('tkFlightList').cacheId;
			this.wbsx=this.$route.query.wbsx;
			var self=this;
        	var violateReasonList=$conn.getConn('tkQuery.violateReasonList');
        	violateReasonList('?by1=10901',function(res){
        		self.reason=res.data;
        		console.log(res.data);
        	},function(res){
				
        	})
        	this.ccsqdSearch=this.$route.query.ccsqdSearch;
//      	this.twoHours();
//      	var list = document.querySelector('.mui-table-view.mui-table-view-radio');
//				list.addEventListener('selected',function(e){
//					console.log("当前选中的为："+e.detail.el.innerText);
//				});
		},
		
        methods:{
      		getReason:function(m,n){
      			this.reasonCode=m;
      			this.reasonDesc=n;
      		},
      		save:function(n){
      			switch (n){
      				case 0:
	      				//保存	
	      				this.writeReason=this.writeReason?this.writeReason:"";
	      				if(!this.reasonCode||!this.reasonDesc){
	      					common.tips('请选择违背原因');
	      				}
	      				
	      				if(this.$route.query.wf==2){
							Vue.router.goPath("/flightlist?wf=2");
	      				}else if(this.ccsqdSearch==1){
	      					Vue.router.goPath("/applicationTravelPlan?type=tkViolateItem"+this.reasonDesc+"&reasonCode="+this.reasonCode+"&wbsx="+this.wbsx+"&writeReason="+this.writeReason);
	      				}else{
	      					Vue.router.goPath("/tkOrderEdit?type=tkViolateItem&reasonDesc="+this.reasonDesc+"&reasonCode="+this.reasonCode+"&wbsx="+this.wbsx+"&writeReason="+this.writeReason);      					
	      				}

      				break;
      				case 1:
	      				//推荐航班
						Vue.router.goPath("/tkOrderEdit?type=tkViolateItem");
      				break;
      			}
      		},
      		twoHours:function(){
      			var queryString={
      				"priceId":this.$route.query.priceId,
      				"cacheId":this.cacheId
      			};
      			var recommendFlight=$conn.getConn('tkQuery.recommendFlight');
      			recommendFlight(queryString,function(res){
      				self.recomFlight=res.data;
      			},function(res){
      				mui.alert(res.errMsg);
      				return false;
      			})
      		},
        },
        
      	watch:{

       	},
       	
       	activated:function(){
		
       	}

    });
    
    module.exports = tkViolateItem;
});