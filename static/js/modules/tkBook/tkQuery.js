define(function (require,exports,module) {
    var common = require("common");
    var $conn  = require("$conn");
    var tkQuerys = require("templates/tkBook/tkQuery.html");

	require('css/tkBook/tkQuery.css');
		
		function tips(str){
			mui.toast(str,{ duration:'long', type:'div' }); 
		}

		//获取登录人信息
		var userInfo=common.sessionget("userInfo");    
		var vipCorp=userInfo.vipCorp;
		var empInfo=userInfo.empInfo;
    	var mask = mui.createMask();//callback为用户点击蒙版时自动执行的回调；

//mask.close();//关闭遮罩
    var tkQuery = Vue.extend({
        template: tkQuerys,
        data:function(){
        	return {
        		"isyg":false,//因公
        		"ygcor":true,
        		"yscor":false,
        		"wlcor":false,
        		"showclbz":false,//显示差旅标准
        		"dep":"",//出发城市
        		"arr":"",//到达城市
        		"depszm":"",
        		"arrszm":"",
        		"showccsqd":false,//显示出差申请单
        		"ccsqd":"",
        		"onlySelf":false,//订票范围本人
        		//"canOther":false,//订票范围大于本人
        		"outerSize":false,//为外来人预订
        		"onlyempName":"",
        		"minZj":"",//最小职级
        		"isYs":false,//是否因私
        		"date1":"",//出发日期
        		"date2":"",//返程日期
        		"datex1":"",
        		"datex2":"",
        		'dc':true,//单程,往返
        		"cxr":"",//出行人
        		"cw":"",//舱位
        		"useNameclbz":"",//使用*的差旅标准
        		"useclbz":"",//展示差旅标准
        		"ccsqdId":"",//出差申请单ID
        		"ccsqdInfo":"",//出差申请单详情
        		"showXc":false,//显示行程
//      		"xcSel":false,//行程 选中
        		"xcDSel":true,//待选中
        		"xcJSel":false,//禁止选中
        		"tkQStatus":"",//查询状态
        		"cabinScreen":"",//舱位筛选条件
        		"showcxr":true//因私不显示出行人
        	}
        },

        created:function(){
       		this.remove();
       		 var da=common.FormatDate(new Date(),1);
       		 this.date1=da.date;
       		 var dat=da.date.split('-');
			Vue.set(this,'datex1',dat[1]+'月'+dat[2]+'日'+' ('+da.week+')');
		},
		//created --END--
        methods:{
          // 因公
        	yg:function(){
        		this.yscor=false;
				this.ygcor=true;
				this.showcxr=true;
				
        		if(vipCorp.bookStyle==2){
        			(empInfo.appBook==1)?(this.showccsqd=false):(this.showccsqd=true);
        		   
        			if(this.ccsqdInfo){
						this.showXc=true;
        			}
        		}
        		if(empInfo.bookOutside==1){
					this.outerSize=true;
        			
        		}
				this.isYs=false;

				common.sessionset('tkQStatus',1);
        	},
          // 因私
          ys:function(){
			this.showccsqd=false;
			this.isYs=true;
			this.yscor=true;
			this.ygcor=false;
			this.onlySelf=false;
			this.showXc=false;
			this.showclbz=false;
			this.showcxr=false;
			this.outerSize=false;
			
			common.sessionset('tkQStatus',2);
			common.sessionremove('tkSearchInfo');
			common.sessionremove('tkcxrlist');
       		this.date1=common.FormatDate(new Date());
       		
          },
          // 为外来人预订
          tkoutRange:function(){
			this.wlcor=!this.wlcor;
          },
          //单程
          onlyWay:function(){
          	this.dc=true;
          	this.date2="";
          },
          //往返程
          wf:function(){
          	if(!this.dc){          		
				return false;
          	}else{          		
          		this.dc=false;
          	}
          },
          //选择出行人
          chossesCxr:function(){
			Vue.router.goPath("/cxr?isYs="+this.isYs+"&wlcor="+this.wlcor+'&showXc='+this.showXc+"&bookStyle="+vipCorp.bookStyle+"&appBook="+empInfo.appBook);
          },
          //选择出差申请单
          choseCcsqd:function(){
			Vue.router.goPath("/chooseApplicationList?type=tkQuery");
          },
          // 出发地
        	getCity:function(){
        		if(this.showXc){return false;}
				Vue.router.goPath("/yjIndexedList?urlPath=tkQuery&pathType=1&backTab=1");
        	},
          // 目的地
        	getCity2:function(){
        		if(this.showXc){return false;}
				Vue.router.goPath("/yjIndexedList??urlPath=tkQuery&pathType=1&backTab=2");
        	},
          //调换城市
          deparr:function(){
          	var cache=this.dep;
          	this.dep=this.arr;
          	this.arr=cache;
          	var szm=this.depszm;
          	this.depszm=this.arrszm;
          	this.arrszm=szm;
          },
          // 始发日
	        getDate1:function(){
	        	Vue.router.goPath("/date?type=tkQuery&dateNo=1");
	       	},
	      //返程日
	        getDate2:function(){
	        	Vue.router.goPath("/date?type=tkQuery&dateNo=2");
	        	
//	        	mui.init();
//				var dtPicker = new mui.DtPicker({"type":"date"});
//				var self=this;
//			    dtPicker.show(function (selectItems){
//			        self.date2=selectItems.y.value+'-'+selectItems.m.value+'-'+selectItems.d.value;
//			    })
	       	},
          // 舱位选择
	       	cabin:function(){
		       	 var picker = new mui.PopPicker();
		       	 var self=this;
				     picker.setData([{value:"",text:"不限舱位"},{value:"",text:"经济舱"},{value:"",text:"公务舱/头等舱"}]);
				     picker.show(function (selectItems) {
  				     console.log(selectItems[0].text);//智子
  				     self.cw=selectItems[0].text;
  				     console.log(selectItems[0].value);//zz
				     })
	       	},
	      //搜索
	      	search:function(){

	      		if(!this.dep){tips('请选择出发城市');return false;}
	      		if(!this.arr){tips('请选择到达城市');return false;}
	      		if(!this.date1){tips('请选择出发日期');return false;}
		      	if(!this.cxr&&!this.isYs){tips('请选择出行人');return false;}
	      		if(this.dep==this.arr){tips('出发到达城市不能相同');return false;}
	      		if(!this.dc&&!this.date2){tips('请选择返程日期');return false;}
	      		if(this.date2){
	      			if(this.date1>this.date2){
	      				tips('出发日期不能大于返程日期');
	      				return false
	      			}
	      		}
	      		if(vipCorp.bookStyle==2&&!this.ccsqd&&!this.isYs&&!this.outerSize){tips('请选择出差申请单');return false;}
	      		mask.show();//显示遮罩
	      		var tripType=1;
	      		this.isYs?tripType=2:tripType;
				Vue.router.goPath("/flightlist?dep="+this.dep+'&arr='+this.arr+'&date1='+this.date1+'&date2='+this.date2+'&empRank='+this.minZj+'&tripType='+tripType+'&depszm='+this.depszm+'&arrszm='+this.arrszm+'&showXc='+this.showXc);
				var tkSearchInfo={
					"dep":this.dep,//出发城市
					"arr":this.arr,//到达城市
					"depszm":this.depszm,//出发城市三字码
					"arrszm":this.arrszm,//到达城市三字码
					"date1":this.date1,//出发日期
					"date2":this.date2,//返程日期
					"empRank":this.minZj,//最低职级
					"tripType":tripType,//因公 因私
					"showXc":this.showXc,//是否走出差申请单
					"dc":this.dc,//单程or往返
					"cxr":common.sessionget('tkcxrlist'),//出行人集合
					"zcGnjp":vipCorp.zcGnjp,//是否开启差旅政策
					"outerSize":this.outerSize,//是否可为外来人订票
					"cabinScreen":this.cw//舱位
				};
				common.sessionset('tkSearchInfo',tkSearchInfo);
	      		
	      	},
	      //显示差旅标准
	      clbz:function(){
	      	//因私 或 未开启差旅政策  不匹配
	      	if(this.isYs||!vipCorp.zcGnjp||(vipCorp.zcGnjp==0)){
	      		return false;
	      	}
	      	var self=this;
	      	var queryString={
	      		"empRank":this.minZj,
	      		"arriveAirport":this.arrszm,
	      		"departAirport":this.depszm
	      	};
	      	if(!queryString.empRank||!queryString.arriveAirport||!queryString.departAirport){
	      		return false;
	      	}
	      	 var GetClzbByMinZj=$conn.getConn('tkQuery.GetClzbByMinZj');
	      	 GetClzbByMinZj(queryString,function(res){
	      	 	self.showclbz=true;
	      	 	res.data.clbz?(self.useclbz=res.data.clbz):"";
	      	 },function(res){
	      	 	
	      	 })
	      },
	      //
	    	selcted:function(n){
	    		var routeBookList=this.ccsqdInfo.routeBookList;
	    		for(var i=0;i<routeBookList.length;i++){
	    			if(routeBookList[i].routeId==n){
	      				Vue.set(routeBookList[i],'selected',true);
	      				common.sessionset('tkxclist',routeBookList[i]);
	      				
	    				this.dep=routeBookList[i].departCityName;
	    				this.arr=routeBookList[i].arriveCityName;
	    				this.depszm=routeBookList[i].departAirport;
	    				this.arrszm=routeBookList[i].arriveAirport;
	    				this.date1=routeBookList[i].departDate;
	    					var cxrIdlist=routeBookList[i].cxrId.split(',');
		    				var cxrList=this.ccsqdInfo.personList;
		    				var cxrArr=[];
		    				for(var z=0;z<cxrIdlist.length;z++){
		    					for(var r=0;r<cxrList.length;r++){
		    						if(cxrIdlist[z]==cxrList[r].empId){
		    							cxrList[r].checked=true;
		    							cxrArr.push(cxrList[r]);
		    						}
		    					}
		    				}
		    				common.sessionremove('tkcxrlist');
		    				common.sessionset('tkcxrlist',cxrArr);
		    				this.getcxrName();
	    			}else{
	      				Vue.set(routeBookList[i],'selected',false);
	    				
	    			}
	    		}
	    	},
	    	//获取差旅信息详情
	      getCcsqdInfo:function(id){
	      	if(!id){return false;}
	      	var self=this;
	      	var vipCcsqdGetListForChoose=$conn.getConn('tkQuery.vipCcsqdGetListForChoose');
	      	vipCcsqdGetListForChoose("?ccsqdId="+id,function(res){
	      		self.ccsqdInfo=res.data[0];
	      		common.sessionset('tkccsqd',self.ccsqdInfo);
	      		self.showXc=true;
	      		var routeBookList=self.ccsqdInfo.routeBookList;
	      		self.ccsqd=self.ccsqdInfo.ccsqdNo+" "+self.ccsqdInfo.mdd;
	      		var a={};
	      		for(var i=0,len=routeBookList.length;i<len;i++){
	      				if(i==0){
	      					common.sessionset('tkxclist',routeBookList[i]);
	      					routeBookList[i].selected=true;
	      					Vue.set(routeBookList[i],'selected',true);
	      					self.dep=routeBookList[i].departCityName;
		    				self.arr=routeBookList[i].arriveCityName;
		    				self.depszm=routeBookList[i].departAirport;
		    				self.arrszm=routeBookList[i].arriveAirport;
		    				self.date1=routeBookList[i].departDate;
		    				var cxrIdlist=routeBookList[i].cxrId.split(',');
		    				console.log(cxrIdlist);
		    				var cxrList=self.ccsqdInfo.personList;
		    				var cxrArr=[];
		    				for(var z=0;z<cxrIdlist.length;z++){
		    					for(var r=0;r<cxrList.length;r++){
		    						if(cxrIdlist[z]==cxrList[r].empId){
		    							cxrList[r].checked=true;
		    							cxrArr.push(cxrList[r]);
		    						}
		    					}
		    				}
		    				common.sessionremove('tkcxrlist');
		    				common.sessionset('tkcxrlist',cxrArr);
		    				self.getcxrName();
	      				}else{	      					
	      					Vue.set(self.ccsqdInfo.routeBookList[i],'selected',false);
	      				}

	      		}
	      		Vue.nextTick(function () {});
	      	},function(res){
	      		mui.alert(res.errMsg)
	      	});
	     },
	    //出行人
       	getcxrName:function(){
       		var self=this;
//	       	if(this.isYs||empInfo.bookRange>0){
	       		var cxr=common.sessionget('tkcxrlist');
	       		if(!cxr||cxr=='[]'||cxr.length<1){
	       			return false;
	       		}
				var acxr=[];
	       		for(var i=0;i<cxr.length;i++){
	       			if(cxr[i].checked){
	       				acxr.push(cxr[i]);
	       			}
	       		}
	       		cxr=acxr;
	       		var cxrname="";
	       		var empRank=[];
	       		if(cxr&&cxr.length>0&&cxr!="[]"){
	       			for (var i=0;i<cxr.length;i++) {
	       				(i==0)&&(cxrname+=cxr[i].empName);
	       				(i>0)&&(cxrname+="、"+cxr[i].empName);
	       				empRank.push(cxr[i].empRank);
	       			}
	       			self.minZj=empRank.sort(function(a,b){return a-b;})[0];
	       			self.cxr=cxrname;
	       			for (var i=0;i<cxr.length;i++) {
						(cxr[i].empRank==self.minZj)&&(self.useNameclbz=cxr[i].empName);
	       			}
	       		}
//	       	}
       	},
       	remove:function(){
       		common.sessionremove('tkSearchInfo');
			common.sessionremove('tkVoyage1');
			common.sessionremove('tkVoyage2');
			common.sessionremove('tkFlightList');
//			if(!this.isYs){	
//				common.sessionremove('tkcxrlist');
//			}
			common.sessionremove('tkxclist');
			this.ccsqdid="";
			this.dep="";
			this.arr="";
			this.date1="";
			this.date2="";
       	},
       	
       },
       //methods ----End
       watch:{
			date1:function(){this.clbz();},
			depszm:function(){this.clbz();},
			arrszm:function(){this.clbz();},
			ccsqdId:function(){
				this.getCcsqdInfo(this.ccsqdId);	
			},

       },
       activated:function(){

			mui('.mui-scroll-wrapper').scroll({
				deceleration: 0.0005 ,//flick 减速系数，系数越大，滚动速度越慢，滚动距离越小，默认值0.0006
				scrollY: false, //是否竖向滚动
 				scrollX: true, //是否横向滚动
			});
//判断预订模式
			//出差申请单模式
			if(vipCorp.bookStyle==2){
				this.showccsqd=true;
				
				//订票范围本人
//				if(empInfo.bookRange==0){
//					this.onlySelf=true;
////					this.canOther=false;
////					this.showccsqd=false;
////					this.onlyempName=empInfo.empName;
//				}
//				//订票范围大于本人
//				if(empInfo.bookRange>0){
//					this.onlySelf=false;
////					this.canOther=true;
//					//可为外来人订票
//					if(empInfo.bookOutside==1){
//						this.outerSize=true;
//					}
//				}
				//预订全免
				if(empInfo.appBook==1){
					this.showccsqd=false;
					//可为外来人订票
					if(empInfo.bookOutside==1){
						this.outerSize=true;
					}
				}
			}
			
//单订模式
			if(vipCorp.bookStyle==1){
				this.showccsqd=false;
				
				//订票范围本人
				if(empInfo.bookRange==0){
					this.onlySelf=true;
					this.onlyempName=empInfo.empName;
				}
				//订票范围大于本人
				if(empInfo.bookRange>0){
					this.onlySelf=false;
					//可为外来人订票
					if(empInfo.bookOutside==1){
						this.outerSize=true;
						this.minZj=empInfo.empRank;
					}
				}
				if(empInfo.appBook==1){
					//可为外来人订票
					if(empInfo.bookOutside==1){
						this.outerSize=true;
					}
				}
			}
       		
	       	if(this.$route.query.ccsqdid){
	       		this.ccsqdId=this.$route.query.ccsqdid;
	       	}
	       	var ct=common.sessionget('yjIndexedList');
	        // 始发地
	       	if(ct&&ct.backTab==1){
	       		this.dep=ct.cityName;
	       		this.depszm=ct.threeCode;
	       	}
	        // 目的地
	       	if(ct&&ct.backTab==2){
	       		this.arr=ct.cityName;
	       		this.arrszm=ct.threeCode;
	       	}
			this.getcxrName();


			if(this.$route.query.dateNo==1){
				var da=this.$route.query.date;
				var dat=da.split('-');
				Vue.set(this,'datex1',dat[1]+'月'+dat[2]+'日'+' (周'+this.$route.query.week+')');
				Vue.set(this,'date1',this.$route.query.date);
			}
       		if(this.$route.query.dateNo==2){
       			var da=this.$route.query.date;
				var dat=da.split('-');
				Vue.set(this,'datex2',dat[1]+'月'+dat[2]+'日'+' (周'+this.$route.query.week+')');
				Vue.set(this,'date2',this.$route.query.date);
			}
       	
       		this.tkQStatus=common.sessionget('tkQStatus');

       		if(this.tkQStatus==2){       			
       			this.showccsqd=false;
				this.isYs=true;
				this.yscor=true;
				this.ygcor=false;
				this.onlySelf=false;
				this.showXc=false;
				this.showclbz=false;
				this.showcxr=false;
				
       		}
       	
       },

    });


    module.exports = tkQuery;
});
