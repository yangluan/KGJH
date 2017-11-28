;define(function (require,exports,module) {
    var applyRefundTicket = require("templates/refundTicket/applyRefundTicket.html");
	require('css/refundTicket/applyRefundTicket.css');
	var $conn  = require("$conn");
	var common = require("common");
	
    var VueComponent = Vue.extend({
        template: applyRefundTicket,
        data:function(){
        	return {
        		tkOrderPsgBeanList:[],
        		tkOrderRangeBeanList:[],
        		// 申请 退票入参
        		refundType:1,
        		psgIdList:[],
        		rangeIdList:[],
        		// 企业退票原因
        		refundReasonVip:'',
        		//  非自愿退票原因
        		refundResaon:'',
        		orderId:'',
//      		rangeIdListString: '',
//              psgIdListString: '',
        		//---------
        		isShowReason:false,
        		refundResaonNo:'',
        		//  订单类型  返回列表的参数
        		findType:1,
        		// 是否显示非自愿退票原因
        		isShowNoRefundReason:false,
        		
        		
        	}
        },
        // 计算属性   处理数据时，使用
        computed:{
        	
        },
        //页面创建时，去调用方法
        created:function(){
              
        },
        //数据渲染时
        mounted:function(){
        
          
        },
        // 正常 数据更新时使用
        updated:function(){
        		
        },
        //watch   监听路由变化 ，数据变化 可用
        watch:{
        	
        },
        // keep-alive 新增的两个生命周期   
        // 使用 keep时，  页面更新时，调用
        activated:function(){
//      	this.getRouteData();
//      	this.getRefundOrder();
        	this.getRouteData();
        	
        },
        // 页面退出时，调用
        deactivated:function(){
        	
        },
        methods:{
        	goback:function(){
//      		window.history.go(-1);
        		
        		Vue.router.goPath('/allorder?findType=' + this.findType );
        	},
        	//初始状态判断路由
        	getRouteData:function(){
        			if(this.$route.query.orderId!=undefined){
        				this.getRefundOrder();
        			};
        			if(this.$route.query.findType != undefined){
        				this.findType =  this.$route.query.findType;
        			};
        			if(this.$route.query.chooseReason != undefined && this.$route.query.chooseReason !=null){
        				say(this.$route.query.chooseReason)
        				var companyReason = JSON.parse(this.$route.query.chooseReason);
        				if(this.$route.query.refundType=='1'){
        					this.refundReasonVip = companyReason.cName;
        				};
        				if(this.$route.query.refundType=='2'){
        					this.refundResaon = companyReason.cName;
        					if(companyReason.id ==13001){
        						this.isShowNoRefundReason=false;
        						this.refundResaon='';
        					}
        				};
        				
        			}
        	},		
        	
        	//获取 可改签的航段 和 乘机人
        	getRefundOrder:function(){
        		var queryString = {orderId:this.$route.query.orderId};
        		$conn.getConn("refundTicket.applyRefund")(queryString,function(resp){	
        			say(resp.data);
        		console.log(this)
        		this.orderId = resp.data.orderId;
        		this.tkOrderPsgBeanList = resp.data.tkOrderPsgBeanList;
        	    this.tkOrderRangeBeanList = resp.data.tkOrderRangeBeanList;
    	        console.log( this.tkOrderRangeBeanList)
        		}.bind(this));
        	},
        	// 选择可退票航段    复选模式
        	chooseFLightItem:function(val, index){
        		if(typeof val.isChoosed == undefined){
        			Vue.set(val,'isChoosed',true);
        		}else{
        			 if(val.isChoosed){
        			 	Vue.set(val,'isChoosed',false);
        			 }else{
        			 	Vue.set(val,'isChoosed',true);
        			 }
        		};
        		if(val.isChoosed){
        			this.rangeIdList.push(val.rangeId);
        		}else{
        			for(var i =0;i<this.rangeIdList.length;i++){
        				if(this.rangeIdList[i]==val['rangeId']){
        					this.rangeIdList.splice(i,1);
        				}
        			}
        		}	
        	},
        	// 选择可退票乘机人
        	choosePassItem:function(val,index){
        		if(typeof val.isChoosed == undefined){
        			Vue.set(val,'isChoosed',true);
        		}else{
        			 if(val.isChoosed){
        			 	Vue.set(val,'isChoosed',false);
        			 }else{
        			 	Vue.set(val,'isChoosed',true);
        			 }
        		};
        		if(val.isChoosed){
        			this.psgIdList.push(val.psgId);
        		}else{
        			for(var i = 0;i<this.psgIdList.length;i++){
        				if(this.psgIdList[i] == val['psgId']){
        					this.psgIdList.splice(i,1);
        				}
        			}
        		}
        	},
        	//---------选择非自愿退票原因
        	toChooseNoReason:function(){
        		Vue.router.goPath('/chooseCompanyReason?type=applyRefundTicket&refundType=2')
				this.isShowNoRefundReason=true;
				
			},

        	
        	// 提交申请
        	toSubmitApply:function(){
        		var rangeIdListString = this.rangeIdList.join(',');
        		var psgIdListString = this.psgIdList.join(',');
        		if(rangeIdListString==''){
        			mui.alert('请选择退票航段！');
        			return false;
        		};
        		if(psgIdListString==''){
        			mui.alert('请选择乘机人！')
        			return false;
        		};
        		if(this.refundReasonVip==''){
        			mui.alert('请选择企业退票原因！')
        			return false;
        		};
        		if(this.refundResaon != ''){
        			this.refundType = 2;
        		}else{
        			this.refundType = 1;
        		};
        		//			    this.orderId = 'd4062f187b2c41348099ba15652220a2';
//      		this.orderId = this.$route.query.orderId;
        		console.log(this.orderId );
        		var queryString = {
        		"orderId": this.orderId,
                "psgIdList": psgIdListString,
                "rangeIdList": rangeIdListString,
                // "refundProveUrl": this.refundProveUrl,
                "refundReasonVip": this.refundReasonVip,
//              "refundResaon": this.refundResaon,
                "refundType": this.refundType
        		} ;
        		console.log(queryString);
        		$conn.getConn("refundTicket.refundAdd")(queryString,function(resp){
        			say(resp.data);
                  var refundIdList = resp.data['refundIdList'];
                  var refundIdListString = refundIdList.join(',');
                  console.log(refundIdListString);
        		   Vue.router.goPath('/refundTicketCompelete?refundIdList=' + refundIdListString);		
        		}.bind(this));
        	}
        	
        },
    });

    module.exports = VueComponent;
});
