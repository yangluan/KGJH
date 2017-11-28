define(function (require,exports,module) {
	
	var plugin = require("./vue-resource");
	var $client = {config:{debug:true}, util:{}, prototype:{}};
	
	plugin($client);

	var defaults = {
		httpError:function(msg){msg=msg||"您当前网络不畅，请刷新后重新尝试！";mui.alert(msg);},
		businessError:function(tips){tips||"系统异常";mui.alert(tips);},
	};
	

	function noop(){};
	
	var httpClient = {};

	httpClient.get = function(url, param, success, error, funs){
		var headers = {};headers["Content-Type"] = "application/x-www-form-urlencoded;charset=utf-8";
		var _ajax = {
			url: url, 
			method: "GET",
			headers: headers
		};
		var param = param || "";
		if(typeof(param) == "string"){
			url = url + param;
		}else{
			_ajax.params = param;
		}
		_ajax.url = url;
		$ajax(_ajax, success, error, funs);
	};
	
	httpClient.post = function(url, param, success, error, funs){
		var headers = {};headers["Content-Type"] = "application/x-www-form-urlencoded;charset=utf-8";
		param = param || {};
		var _ajax = {
			url: url,
			method: "post",
			headers: headers,
			params : param
		};
		
		$ajax(_ajax, success, error, funs);
	};
	
	httpClient.jsonp = function(url, json, success, error, funs){
		var headers = {};headers["Content-Type"] = "application/json;charset=utf-8";
		json = json || "";
		if( !!json && typeof(json) !== "string" ){
			json = JSON.stringify(json);
		};
		var _ajax = {
				url: url, 
				method: "post",				// "get|post|jsonp"
				headers: headers,
				body :  json
		};
		$ajax(_ajax, success, error, funs);		
	}

	
	var $ajax = function(_ajax, success, error, funs){
		if(typeof(funs.beforeFun) == "function" && funs.beforeFun.call(this) === false){return false;}
		_ajax.headers.token = window.sessionStorage.getItem("access_token");
		var _then = function (respResult) {
			if(typeof(funs.thenBefore) === "function" && funs.thenBefore.call(this,respResult) === false){return false;}
			if( respResult.status == 200){
				var resp = respResult.data || {};
				//如果返回值不是对象 转换为对象
				if(typeof(resp) !="object"){
					resp=JSON.parse(resp);
				}
				if(resp.errCode == 1){
					success = success || noop;
					success(resp);
				}else if(resp.errCode == 3901){
					mui.alert("用户登录会话失效，请重新登录！","error",function(){
						Vue.router.goPath("/");
//						top = top || window;
//						top.location.hash = "#/";
					});
				}else{//业务处理异常
					if(!!error && typeof(error) == "function"){
						error(resp);
					}else{
						defaults.businessError(resp.tips);
					}
				}
			}else{//http 异常
				defaults.httpError();
			};
			if(typeof(funs.thenAfter) === "function" && funs.thenAfter.call(this,respResult) === false){return false;}
    	};
		$client.http( _ajax ).then( _then );
		console.log(_ajax.body);
//		mui.ajax(_ajax.url,{
//			data:_ajax.body,
//			crossDomain:true,
//			dataType:'json',//服务器返回json格式数据
//			type:'post',//HTTP请求类型
//			timeout:10000,//超时时间设置为10秒；
//			headers:_ajax.headers,	              
//			success:function(data){
//				console.log(JSON.stringify(data));
//			},
//			error:function(xhr,type,errorThrown){
//				console.log(JSON.stringify(xhr));
//				console.log(JSON.stringify(type));
//				console.log(JSON.stringify(errorThrown));
//			}
//		});
	}
	
	// ui配置
	httpClient.config = function(options){
		options = options || {};
		defaults.httpError = options.httpError || defaults.httpError;
		defaults.businessError = options.businessError || defaults.businessError;
	}
	
	module.exports = httpClient;

});