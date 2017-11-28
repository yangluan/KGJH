/*
 * 路由传入本页面的参数
 	type 上个页面路由名称 必传
 	beforeDay=1 可选今天之前的日期
 
 *本页面返回的参数
 	dateNo 标识 传什么返回什么
 	date  返回日期 2017-08-28 格式
 	week  返回周  格式1,2,3,4...数字
 */
define(function(require, exports, module) {
	var common = require("common");
	var $conn = require("$conn");
	var datess = require("templates/control/date.html");
	require('css/control/date.css');
	var dates = Vue.extend({
//		el: '#calendar',
        template: datess,
		data: function(){
			return {
				currentDay: 1,
				currentMonth: 1,
				currentYear: 1970,
				currentWeek: 1,
				days: [],
				alldays:[],
				userUrl:"",
				y:"",
				m:"",
				d:"",

			}
		},
		created: function() {
//			this.initData(null);
			if(this.$route.query.beforeDay&&this.$route.query.beforeDay==1){
				var datte=getLastYearYestdy(new Date());
			}else{				
				var datte=new Date();
			}
			for	(var z=0;z<12;z++){				
				var year=datte.getFullYear();	
				var mon=datte.getMonth()+z;	
				if(mon>=13){					
					mon=mon-12;year=year+1;
				}
				this.pickNext(year,mon);
			}
			this.getUrlData();
			var sD=common.sessionget('selDate');

			if(sD){
				var s=sD.split('-');
				this.y=s[0];
				this.m=s[1];
				this.d=s[2];
			}

			console.log(this.y,this.m==9,this.d);
			function getLastYearYestdy(date){  
		     var strYear = date.getFullYear() - 1;    
		     var strDay = date.getDate();    
		     var strMonth = date.getMonth()+1;  
		     if(strMonth<10)    
		     {    
		        strMonth="0"+strMonth;    
		     }  
		     if(strDay<10)    
		     {    
		        strDay="0"+strDay;    
		     }  
		     datastr = strYear+"-"+strMonth+"-"+strDay;  
		     return datastr;  
		  }
		  
		},
		methods: {
			initData: function(cur) {
				var date;
				if(cur) {
					date = new Date(cur);
				} else {
					date = new Date();
				}
				this.currentDay = date.getDate();
				this.currentYear = date.getFullYear();
				this.currentMonth = date.getMonth() + 1;
				this.currentWeek = date.getDay(); // 1...6,0
				if(this.currentWeek == 7) {
					this.currentWeek = 0;
				}
				var str = this.formatDate(this.currentYear, this.currentMonth, this.currentDay);
				console.log("today:" + str + "," + this.currentWeek);
				var days=[];
				days.length = 0;
				// 今天是周日，放在第一行第7个位置，前面6个
				for(var i = this.currentWeek; i >= 0; i--) {
					var d = new Date(str);
					d.setDate(d.getDate() - i);
					console.log("y:" + d.getDate());
					days.push(d);
				}
				var ts=0;
				(this.currentWeek<5)?(ts=35):(ts=7*6);
				for(var i = 1; i <= ts - this.currentWeek-1; i++) {
					var d = new Date(str);
					d.setDate(d.getDate() + i);
					days.push(d);
				}
		
				var d={
					dateday:days,
					mon:this.currentMonth,					
					year:this.currentYear
				}
				this.alldays.push(d);
			},
			pick: function(date) {
				var newdate=this.formatDate(date.getFullYear(), date.getMonth() + 1, date.getDate());
				this.currentWeek = date.getDay(); // 1...6,0
				var arr=['日','一','二','三','四','五','六'];
				console.log(this.currentWeek);
				if(this.userUrl!= ''){
					Vue.router.goPath('/'+this.userUrl+'?dateNo='+this.$route.query.dateNo+'&date='+newdate+'&week='+arr[this.currentWeek]);
					common.sessionset('selDate',newdate);
				}else{
					
				}
			},
			pickPre: function(year, month) {
				// setDate(0); 上月最后一天
				// setDate(-1); 上月倒数第二天
				// setDate(dx) 参数dx为 上月最后一天的前后dx天
				var d = new Date(this.formatDate(year, month, 1));
				d.setDate(0);
				this.initData(this.formatDate(d.getFullYear(), d.getMonth() + 1, 1));
			},
			pickNext: function(year, month) {
				var d = new Date(this.formatDate(year, month, 1));
				d.setDate(7*6);
				this.initData(this.formatDate(d.getFullYear(), d.getMonth() + 1, 1));
			},
			pickYear: function(year, month) {
				alert(year + "," + month);
			},

			// 返回 类似 2016-01-02 格式的字符串
			formatDate: function(year, month, day) {
				var y = year;
				var m = month;
				if(m < 10) m = "0" + m;
				var d = day;
				if(d < 10) d = "0" + d;
				return y + "-" + m + "-" + d
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
			}
		},

	});
	module.exports = dates;
});