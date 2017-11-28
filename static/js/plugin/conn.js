/**
 * */
define(function(require, exports, module) {

	var httpClient = require("httpClient");
	var global = require("js/plugin/config/{env}");

	var configs = {
		user: {
			//登陆
			vipLogin: {
				url: global.apiurl + "/1.0.0/vipLogin",
				method: "jsonp"
			},
			//修改密码
			vipEmpEditPwd :{
				url: global.apiurl + "/1.0.0/vipEmpEditPwd",
				method: "jsonp"
			},
			//获取员工信息
			getLoginUserInfo: {
				url: global.apiurl + "/1.0.0/getLoginUserInfo",
				method: "get"
			},
			//获取短信验证码
			smsCodeGet: {
				url: global.apiurl + "/1.0.0/smsCodeGet",
				method: "get"
			},
            //获取短信验证码校验
			smsCodeCheck: {
				url: global.apiurl + "/1.0.0/smsCodeCheck",
				method: "get"
			},
			//重置密码
            vipEmpResetPwd: {
				url: global.apiurl + "/1.0.0/vipEmpResetPwd",
				method: "jsonp"
			},
			//出差申请单列表
			vipCcsqdGetList: {
				url: global.apiurl + "/1.0.0/vipCcsqdGetList",
				method: "get"
			},
			//解绑手机
			phoneUnbind :{
				url: global.apiurl + "/1.0.0/phoneUnbind",
				method: "jsonp"
			},
			//绑定手机
			phoneBinding :{
				url: global.apiurl + "/1.0.0/phoneBinding",
				method: "jsonp"
			},
			//删除草稿
			vipCcsqdDel:{
				url: global.apiurl + "/1.0.0/vipCcsqdDel",
				method: "get"
			},
			//查询企业常用地址
			vipEmpAddrGetList:{
				url: global.apiurl + "/1.0.0/vipEmpAddrGetList",
				method: "get"
			},
			//查询企业员工常用联系人
			vipEmpContactsGetList: {
				url: global.apiurl + "/1.0.0/vipEmpContactsGetList",
				method: "get"
			},
			//出差申请单列表
			vipCcsqdGetList:{
				url: global.apiurl + "/1.0.0/vipCcsqdGetList",
				method: "get"
			},
			//新增常用地址
		    vipEmpAddrEdit:{
				url: global.apiurl + "/1.0.0/vipEmpAddrEdit",
				method: "jsonp"
		    },
	
		    //删除常用地址
		    vipEmpAddrDel:{
				url:global.apiurl + "/1.0.0/vipEmpAddrDel",
				method: "get"
		    },
		    //新增常用联系人/编辑护照信息
		    vipEmpContactsEdit:{
				url:global.apiurl + "/1.0.0/vipEmpContactsEdit",
				method: "jsonp"
		    },
		    //删除常用联系人
		    vipEmpContactsDel:{
				url:global.apiurl + "/1.0.0/vipEmpContactsDel",
				method: "get"
		    },
		    //修改企业个人信息
		    vipEmpEditInfo :{
		    	url:global.apiurl + "/1.0.0/vipEmpEditInfo",
				method: "jsonp"
		    }
		},
		
	
		// 订单模块
		order:{
			// 计数
			totalCount:{
				url: global.apiurl + "/1.0.0/totalCount",
				method: "jsonp"
			},
			// 订单列表
			totalOrderList:{
				url: global.apiurl + "/1.0.0/totalOrderList",
				method: "jsonp"
			},
			
			orderDetail:{
				url: global.apiurl + "/1.0.0/orderDetail",
				method: "get"
			},
			cancelTkOrder:{
				url: global.apiurl + "/1.0.0/cancelTkOrder",
				method: "jsonp"
			},
			
		},
		pay:{
			getPaySubject:{
				url: global.apiurl + "/1.0.0/getPaySubject",
				method: "jsonp"
			},
			onlinePay:{
				url: global.apiurl + "/1.0.0/onlinePay",
				method: "jsonp"
			}
		},
		//退票 模块
		refundTicket: {
			//获取航段和乘机人
			applyRefund: {
				url: global.apiurl + "/1.0.0/applyRefund",
				method: "get"
			},
			// 提交申请退票   refundAdd
			refundAdd: {
				url: global.apiurl + "/1.0.0/refundAdd",
				method: "jsonp"
			},
			// 获取退票原因   getBClass
			getBClass: {
				url: global.apiurl + "/1.0.0/getBClass",
				method: "get"
			},
			//  获取退票详情  refundOrderDetail
			refundOrderDetail: {
				url: global.apiurl + "/1.0.0/refundOrderDetail",
				method: "get"
			},
			// 取消退票   refundCancel
			refundCancel: {
				url: global.apiurl + "/1.0.0/refundCancel",
				method: "get"
			},
		},
		//改签模块
		alterTicket:{
			//获取改签数据、 航段 和 乘机人
            applyTkChange:{
	            url: global.apiurl + "/1.0.0/applyTkChange",
				method: "get"
            },
            //改签查询机票
            tkChangeQueryFlight:{
            	 url: global.apiurl + "/1.0.0/tkChangeQueryFlight",
				method: "jsonp"
            },
            //改签提交   tkChangeOrderAdd
            tkChangeOrderAdd:{
            	url: global.apiurl + "/1.0.0/tkChangeOrderAdd",
				method: "jsonp"
            },
            // 获取改签详情   tkChangeOrderDetail
            tkChangeOrderDetail:{
            	url: global.apiurl + "/1.0.0/tkChangeOrderDetail",
				method: "get"
            },
  			// 获取改签后 航程
  			findChangeOrderByChangeId:{
  				url: global.apiurl + "/1.0.0/findChangeOrderByChangeId",
				method: "get"
  			},
  			//取消改签 
  			cancelChangeOrder:{
  				url: global.apiurl + "/1.0.0/cancelChangeOrder",
				method: "get"
  			}
            
		},
		//审批模块           进度 、 送审、 规则  
		approval:{
			//审批进度
			vipOrderAppProgress:{
				url: global.apiurl + "/1.0.0/vipOrderAppProgress",
				method: "jsonp"
			},
			//送审
			vipBpmSendApp:{
				url: global.apiurl + "/1.0.0/vipBpmSendApp",
				method: "get"
			},
			// 审批规则
			vipSpgzGetInfo:{
				url: global.apiurl + "/1.0.0/vipSpgzGetInfo",
				method: "get"
			},
			//vipSpkzNeedApproval  获取审批规则id  用于送审
			vipSpkzNeedApproval:{
				url: global.apiurl + "/1.0.0/vipSpkzNeedApproval",
				method: "jsonp"
			},
			// 获取待我审批列表
			vipBpmForMyApp:{
				url: global.apiurl + "/1.0.0/vipBpmForMyApp",
				method: "get"
			},		
			// 获取我已审批列表
			vipBpmForMyApped:{
				url: global.apiurl + "/1.0.0/vipBpmForMyApped",
				method: "get"
			},
			// 保存审批结果
			vipBpmReceiveAppResult:{
				url: global.apiurl + "/1.0.0/vipBpmReceiveAppResult",
				method: "jsonp"
			},
		},
		//城市数据
		city: {
			aircityurl: {
				url: global.apiurl + '/static/js/cityAirport.js',
				method: "get"
			},
			//A-Z城市,HOT是热门城市
			cityurl: {
				url: global.apiurl + '/static/js/city.js',
				method: "get"
			},
			//A-Z机场js
			cityAirportForPx : {
				url: global.apiurl +  '/static/js/cityAirportForPx.js',
				method: "get"
				//async : true
			},
			//A-Z国家数据
			azCountryForPx : {
				url: global.apiurl +  '/static/js/azCountryForPx.js',
				method: "get"
			},
			//国家、省、城市js数据
			proCity : {
				url: global.apiurl +  '/static/js/proCity.js',
				method: "get"
			},
		},
		//机票查询预订
		tkQuery: {
			//POST /1.0.0/GetClzbByMinZj
			// 根据员工职级获取差旅标准
			GetClzbByMinZj: {
				url: global.apiurl + "/1.0.0/GetClzbByMinZj",
				method: "jsonp"
			},

			//GET /1.0.0/GET /1.0.0/empFindList
			// 根据预订人范围获取员工列表
			empFindList: {
				url: global.apiurl + "/1.0.0/empFindList",
				method: "get"
			},

			//GET /1.0.0/violateReasonList
			// 违背原因控件
			violateReasonList: {
				url: global.apiurl + "/1.0.0/violateReasonList",
				method: "get"
			},

			//POST /1.0.0/bookOrder
			//机票下单
			bookOrder: {
				url: global.apiurl + "/1.0.0/bookOrder",
				method: "jsonp"
			},

			//POST /1.0.0/cancelTkOrder
			//订单取消
			cancelTkOrder: {
				url: global.apiurl + "/1.0.0/cancelTkOrder",
				method: "jsonp"
			},

			//POST /1.0.0/matchClbz
			//机票匹配差旅标准
			matchClbz: {
				url: global.apiurl + "/1.0.0/matchClbz",
				method: "jsonp"
			},

			//POST /1.0.0/queryFlight
			//机票查询
			queryFlight: {
				url: global.apiurl + "/1.0.0/queryFlight",
				method: "jsonp"
			},

			//POST /1.0.0/queryFlightStop
			//查询航班经停信息
			queryFlightStop: {
				url: global.apiurl + "/1.0.0/queryFlightStop",
				method: "jsonp"
			},

			//GET /1.0.0/querySameOrder
			//查询重复订单
			querySameOrder: {
				url: global.apiurl + "/1.0.0/querySameOrder",
				method: "get"
			},

			//GET /1.0.0/queryTxOrder
			//查询同行订单
			queryTxOrder: {
				url: global.apiurl + "/1.0.0/queryTxOrder",
				method: "get"
			},

			//GET /1.0.0/recommendFlight
			//前后两小时推荐航班
			recommendFlight: {
				url: global.apiurl + "/1.0.0/recommendFlight",
				method: "get"
			},

			//POST /1.0.0/validateTimeOut
			//预订时验证是否超时
			validateTimeOut: {
				url: global.apiurl + "/1.0.0/validateTimeOut",
				method: "jsonp"
			},
			
			//POST /1.0.0/orderDetail
			//订单详情
			orderDetail: {
				url: global.apiurl + "/1.0.0/orderDetail",
				method: "get"
			},
			//选择出差申请单--控件
			//GET /1.0.0/vipCcsqdGetListForChoose
			vipCcsqdGetListForChoose: {
				url: global.apiurl + "/1.0.0/vipCcsqdGetListForChoose",
				method: "get"
			},
		},
		//是否审批(
		Approval: {
			//获取审批规则id
			needApproval: {
				url: global.apiurl + "/1.0.0/vipSpkzNeedApproval",
				method: "jsonp"
			},
			//项目列表
			projectSelection: {
				url: global.apiurl + "/1.0.0/projectList",
				method: "jsonp"
			},

			//获取到审批规则名称
			needApprovalName: {
				url: global.apiurl + "/1.0.0/vipSpgzFindDetail",
				method: "get"
			},
			//成本中心 获取成本中心列表
			costCenterFindList: {
				url: global.apiurl + "/1.0.0/costCenterFindList",
				method: "jsonp"
			},
            //保存草稿/提交送审
            subDraftSs: {
                url: global.apiurl + "/1.0.0/vipCcsqdAdd",
                method: "jsonp"
            },
            //审批规则列表    /1.0.0/vipCcsqdGetInfo
            spgzList: {
                url: global.apiurl + "/1.0.0/spgzFindList",
                method: "get"
            },
            //出差申请单提交成功
            ccsqdSubSuccess: {
                url: global.apiurl + "/1.0.0/vipCcsqdGetInfo",
                method: "get"
            },
		}
	};

	var conn = {},
		unkn;

	conn.getConn = function(operId, funs) {
		var operIds = operId.split(".");
		funs = extend(defaults.deffuns, funs);
		return creart(getValues(operIds, configs), funs);
	}

	conn.getPath = function(operId) {
		var operIds = operId.split(".");
		return getValues(operIds, configs);
	}

	var getValues = function(operIds, configs) {
		var obj = configs;
		for(var i = 0, l = operIds.length; i < l; i++) {
			var key = operIds[i];
			obj = obj[key];
		}
		return obj;
	}

	var creart = function(option, funs) {
		var method = option.method.toUpperCase();
		var fun = null;
		funs = funs || {};
		if(method == "GET") { //get请求
			fun = (function(o) {
				return function(param, success, error, beforeFun, thenBefore, thenAfter) {
					funs = extend(funs, {
						"beforeFun": beforeFun,
						"thenBefore": thenBefore,
						"thenAfter": thenAfter,
						"async" : o.async
					});
					httpClient.get(o.url, param, success, error, funs);
				};
			})(option);
		} else if(method == "JSONP") { //post方式，发送json对象/json字符串。在Controller中，使用@RequestBody封装成对象
			fun = (function(o) {
				return function(json, success, error, beforeFun, thenBefore, thenAfter) {
					funs = extend(funs, {
						"beforeFun": beforeFun,
						"thenBefore": thenBefore,
						"thenAfter": thenAfter,
						"async" : o.async
					});
					httpClient.jsonp(o.url, json, success, error, funs);
				};
			})(option);
		} else if(method == "POST") { //post方式，发送json对象，在Controller中，直接使用对象/键 接收
			fun = (function(o) {
				return function(param, success, error, beforeFun, thenBefore, thenAfter) {
					funs = extend(funs, {
						"beforeFun": beforeFun,
						"thenBefore": thenBefore,
						"thenAfter": thenAfter,
						"async" : o.async
					});
					httpClient.post(o.url, param, success, error, funs);
				};
			})(option);
		}
		return fun;
	};

	function noop() {};

	//实现简单继承
	function extend(source, target) {
		var o = {};
		for(var i in source) {
			o[i] = source[i];
		}
		for(var i in target) {
			if(target[i] !== unkn) o[i] = target[i];
		}
		return o;
	}

	//公共的方法
	var defaults = {
		httpError: function(msg) {
			msg = msg || "您当前网络不畅，请刷新后重新尝试！";
			mui.alert(msg);
		},
		businessError: function(tips) {
			tips || "系统异常";
			mui.alert(tips);
		},
		deffuns: {
			"beforeFun": unkn,
			"thenBefore": unkn,
			"thenAfter": unkn
		}
	};

	module.exports = conn;
})
