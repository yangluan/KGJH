seajs.version = "20170622";

seajs.defualt={
	// 变量配置
	vars : {
		"locale" : "zh-cn",
		"env" : "dev"
	},
	charset: "utf-8",
	debug : true,
	base : "/obt-app/static",//request的路径起点
//	base : "../www/static/",//request的路径起点  app 用
	alias : {
		"httpClient" : "js/plugin/httpClient",
		"$conn" : "js/plugin//conn",
		
		"common" : "js/plugin//common",
	},

	map : [ [ /^(.*\.(?:css|js))\\?(.*)$/i, '$1?_v=' + seajs.version + '&$2' ] ],			
};
seajs.config(seajs.defualt);


function say(o) {
	console && console.log(o);
};

