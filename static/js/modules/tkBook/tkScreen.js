define(function (require,exports,module) {
    var common = require("common");
    var $conn  = require("$conn");
    var tkScreens = require("templates/tkBook/tkScreen.html");
	require('css/tkBook/tkScreen.css');
	require('css/control/cxr.css');

    var tkScreen = Vue.extend({
        template: tkScreens,
        data:function(){
        	return {
				"tkSearchInfo":"",
				"tkFlight":"",
				"depPlane":"",
				"arrPlane":"",
				"hkgs":"",
				"selected1":"",
				"selected2":"",
				"selected3":"",
				"selected4":"",
				"selected5":"",
				"selected6":"",
				"timearr":[],
				"deparr":[],
				"arrarr":[],
				"cabinarr":[],
				"hkgsarr":[]
        	}
        },
        created:function(){
			this.tkSearchInfo=common.sessionget('tkSearchInfo');
			this.tkFlight=common.sessionget('tkFlightList');
			this.depPlane=this.getplane(0);
			this.arrPlane=this.getplane(1);
			this.hkgs=this.getplane(2);
		},//created --END--
        methods:{
			getplane:function(m){
				var obj=[];
				var obj2=[];
				switch(m){

					case 0:
						for(var ke in this.tkFlight.flightMap){
							var value = this.tkFlight.flightMap[ke].departAirportName || "";
							if( value !== "" && obj.indexOf(value)<0){							
								obj.push(value)
							}
						}
						for(var i=0;i<obj.length;i++){
							obj2.push({'name':obj[i],'checked':false});
						}
					break;

					case 1:
						for(var ke in this.tkFlight.flightMap){
							var value = this.tkFlight.flightMap[ke].arriveAirportName || "";
							if( value !== "" && obj.indexOf(value)<0){							
								obj.push(value)
							}
						}	
						for(var i=0;i<obj.length;i++){
							obj2.push({'name':obj[i],'checked':false});
						}
					break;

					case 2:
						for(var ke in this.tkFlight.flightMap){
							var value = this.tkFlight.flightMap[ke].airlineName || "";
							if( value !== "" && obj.indexOf(value)<0){							
								obj.push(value)
							}
						}	
						for(var i=0;i<obj.length;i++){
							obj2.push({'name':obj[i],'checked':false});
						}
					break;
				}
				return obj2;
			},
			getTerm:function(m,n,k,j){
				
				switch(m){
					//起飞时间
					case 0:
						switch(j){
							case 1:
								Vue.set(this,"selected1",!this.selected1);
								this.selected1&&this.timearr.push(n+'-'+k);
							break;
							case 2:
								Vue.set(this,"selected2",!this.selected2);
								this.selected2&&this.timearr.push(n+'-'+k);
							break;
							case 3:
								Vue.set(this,"selected3",!this.selected3);
								this.selected3&&this.timearr.push(n+'-'+k);
							break;
							case 4:
								Vue.set(this,"selected4",!this.selected4);
								this.selected4&&this.timearr.push(n+'-'+k);
							break;
						}
					break;
					//机场
					
					case 1:
						for(var i=0;i<this.depPlane.length;i++){
							if(n==this.depPlane[i].name){
								this.depPlane[i].checked=!k;
								!k&&this.deparr.push(n);
							}
						}
					break;
					case 2:
						for(var i=0;i<this.arrPlane.length;i++){
							if(n==this.arrPlane[i].name){
								this.arrPlane[i].checked=!k;
								!k&&this.arrarr.push(n);
							}
						}
					break;
					//舱位类型
					
					case 3:
						if(k==5){
							Vue.set(this,"selected5",!this.selected5);
							this.selected5&&this.cabinarr.push(n);
							
						}else if(k==6){
							Vue.set(this,"selected6",!this.selected6);
							this.selected6&&this.cabinarr.push(n);
						}else{
							for(var i=0;i<this.hkgs.length;i++){
								(this.hkgs[i].name==n)&&(this.hkgs[i].checked=!k);
								if(!k){
									if(this.hkgsarr.indexOf(n)<0){										
										this.hkgsarr.push(n);
									}
								}
							}
						}
					break;
				}
			},
			nolimit:function(n){
				switch(n){
					case 0:
						Vue.set(this,"selected1",false);
						Vue.set(this,"selected2",false);
						Vue.set(this,"selected3",false);
						Vue.set(this,"selected4",false);
					break;
					case 1:
						for(var i=0;i<this.depPlane.length;i++){
							this.depPlane[i].checked=false;
						}
					break;
					case 2:
						for(var i=0;i<this.arrPlane.length;i++){
							this.arrPlane[i].checked=false;
						}
					break;
					case 3:
						Vue.set(this,"selected5",false);
						Vue.set(this,"selected6",false);
					break;
					case 4:
						for(var i=0;i<this.hkgs.length;i++){
							this.hkgs[i].checked=false;
						}
					break;
				}
				
			},
			//确定
			ensure:function(){
				
				var arr=this.timearr+'|'+this.deparr+'|'+this.arrarr+'|'+this.cabinarr+'|'+this.hkgsarr;
				common.sessionset('tkScreenlist',arr);
				Vue.router.goPath('/flightlist?type=tkScreen');
			},
			//恢复默认
			rest:function(){
				for(var i=0;i<5;i++){					
					this.nolimit(i);
				}
			},
			qc:function(){
				var n={},r=[];
				for(var i=0;i<this.length;i++){
					if(!n[this[i]]){
						n[this[i]]=true;
					}else{
						r.push(this[i]);
					}
				}
				return r;
			},
			back:function(){
				mui.back();
			}
      	},
      	watch:{

       	},
       	activated:function(){
		
       	}

    });
    
    module.exports = tkScreen;
});