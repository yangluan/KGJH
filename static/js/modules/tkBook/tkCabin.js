define(function (require,exports,module) {
    var common = require("common");
    var $conn  = require("$conn");
    var tkCabins = require("templates/tkBook/tkCabin.html");
	require('css/tkBook/flightlist.css');


    var tkCabin = Vue.extend({
        template: tkCabins,
        data:function(){
        	return {
				"date1":"",
				"dep":"",
				"arr":"",
				"depszm":"",//出发三字码
				"arrszm":"",//到达三字码
				"info":"",//当此航班信息
				"cabinTypeList":"",//舱位类型
				"cabinMap":"",
				"priceMap":"",
				"wbsxList":"",//违背事项集合
				"wbsxCode":"",//违背事项代码
				"wbsx":"",//违背事项
				"priceId":"",//价格ID
				"cacheId":"",
				"tkSearchInfo":"",//查询信息集合
				"wf":'',//往返
				"cabinKey":"",
				"ccsqdSearch":"",
				
        	}
        },
        created:function(){
        	this.ccsqdSearch=this.$route.query.ccsqdSearch;
        	this.wf=this.$route.query.wf;//获取往返标识
        	this.tkSearchInfo=common.sessionget('tkSearchInfo');//搜索信息
        	var cache=common.sessionget('tkFlightList');//航班列表
        	
        	//this.tkQStatus=common.sessionget('tkQStatus');//是否因私
        	if(common.sessionget('tkViolateItem')){
        		this.wbsxList=common.sessionget('tkViolateItem');//违背列表        		
        	}

			this.cacheId=cache.cacheId;//缓存ID

			this.$route.query.key;//航班Key
			var flightInfo=cache.flightMap[this.$route.query.key];//选中航班信息
			this.info=flightInfo;

			this.dep=this.$route.query.dep;
			this.arr=this.$route.query.arr;
			this.cabinTypeList=flightInfo.cabinTypeList;//仓位类型集合
			this.cabinMap=flightInfo.cabinMap;//舱位集合
			this.priceMap=cache.priceMap;//价格集合
			//因私 未开启差旅标准 不获取违背信息
			if(this.tkSearchInfo.tripType==1&&this.tkSearchInfo.zcGnjp==1){		
				this.wbsxCode=this.wbsxList[this.info.minPriceId].violateCode;
				this.wbsx=this.wbsxList[this.info.minPriceId].violateItem;
			}
			var queryString={
				  "date": this.info.departDate,
				  "flightNo":this.info.flightNo
				}
			var queryFlightStop=$conn.getConn('tkQuery.queryFlightStop');
			queryFlightStop(queryString,function(res){
					console.log(res.data);
			},function(res){
				
			})
		},
        methods:{
			refundTips:function(m,n){
				mui.alert('<span class="font-bold">退票规则:</span>'+m+'。<br><span class="font-bold">改签规则:</span>'+n,'','知道了')
			},
			bookTkOrder:function(m,n){
				var self=this;
				console.log(n);
				//舱位键
				this.cabinKey=this.info.departDate+"_"+this.info.flightNo+"_"+n;
				var queryString={
					"cacheId":this.cacheId, 
					"cabinKey":this.cabinKey 
				};
				var validateTimeOut=$conn.getConn('tkQuery.validateTimeOut');
				validateTimeOut(queryString,function(res){
					var tkVoyage={
						"wbsxCode":self.wbsxCode,
						"wbsx":self.wbsx,
						"priceId":m,
						"cacheId":self.cacheId,
						"info":self.info,
						"priceMap":self.priceMap,
						"cabinKey":self.cabinKey,
						"cabinType":n
					};
					(self.wf==1||self.tkSearchInfo.dc)&&common.sessionset('tkVoyage1',tkVoyage);			
					(self.wf==2)&&common.sessionset('tkVoyage2',tkVoyage);

					if(self.wf==2){
						if(self.ccsqdSearch==1){
							Vue.router.goPath("/applicationTravelPlan?type=tkCabin");	
						}else{							
							Vue.router.goPath("/tkOrderEdit?type=tkCabin");	
						}
					}else if((self.wf==1)&&self.wbsxCode&&self.wbsx){
						Vue.router.goPath("/tkViolateItem?wbsxCode="+self.wbsxCode+"&wbsx="+self.wbsx+"&priceId="+m+'&wf=2'+'&ccsqdSearch='+self.ccsqdSearch);	
					}else if((self.wf==1)&&!self.wbsxCode&&!self.wbsx){
						Vue.router.goPath("/flightlist?wf=2");	
					}else{
						if(self.wbsxCode&&self.wbsx){
							Vue.router.goPath("/tkViolateItem?wbsxCode="+self.wbsxCode+"&wbsx="+self.wbsx+"&priceId="+m+"&ccsqdSearch="+self.ccsqdSearch);	
						}else{
							if(self.ccsqdSearch==1){
								Vue.router.goPath("/applicationTravelPlan?type=tkCabin");	
							}else{	
								Vue.router.goPath("/tkOrderEdit?type=tkCabin");	
							}
						}
					}
				},function(res){
					mui.confirm(res.errMsg,'',['重新查询'],function(){
						Vue.router.goPath("/flightlist?againQuery=1");
					});
				})


			},
        },
        filters:{
        	zhekou:function(val){
        		var a=Math.floor(val*100)/10;
        		a=a.toFixed(1);
        		return a;
        	}
        },
		activated:function(){


		}
    });

    module.exports = tkCabin;
});