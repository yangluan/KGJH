;define(function(require, exports, module) {
	
	var common = {};
	
	common.localset = function(key, value){//保存到localStorage，value可以为复杂对象
		var storage = window.localStorage;
		storageSet(storage, key, value );
	}
	common.localget = function(key){//从localStorage获取值，返回值为String、或者为复杂对象
		var storage = window.localStorage;
		return storageGet(storage, key );
	}
	common.localremove = function(key){//从localStorage从删除指定数据
		var storage = window.localStorage;
		storageRemove(storage, key );	
	}
	common.localclear = function(){
		var storage = window.localStorage;
		storageclear(storage);		
	}
	
	common.sessionset = function(key, value){//保存到sessionStorage，value可以为复杂对象
		var storage = window.sessionStorage;
		return storageSet(storage, key, value);
	}
	common.sessionget = function(key){//从sessionStorage获取值，返回值为String、或者为复杂对象
		var storage = window.sessionStorage;
		return storageGet(storage, key);
	}
	common.sessionremove = function(key){//从sessionStorage从删除指定数据
		var storage = window.sessionStorage;
		storageRemove(storage, key);		
	}
	common.sessionclear = function(){//清楚所有保存数据
		var storage = window.sessionStorage;
		storageclear(storage);		
		
	};
	//获取用户信息
	common.getUserInfo=function(){
		var userInfo=common.sessionget("userInfo");    
		var vipCorp=userInfo.vipCorp;
		var empInfo=userInfo.empInfo;
		return {'vipCorp':vipCorp,'empInfo':empInfo}
	}
	//底部显示信息2秒自动消失
	common.tips=function(str){
		mui.toast(str,{ duration:'long', type:'div' }); 
	}
	//获取当前时间
	//返回obj对象
	//传入时间   strTime时间（new Date()|newDate(2017-08-30)|new Date(2017,08,30)）
	//传入天数  num 当前时间+num天
	//week 返回 当前传入时间的星期 例‘周三’
	//monDay 返回 例 08月30日 格式日期
	common.FormatDate=function (strTime,num) {
	  	var obj={};
	    var date = new Date(strTime);
	    (!num)&&(num=0);
	    date=date.getTime()+24*60*60*1000*num;
	    date=new Date(date);
	    var m=date.getMonth()+1;
	    var d=date.getDate();
	    var w = date.getDay();
		var arr=['日','一','二','三','四','五','六'];
	    if(d<10){d="0"+d}
	    if(m<10){m="0"+m}
	    obj.date=date.getFullYear()+"-"+m+"-"+d;
	    obj.week='周'+arr[w];
		obj.monDay=m+'月'+d+'日';
	    return obj;
	  }
	  
	
		//选择器
	common.query = function query (el) {
	  	if (typeof el === 'string') {
	    	var selector = el;
	    	el = document.querySelector(el);
	    if (!el) {
	      "development" !== 'production' && warn(
	        'Cannot find element: ' + selector
	      );
	      return document.createElement('div')
	    }
	  }
	  return el
	};
	
	function storageSet(storage, key, value){
		if( typeof(value) != "string" ){
			value = JSON.stringify(value);
		}
		storage.setItem(key, value);
	}
		function storageGet(storage, key){
		var value = storage.getItem(key);
		if( !!value && value.indexOf("{") > -1 ){
			value = JSON.parse(value);
		}
		return value;
	}
	function storageRemove(storage, key){
		storage.removeItem(key);
	};
	function storageclear(storage){
		storage.clear();
	};
	

	module.exports = common;
});
