define(function(require, exports, module) {
	var CommonInfo = require("templates/home/commonInfo.html");
	var common = require("common");
	var $conn = require("$conn");
	require("css/home/commonInfo.css");
	
	var VueComponent = Vue.extend({
		template: CommonInfo,
		data: function() {
			return {
					addrList:[],//常用地址列表数据
					contactList:[],//常用联系人
					active : 1,
			};
		},
		created: function() {
			this.vipEmpAddrGetList();
			this.vipEmpContactsGetList();
			if(this.$route.query.active){
				this.active = this.$route.query.active;
			};
		},
		update:function(){
			this.vipEmpAddrGetList();
			this.vipEmpContactsGetList();
		},
		methods: {
			// 获取常用地址
			vipEmpAddrGetList: function() {
				var queryString ={};
				$conn.getConn("user.vipEmpAddrGetList")(queryString, function(resq) {
					//获取常用地址列表数据
					this.addrList = resq.data;
				}.bind(this));
			},
			// 获取常用联系人
			vipEmpContactsGetList: function() {
				var queryString ={};
				$conn.getConn("user.vipEmpContactsGetList")(queryString, function(resq) {
					this.contactList = resq.data;
					console.log(this.contactList);
				}.bind(this));
			},
			//删除常用地址
			delCommonAddr:function(id){
				var that =this;
				var btnArray = ['否', '是'];
				mui.confirm("请确认删除？","提示",btnArray,function(e){
					if (e.index == 1) {
						var queryString ={empAddrId:id};
						$conn.getConn("user.vipEmpAddrDel")(queryString, function(resq) {
							mui.alert('删除成功');
							that.vipEmpAddrGetList();
						});
					}
				});
			},
			//删除常用联系人
			delCommonCon:function(id){
				var that =this;
				var btnArray = ['否', '是'];
				mui.confirm("请确认删除？","提示",btnArray,function(e){
					if (e.index == 1) {
						var queryString ={contactsId:id};
						$conn.getConn("user.vipEmpContactsDel")(queryString, function(resq) {
		               		mui.alert('删除成功');
		               		that.vipEmpContactsGetList();
						}.bind(this));
                    }
				});
			},
			//跳转新增常用联系人
			addCommonCont : function(){
				common.sessionremove("commCont");//清除缓存防止和编辑串数据
				Vue.router.goPath("/addCommonContacts");
			},
			//返回到个人中心
			toUserCenter :function(){
				Vue.router.goPath("/userCenter");
			}
		}
	});
	module.exports = VueComponent;
});