define(function(require, exports, module) {
	//大小写一致
	var addCommonContacts = require("templates/home/addCommonContacts.html");
	var common = require("common");
	var $conn = require("$conn");
	require("css/home/addCommonContacts.css");
	var VueComponent = Vue.extend({
		template: addCommonContacts,
		data: function() {
			return {
				contactsId: '',//主键id
				phoneNumber: '', //手机号
				chName: '', //姓名
				idNumber: '', //身份证号
				passport: '',//护照号码
				birthPlace: '',//出生地
				birthPlaceName: '',//出生地
				placeOfIssue: '',//证件签发地
				placeOfIssueName: '',//证件签发地
				passportPeriod : '',//护照有效期
			};
		},
		watch :{
			//监听事件将值存在缓存中
			phoneNumber : function(){
				var commCont = common.sessionget("commCont");
				if(!commCont){
					commCont = {};
				}
				commCont.chName = this.chName;
				common.sessionset("commCont",commCont);
			},
			chName : function(){
				var commCont = common.sessionget("commCont");
				if(!commCont){
					commCont = {};
				}
				commCont.chName = this.chName;
				common.sessionset("commCont",commCont);
			},
			idNumber : function(){
				var commCont = common.sessionget("commCont");
				if(!commCont){
					commCont = {};
				}
				commCont.idNumber = this.idNumber;
				common.sessionset("commCont",commCont);
			},
		},
		created: function() {
			//从列表过来
			if(this.$route.query.contactsId){
				this.contactsId = this.$route.query.contactsId;
				this.phoneNumber = this.$route.query.phoneNumber;
				this.chName = this.$route.query.chName;
				this.idNumber = this.$route.query.idNumber;
				this.passport = this.$route.query.passport;
				this.birthPlace = this.$route.query.birthPlace;
				this.birthPlaceName = this.$route.query.birthPlaceName;
				this.placeOfIssue = this.$route.query.placeOfIssue;
				this.placeOfIssueName = this.$route.query.placeOfIssueName;
				this.passportPeriod = this.$route.query.passportPeriod;
				var commCont ={};
				commCont.contactsId = this.contactsId;
				commCont.phoneNumber = this.phoneNumber;
				commCont.chName = this.chName;
				commCont.idNumber = this.idNumber;
				commCont.passport = this.passport;
				commCont.birthPlace = this.birthPlace;
				commCont.birthPlaceName = this.birthPlaceName;
				commCont.placeOfIssue = this.placeOfIssue;
				commCont.placeOfIssueName = this.placeOfIssueName;
				commCont.passportPeriod = this.passportPeriod;
				common.sessionset("commCont",commCont);
			}else{
				//从其他地方过来
				var commCont =  common.sessionget("commCont");
				if(commCont){
					this.contactsId = commCont.contactsId;
					this.phoneNumber = commCont.phoneNumber;
					this.chName = commCont.chName;
					this.idNumber = commCont.idNumber;
					this.passport = commCont.passport;
					this.birthPlace = commCont.birthPlace;
					this.birthPlaceName = commCont.birthPlaceName;
					this.placeOfIssue = commCont.placeOfIssue;
					this.placeOfIssueName = commCont.placeOfIssueName;
					this.passportPeriod = commCont.passportPeriod;
				}
			}
		},
		activated:function(){
			
		},
		methods: {
			//保存并跳转到常用信息列表
			saveCommonInfo: function() {
				var reg = /^1[0-9]{10}$/,
				flag = reg.test(this.phoneNumber);
				if(!flag){
					mui.alert("请输入正确的手机号");
				}else if(!this.chName){
					mui.alert("姓名不能为空");
				}else if (!this.idNumber && !this.passport){
					mui.alert("身份证号和护照号必须填一个");
				}else{
					var queryString = {
						idNumber: this.idNumber, //身份证号
						phoneNumber: this.phoneNumber, //手机号
						passport: this.passport, //护照号
						chName: this.chName, //姓名
						birthPlace: this.birthPlace,//护照出生地
						placeOfIssue : this.placeOfIssue,//护照签发地
						passportPeriod : this.passportPeriod//护照有效期
					};
					if(this.contactsId){
						queryString.contactsId = this.contactsId;//主键id
					}
					$conn.getConn("user.vipEmpContactsEdit")(queryString,function(resq){
						mui.alert("保存成功");
						common.sessionremove("commCont");//清除缓存防止和编辑串数据
						Vue.router.goPath("/commonInfo?active=0");						
					}.bind(this));
				}
			},
			toCommonInfo : function(){
				common.sessionremove("commCont");//清除缓存防止和编辑串数据
				Vue.router.goPath("/commonInfo?active=0");				
			}
		},
	});

	module.exports = VueComponent;
});