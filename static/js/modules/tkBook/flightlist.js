define(function (require,exports,module) {
    var common = require("common");
    var $conn  = require("$conn");
    var flightlists = require("templates/tkBook/flightlist.html");
	require('css/tkBook/flightlist.css');


    var flightlist = Vue.extend({
        template: flightlists,
        data:function(){
        	return {
				"date1":"",
				"dep":"",
				"arr":"",
				"depszm":"",//出发三字码
				"arrszm":"",//到达三字码
				"yesterdayPrice":"",//前一天价格
				"TomorrowPrice":"",//后一天价格
				"todayPrice":"",
				"flightList":"",//航班数据
				"priceMap":"",//价格数据
				"cacheId":"",
				"wbsxList":"",//违背事项
				"tripType":"",//1因公2因私
				"userUrl":"",//上级url
				"showhc1":"",//显示第一段航程
				"tkVoyage1":"",//第一程航段信息
				"tksechInfo":"",//搜索信息
				"showXc":"",//出差申请单模式
				"dc":"",//单程
				"flightmaps":"",
				"v":'',//舱位代码
				"defaults":"",//默认列表
				"flightpx":"",//排序
				"ccsqdSearch":"",
				"tkScreenlist":"",//筛选条件
				"iscabinScreen":false,//舱位筛选条件
				"cabinScreen":"",//舱位筛选条件
				"datex1":""
        	}
        },
        
        created:function(){
			this.init();
			this.defaults=true;
			this.tkScreenlist=common.sessionget('tkScreenlist');
			if(this.tkScreenlist&&this.tkScreenlist!='[]'){
				this.tkscreen();
			}
		},
        methods:{
        	init:function(){
        			mui.init();
        			this.ccsqdSearch=this.$route.query.ccsqdSearch;
					this.tksechInfo=common.sessionget('tkSearchInfo');
					//仓位条件
					this.cabinScreen=this.tksechInfo.cabinScreen;
					if(this.cabinScreen){
						this.cabinScreen=this.cabinScreen.split('/');						
					}
					
					this.dc=this.tksechInfo.dc;

					this.arr=this.tksechInfo.arr;
					this.dep=this.tksechInfo.dep;

					this.tripType=this.tksechInfo.tripType;
					
					this.userUrl=this.$route.query.type;
					Vue.set(this,'tkVoyage1',common.sessionget('tkVoyage1'));
					console.log(common.sessionget('tkVoyage1'));
					
					if(this.userUrl!='tkScreen'){
						if(this.$route.query.wf==2){
								this.tkVoyage1&&(this.showhc1=true);
							   	var cache=this.tksechInfo.dep;
					          	this.dep=this.tksechInfo.arr;
					          	this.arr=cache;
					          	var szm=this.tksechInfo.depszm;
				        	  	this.depszm=this.tksechInfo.arrszm;
				    	      	this.arrszm=szm;
					          	this.date1=this.tksechInfo.date2;
					          				       		 var da=common.FormatDate(this.date1);
				       		 var dat=da.date.split('-');
							Vue.set(this,'datex1',dat[1]+'月'+dat[2]+'日'+' ('+da.week+')');
					          	this.search(this.v);
						}else{				
							this.search(this.v);
						}
					}
					if(this.$route.query.dateNo==1){
	//				this.date1=this.$route.query.date;
	debugger
					Vue.set(this,'date1',this.$route.query.date);
							var da=common.FormatDate(this.$route.query.date);
				       		 var dat=da.date.split('-');
							Vue.set(this,'datex1',dat[1]+'月'+dat[2]+'日'+' '+da.week+'');
				}
        	},
        	search:function(v){
				if(!this.date1){				
					this.date1=this.$route.query.date1;
												var da=common.FormatDate(this.date1);
				       		 var dat=da.date.split('-');
							Vue.set(this,'datex1',dat[1]+'月'+dat[2]+'日'+' '+da.week+'');
				}

				if(this.$route.query.againQuery==0){					
					this.arrszm=this.$route.query.arrszm;
					this.depszm=this.$route.query.depszm;
				}
				//超时重新查询
				if(this.$route.query.againQuery==1){
					this.arrszm=this.tksechInfo.arrszm;
					this.depszm=this.tksechInfo.depszm;
				}
			
			    var self=this;
				var queryString={
				  "arriveAirport": this.$route.query.arrszm||this.tksechInfo.arrszm,
				  "departAirport": this.$route.query.depszm||this.tksechInfo.depszm,
				  "empRank": this.$route.query.empRank||this.tksechInfo.empRank,
				  "tripType": this.$route.query.tripType||this.tksechInfo.tripType				
				};
				if(this.$route.query.againQuery==1){
					queryString.departDate=this.tksechInfo.date1;
				}
//				if(this.showXc){
//					queryString.departDate=this.date1;
//				}
				else{
					queryString.departDate=this.date1?(this.date1.split(' ')[0]):this.$route.query.date1;
				}
				var queryFlight=$conn.getConn('tkQuery.queryFlight');
				queryFlight(queryString,function(res){
					var flightData=res.data;
					var flightMap = flightData.flightMap;
					
					self.flightmaps = flightData.flightMap;
					
					var flightList = objToArr(flightMap);

					common.sessionset('tkFlightList',flightData);
					
					
					switch(v){
						case 1:
						
							var a=flightList.sort(function(a, b){
								var r = a.minPrice > b.minPrice;//升序
//								r = orderType == "12" ? !r : r;
								return r ? "1" : "-1";
							});
						console.log(a);
						
						
//							function sortarr1(arr){
//							    for(i=0;i<arr.length-1;i++){
//							        for(j=0;j<arr.length-1-i;j++){
//							            if(arr[j].departTime>arr[j+1].departTime){
//							                var temp=arr[j];
//							                arr[j]=arr[j+1];
//							                arr[j+1]=temp;
//							            }
//							        }
//							    }
//							    return arr;
//							}
//							var newarr=sortarr1(flightList);
//							console.log(newarr);
//							Vue.set(self,'flightList',newarr);
						break;
						case 2:
							function sortarr2(arr){
							    for(i=0;i<arr.length-1;i++){
							        for(j=0;j<arr.length-1-i;j++){
							            if(arr[j].departTime>arr[j+1].departTime){
							                var temp=arr[j];
							                arr[j]=arr[j+1];
							                arr[j+1]=temp;
							            }
							        }
							    }
							    return arr;
							}
							var newarr=sortarr2(flightList);
//							self.flightmaps=newarr;
							Vue.set(self,'flightList',newarr);
						break;
						case 3:
							function sortarr3(arr){
								console.log(arr);
							    for(i=0;i<arr.length-1;i++){
							        for(j=0;j<arr.length-1-i;j++){
							            if(arr[j].minPrice>arr[j+1].minPrice){
							                var temp=arr[j];
							                arr[j]=arr[j+1];
							                arr[j+1]=temp;
							            }
							        }
							    }
							    return arr;
							}
							var newarr=sortarr3(flightList);
								console.log(newarr);
							Vue.set(self,'flightList',newarr);
						break;
						case 4:
						
							function sortarr4(arr){
							    for(i=0;i<arr.length-1;i++){
							        for(j=0;j<arr.length-1-i;j++){
							            if(arr[j].minPrice<arr[j+1].minPrice){
							                var temp=arr[j];
							                arr[j]=arr[j+1];
							                arr[j+1]=temp;
							            }
							        }
							    }
							    return arr;
							}
							var newarr=sortarr4(flightList);
							Vue.set(self,'flightList',newarr);
						break;
						case '':
							function sortarr5(arr){
							    for(i=0;i<arr.length-1;i++){
							        for(j=0;j<arr.length-1-i;j++){
							            if(arr[j].departTime>arr[j+1].departTime){
							                var temp=arr[j];
							                arr[j]=arr[j+1];
							                arr[j+1]=temp;
							            }
							        }
							    }
							    return arr;
							}
							var newarr=sortarr5(flightList);
							Vue.set(self,'flightList',newarr);
						break;
					}
					
					
					
					
					
					
					Vue.set(self,'TomorrowPrice',flightData.weekPrice[4].price);
					Vue.set(self,'todayPrice','￥'+flightData.dayMinPrice.salePrice);
					Vue.set(self,'yesterdayPrice',flightData.weekPrice[2].price);
					
					Vue.set(self,'flightList',flightList);

					
					if(!self.date1){				
						self.date1=self.$route.query.date1;
													var da=common.FormatDate(self.date1);
				       		 var dat=da.date.split('-');
							Vue.set(this,'datex1',dat[1]+'月'+dat[2]+'日'+' ('+da.week+')');
					}else{
						self.date1=self.date1;	
																			var da=common.FormatDate(self.date1);
				       		 var dat=da.date.split('-');
							Vue.set(this,'datex1',dat[1]+'月'+dat[2]+'日'+' ('+da.week+')');
					}
					self.cacheId=flightData.cacheId;
					
//					self.matchClbz();
					//因私 不匹配
					if(self.tripType==1){
			       		var queryString={
			       			"cacheId":self.cacheId,
			       			"minZj":self.tksechInfo.empRank,
			       		};
			       		var matchClbzs=$conn.getConn('tkQuery.matchClbz');
			       		matchClbzs(queryString,function(res){
			       			self.wbsxList=res.data;
							common.sessionset('tkViolateItem',res.data);
			       		},function(res){
			       			mui.alert(res.errMsg);
			       		})
					}

					

				},function(res){
					mui.confirm(res.tips,'',['返回','刷新'],function(e){
						e.index == 0 ?Vue.router.goPath("/tkQuery"): self.init();
						Vue.nextTick(function () {});
					});
				})
        	},
	        getDate1:function(n){
	        	if(this.showXc){return false;}
	        	var self=this;
				switch (n){
					case 0:
						var a=self.date1.split('-');
						var d = new Date(a[0],a[1],a[2]);
						console.log(d.getMonth());
						var c=d.getTime()-24*60*60*1000;
						c=common.FormatDate(c);
						self.date1=c;
			       		 var da=common.FormatDate(c);
			       		 var dat=da.date.split('-');
						Vue.set(this,'datex1',dat[1]+'月'+dat[2]+'日'+' ('+da.week+')');
						self.search();
						Vue.nextTick(function () {});
					break;
					case 1:					
						Vue.router.goPath("/date?type=flightlist&dateNo=1");
					break;								
					case 2:
						var a=self.date1.split('-');
						var d = new Date(a[0],a[1],a[2]);
						console.log(d.getMonth());
						var c=d.getTime()+24*60*60*1000;
						c=common.FormatDate(c);
						self.date1=c;
						var da=common.FormatDate(c);
			       		 var dat=da.date.split('-');
						Vue.set(this,'datex1',dat[1]+'月'+dat[2]+'日'+' ('+da.week+')');
						self.search();
						Vue.nextTick(function () {
							
						});//flightlist.$el.textContent === 'new message' // true
					break;
				}
	       	},
	       	matchClbz:function(){

	       	},
	       	footer:function(n){
	       		var self=this;
	       		switch(n)
				{
					case 1:
						if(self.v==1||self.v==0){
							self.v=2;
							Vue.set(self,'defaults',false);
							Vue.set(self,'flightpx',true);
							self.search(self.v);
						}else{
							self.v=1;
							Vue.set(self,'defaults',false);
							Vue.set(self,'flightpx',true);
							self.search(self.v);							
						}
					  break;
					case 2:
						if(self.v==3){
							self.v=4;
							Vue.set(self,'defaults',false);
							Vue.set(self,'flightpx',true);
							self.search(self.v);
						}else{
							self.v=3;
							Vue.set(self,'defaults',false);
							Vue.set(self,'flightpx',true);
							self.search(self.v);							
						}
					break;
					case 3:
					  Vue.router.goPath("/tkScreen");
					  break;
					default:

				}
	       	},
	       	selectedFlight:function(key,ke){
//	       		if(this.userUrl&&this.userUrl!= ''){
//					Vue.router.goPath('/'+this.userUrl);
//				}else{
					if(this.showhc1){
						Vue.router.goPath("/tkCabin?key="+key+'&dep='+this.dep+'&arr='+this.arr+'&wf=2'+'&ccsqdSearch='+this.ccsqdSearch);						
					}else if(!this.dc){
						Vue.router.goPath("/tkCabin?key="+key+'&dep='+this.dep+'&arr='+this.arr+'&wf=1'+'&ccsqdSearch='+this.ccsqdSearch);						
					}else{
						Vue.router.goPath("/tkCabin?key="+key+'&dep='+this.dep+'&arr='+this.arr+'&ccsqdSearch='+this.ccsqdSearch);						
					}
//				}
	       	},
	       	getUrlData:function(){
			    var type = this.$route.query.type;
			    if(type!=undefined){
			    	this.userUrl = type;
			    }else{
			    	this.userUrl='';
			    }
			},
			back:function(){
				mui.back();
			},
			tkscreen:function(){//筛选
				var sc=this.tkScreenlist || "";
				var de=sc.split('|');
				
				var filters = {};
				filters.timer = de[0] === "" ? [] : de[0].split(',');//时间
				filters.depart = de[1] === "" ? []: de[1].split(',');//起飞
				filters.arrive = de[2] === "" ? [] : de[2].split(',');//到达
				filters.cabin = de[3] === "" ? [] : de[3].split(',');//舱位		
				filters.hkgs = de[4] === "" ? [] : de[4].split(',');//航空公司

		
				var flightList = common.sessionget('tkFlightList')
				
				var fft = ["filterHkgs","filterTimer","filterDepart","filterArrive"];//基于航班信息的过滤器枚举
				var fcbt = ["filterCabinType"];//基于舱位等级的过滤器枚举
				
				for(var no in flightList){
					var ft = flightList[no];
					ft.isshow = true;
					ft.flightshow = "1";
					for( var fi in fft ){
						if( funs[fft[fi]].call(this, filters, ft) == -1){
							ft.isshow = false;
							break;
						}
					}
					if( ft.isshow ){
						var cbt = ft.cabinTypeList, showcount = cbt.length;
						for( var cbti in cbt){
							cbt[cbti].cabinHide = false;
							for( var fi in fcbt ){
								if( funs[fcbt[fi]].call(this, filters, cbt[cbti]) == -1){
									cbt[cbti].cabinHide = true;
									showcount -- ;
									break;
								}
							}
						}
						if( showcount == 0 ){//如果航班下，没有任何舱位满足，则整个航班隐藏
							ft.isshow = false;
						}
					}
				};
				this.flightList=flightList;
			
			},
			getMinPrice : function(){
				
			}
        },
        filters:{
        	zhekou:function(val){
        		var a=Math.floor(val*100)/10;
        		a=a.toFixed(1);
        		return a;
        	}
        },
		activated:function(){
			this.getUrlData();
			this.init();
		},

    });


	//k-v对象转对象数组 {"a":0,"d":1,"b":2} - [{"name":"a","value":0},{"name":"d","value":1},{"name":"b","value":2}]
	function objToArr(obj){
		var arr = [];
		obj = obj || {};
		for(var k in obj){
			arr.push(obj[k]);
		}
		return arr;
	};

	var funs = {};
	
	
	function filterflight(filters, name, fun){
		var rules = filters[name];
		if( rules.length > 0 ){
			for( var i in rules ){
				if(fun.call(this, rules[i]) === true){//callfun返回true，结束循环，返回1
					return 1;
				}
			}
			return -1;
		}
		return 0;
	};
	
	//航空公司过滤  直接在遍历 flightMap 里面筛选
	funs.filterHkgs = function(filters, ft){
		return filterflight(filters, "hkgs", function(rule){
			if(ft.airline == rule){//只要有一个满足，返回 true
				return true;
			}
		});
	};
	//起飞时间段过滤  直接在遍历 flightMap 里面筛选
	funs.filterTimer = function (filters, ft){
		return filterflight(filters, "timer", function(rule){
			var times = rule.split("-");
			if(ft.departTime >= times[0] && ft.departTime < times[1]){//只要有一个满足，返回 true
				return true;
			}
		});
	};
	//起飞机场过滤  直接在遍历 flightMap 里面筛选
	funs.filterDepart = function (filters, ft){
		return filterflight(filters, "depart", function(rule){
			if(ft.departAirport == rule){//只要有一个满足，返回 true
				return true;
			}
		});
	};
	//到达机场过滤  直接在遍历 flightMap 里面筛选
	funs.filterArrive = function (filters, ft){
		return filterflight(filters, "arrive", function(rule){
			if(ft.arriveAirport == rule){//只要有一个满足，返回 true
				return true;
			}
		});
	};
	//舱位类型过滤  在遍历 cabinTypeList 里面筛选
	funs.filterCabinType = function (filters, cbt){
		return filterflight(filters, "cabin", function(rule){
			if(rule.indexOf("," + cbt.cabinType + ",") > -1){//只要有一个满足，返回 true
				return true;
			}
		});
	};

    module.exports = flightlist;
});