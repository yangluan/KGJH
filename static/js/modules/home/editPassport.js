define(function(require, exports, module) {
	//大小写一致
	var editPassport = require("templates/home/editPassport.html");
	var common = require("common");
	var $conn = require("$conn");
	require("css/home/editPassport.css");
	var VueComponent = Vue.extend({
		template: editPassport,
		data: function() {
			return {
				birthPlace : '', //出生地
				birthPlaceName : '', //出生地姓名
				passport : '', //护照号码
				passportPeriod : '', //护照有效期
				placeOfIssue : '', //护照签发地
				placeOfIssueName : ''  //护照签发地姓名
			
			};
		},
		watch :{
			//监听出生地变化
			passport : function() {
				var commCont = common.sessionget("commCont");
				if(!commCont){
					commCont = {};
				}
				commCont.passport = this.passport;
				common.sessionset("commCont",commCont);
			},
			//监听护照有效期
			passportPeriod : function(){
				var commCont = common.sessionget("commCont");
				if(!commCont){
					commCont = {};
				}
				commCont.passportPeriod = this.passportPeriod;
				common.sessionset("commCont",commCont);
			}
		},
		created: function() {
			//从缓存中获取数据
			var commCont = common.sessionget("commCont");
			if(!commCont){
				commCont = {};
			}
			//从控件获取值
			var gj = common.sessionget("yjIndexedList");
			common.sessionremove("yjIndexedList");
			if(gj){
				//获取标记
			 	var backTab = gj.backTab;
			 	if(backTab == 'qfd'){
			 		commCont.placeOfIssue = gj.id;
			 		commCont.placeOfIssueName = gj.cName;
			 	}else{
			 		commCont.birthPlace = gj.id;
			 		commCont.birthPlaceName = gj.cName;
			 	}
			}
			//重缓存对象中重新获取值
			this.birthPlace = commCont.placeOfIssue || '';
			this.placeOfIssueName = commCont.placeOfIssueName || '';
			this.birthPlace = commCont.birthPlace || '';
			this.birthPlaceName = commCont.birthPlaceName || '';
			this.passport = commCont.passport;
			this.passportPeriod = commCont.passportPeriod || '';
			//将值存在缓存里
			common.sessionset("commCont",commCont);
		},
		methods: {
			goback:function(){
			Vue.router.goPath('/addCommonContacts');
			},
			//保存去编辑常用信息页面
			toCommonInfo: function(){
				//获取到列表数据
				Vue.router.goPath("/addCommonContacts");
			},
			addDate : function(){
				var that = this;
				var dtpicker = new mui.DtPicker({
				    type: "date",//设置日历初始视图模式 
				    beginDate: new Date(1949, 01, 01),//设置开始日期 
				    endDate: new Date(2099, 12, 31),//设置结束日期 
				}) 
				dtpicker.show(function(e) {
					that.passportPeriod = e.text;
				});
			},
//			getCommCont : function(){
//				var commCont = common.sessionget("commCont");
//				if(commCont){
//					commCont = {};
//				}
//				return commCont;
//			}
		}
	});

	module.exports = VueComponent;
});