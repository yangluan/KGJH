define(function (require,exports,module) {
	

	var defaults = {
		httpError:function(msg){msg=msg||"您当前网络不畅，请刷新后重新尝试！";mui.alert(msg);},
		businessError:function(tips){tips||"系统异常";mui.alert(tips);},
	};
	

	function noop(){};
	
	var httpClient = {};

	httpClient.get = function(url, param, success, error, funs){
		var headers = {};headers["Content-Type"] = "application/x-www-form-urlencoded;charset=utf-8";
		var _ajax = {
			type: "get",
			headers: headers,
			async : funs.async === true ? true : false
		};
		var param = param || "";
		if(typeof(param) == "string"){
			url = url + param;
		}else{
			_ajax.data = param;
		}
		var url = url;
		$ajax(url,_ajax, success, error, funs);
	};
	
	httpClient.post = function(url, param, success, error, funs){
		var headers = {};headers["Content-Type"] = "application/x-www-form-urlencoded;charset=utf-8";
		param = param || {};
		var url = url;
		var _ajax = {
			type: "post",
			headers: headers,
			data : param,
			async : funs.async === true ? true : false
		};
		
		$ajax(url,_ajax, success, error, funs);
	};
	
	httpClient.jsonp = function(url, json, success, error, funs){
		var headers = {};headers["Content-Type"] = "application/json;charset=utf-8";
		json = json || "";
		if( !!json && typeof(json) !== "string" ){
			json = JSON.stringify(json);
		};
		var url = url;
		var _ajax = {
				type: "post",				// "get|post|jsonp"
				headers: headers,
				data :  json,
				async : funs.async === true ? true : false
		};
		$ajax(url,_ajax, success, error, funs);		
	}

	
	var $ajax = function(url,_ajax, success, error, funs){
		if(typeof(funs.beforeFun) == "function" && funs.beforeFun.call(this) === false){return false;}
		_ajax.headers.token = window.sessionStorage.getItem("access_token");
		_ajax.crossDomain = true;
		_ajax.dataType = 'json'; //返回类型	
		_ajax.success = function (data,textStatus,xhr) {//textStatus：状态描述，默认值为'success' ,xhr：xhr实例对象
			if(typeof(funs.thenBefore) === "function" && funs.thenBefore.call(this,respResult) === false){return false;}
			if( textStatus == 200 || textStatus == 'success'){ //mui 默认返回success
				var resp = data || {};
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
		mui.ajax(url,_ajax);
	}
	
	// ui配置
	httpClient.config = function(options){
		options = options || {};
		defaults.httpError = options.httpError || defaults.httpError;
		defaults.businessError = options.businessError || defaults.businessError;
	}
	
	module.exports = httpClient;

});