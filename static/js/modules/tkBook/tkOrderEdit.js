define(function (require,exports,module) {
    var common = require("common");
    var $conn  = require("$conn");
    var tkOrderEdits = require("templates/tkBook/tkOrderEdit.html");

    var tkOrderEdit = Vue.extend({
        template: tkOrderEdits,
        data:function(){
        	return {
				"tkSearchInfo":"",
        		"tkVoyage1":"",
        		"tkVoyage2":"",
        		"empInfo":"",//登录人信息
        		"tkFlight":"",//航班列表
        		"price":"",//总价
        		"salePrice":"",//票价
        		"airportFee":"",//机建
        		"tax":"",//tax
        		"empName":"",
        		"email":"",
        		"phoneNumber":"",
        		"wbsx":"",//违背事项
        		"reasonDesc":"",//违背原因
        		"reasonCode":"",//违背事项代码
        		"cxrlength":0,//出行人数量
        		"tkxclist":"",//行程
        		"tkccsqd":"",
        		"tkcxrlist":[],
        		"userUrl":"",

        	}
        },
        created:function(){
			this.init();
			this.getUrlData();
		},
		//created --END--
        methods:{
        	init:function(){	
				this.tkSearchInfo=common.sessionget('tkSearchInfo');
				this.tkVoyage1=common.sessionget('tkVoyage1');
				this.tkVoyage2=common.sessionget('tkVoyage2');
				this.tkFlight=common.sessionget('tkFlightList');
				var tkcxrlist=common.sessionget('tkcxrlist');
				this.tkxclist=common.sessionget('tkxclist');//行程
				this.tkccsqd=common.sessionget('tkccsqd');//出差申请单
				
				//出行人数量
				if(tkcxrlist){		
					for(var i=0;i<tkcxrlist.length;i++){
						if(tkcxrlist[i].checked){					
							this.cxrlength+=1;
							this.tkcxrlist.push(tkcxrlist[i]);
						}
					}
				}
				//合计
				this.price=(this.tkFlight.priceMap[this.tkVoyage1.priceId].salePrice+this.tkVoyage1.info.airportFee+this.tkVoyage1.info.tax)*this.cxrlength;
				//机票价格
				this.salePrice=this.tkFlight.priceMap[this.tkVoyage1.priceId].salePrice;
				//机建
				this.airportFee=this.tkVoyage1.info.airportFee;
				//税费
				this.tax=this.tkVoyage1.info.tax;
				
	
				//登录人信息
				this.empInfo=common.getUserInfo().empInfo;
				this.email=this.empInfo.email;
				this.empName=this.empInfo.empName;
				this.phoneNumber=this.empInfo.phoneNumber;
	
				//违背事项 原因
				this.reasonDesc=this.$route.query.reasonDesc;
				this.reasonCode=this.$route.query.reasonCode;
				this.wbsx=this.$route.query.wbsx;
        	},
			bookOrder:function(n){
				if(n==0){
					var queryString={
					  "ccsqdId":"",
					  "ccsqdNo":"",
					  "costCenterCode": "",
					  "costCenterId": "",
					  "costCenterName": "",
					  "empRank": this.tkSearchInfo.empRank,
					  "linkEmail": this.email,
					  "linkMan": this.empName,
					  "linkTel": this.phoneNumber,
					  "orderFrom": 10506,
					  "postCode": "",//邮编
					  "projectCode": "",
					  "projectId": "",
					  "projectName": "",
					  "rangeType":  this.tkSearchInfo.dc?1:2,
					  "reciAddr": "",//收件地址
					  "reciPhone": "",
					  "reciPient": "",//收件人
					  "routeId": "",//行程ID
					  "sendMode": 1,//公司统一配送
					  //"supplierId": "",//供应商id 
					  "travelNo": "",//出差申请单号
					  "travelStandard":this.tkSearchInfo.empRank,//标准员工职级 
					  "tripType": this.tkSearchInfo.tripType//因公因私
					};
					queryString.psgList=[];
					queryString.rangeList=[];
					//乘机人集合
					for(var i=0,len=this.tkcxrlist.length;i<len;i++){
						var cxrlist={
						      "empId":this.tkcxrlist[i].empId,
						      "idType": this.tkcxrlist[i].idNumber?'NI':'ID',
						      "idno": this.tkcxrlist[i].idNumber?this.tkcxrlist[i].idNumber:this.tkcxrlist[i].passport,
						      "phoneNumber":this.tkcxrlist[i].phoneNumber,
						      "psgName": this.tkcxrlist[i].empName,
						      "psgType": 1,
						      "sex": this.tkcxrlist[i].sex,
						      "sn": i
						};
						queryString.psgList.push(cxrlist);
					}
					//单程 --->航程集合
					if(this.tkSearchInfo.dc){
						var rangelist={
					      "cacheId": this.tkVoyage1.cacheId,
					      "priceId": this.tkVoyage1.priceId,
					      "rangeList":this.tkVoyage1.cabinKey,
					      "reasonCode": this.reasonCode,
					      "reasonDesc": this.reasonDesc,
					      "recomCabin": "",
					      "recomDepartTime": "",
					      "recomFlightNo": "",
					      "recomPrice": 0
					    }
						queryString.rangeList.push(rangelist);
						//供应商ID
						queryString.supplierId=this.tkVoyage1.priceMap[this.tkVoyage1.priceId].supplierId;
					}else{
					//往返 --->航程集合
						queryString.rangeList=[
							{
						      "cacheId": this.tkVoyage1.cacheId,
						      "priceId": this.tkVoyage1.priceId,
					          "rangeList":this.tkVoyage1.cabinKey,
						      "reasonCode": this.reasonCode,
						      "reasonDesc": this.reasonDesc,
						      "recomCabin": "",
						      "recomDepartTime": "",
						      "recomFlightNo": "",
						      "recomPrice": 0
						   },
						   {
						      "cacheId": this.tkVoyage2.cacheId,
						      "priceId": this.tkVoyage2.priceId,
					      	  "rangeList":this.tkVoyage2.cabinKey,
						      "reasonCode": this.reasonCode,
						      "reasonDesc": this.reasonDesc,
						      "recomCabin": "",
						      "recomDepartTime": "",
						      "recomFlightNo": "",
						      "recomPrice": 0
						    }
						]
						//供应商ID
						queryString.supplierId=this.tkVoyage2.priceMap[this.tkVoyage2.priceId].supplierId;
					}
					
					var bookOrder=$conn.getConn('tkQuery.bookOrder');
					bookOrder(queryString,function(res){
						common.sessionset('tkOrderList',res.data);
						Vue.router.goPath("/tkBookcmp");
						
						
					},function(res){
						mui.confirm(res.tips,'',['重新查询'],function(){
							Vue.router.goPath("/flightlist?againQuery=1");
						})
					})
				}
			},
			subtract:function(n){
				var self=this;
				mui.confirm('确定删除吗?','',['取消','确定'],function(e){
					e.index == 0 ?mui.closePopup(): self.del(n);
					Vue.nextTick(function () {});
				})
			},
			del:function(n){
				for(var i=0;i<this.tkcxrlist.length;i++){
					if(this.tkcxrlist[i].empId==n){	
						Vue.set(this.tkcxrlist[i],'checked',false);
					}
				}
				common.sessionset('tkcxrlist',this.tkcxrlist);
				this.init();
				this.$router.go(0);
			},
			addEmp:function(n,m){
				(n==0)&&Vue.router.goPath("/cxr?type=tkOrderEdit");
				(n==1)&&Vue.router.goPath("/addContacts?addxjr=1&id="+m);
			},
			back:function(){
				if(this.userUrl!= ''){
					Vue.router.goPath('/'+this.userUrl);
				}else{
					mui.back();
				}
			},
			getUrlData:function(){
			    var type = this.$route.query.type;
			    if(type!=undefined){
			    	this.userUrl = type;
			    }else{
			    	this.userUrl=''
			    }
			},
      	},
      	watch:{

       	},
       	activated:function(){
				
       	}

    });
    
    module.exports = tkOrderEdit;
});