define(function(require, exports, module) {
	//此处的Login要和下面的template: Login大小写一致
	var baseImg = '/obt-app/static/image/';
	var Login = require("templates/login/loginIndex.html");
	var common = require("common");
	var $conn = require("$conn");
	require('css/login/loginIndex.css');
	var VueComponent = Vue.extend({
		template: Login,
		data: function() {
			return {
				corpNo: '', //工号登录
				loginName: '',
				comPass: '', //密码
				//登录工号1 ，手机号0 ;
				loginType: '1',
				//--------
				telePhone: '',
				telePass: '',
				isActive: true,
				isActive2: false,
				//点亮字体图标
				ischange: false,
				ischange1: false,
				ischange2: false,
				ischange3: false,
				ischange4: false,
				//logo  tuPian
				logoImgSrc: baseImg + 'login/logo.png',
				isChoose: true,
			}
		},
		created: function() {

		},
		mounted: function() {

			// 获取保存的 用户名、工号  或者 手机号  
			var user = window.localStorage.getItem('loginGao');
			if(user) {
				userObj = JSON.parse(user)
				if(userObj.loginType == 1) { //工号登录
					this.toUseCom(1);
					this.corpNo = userObj.corpNo;
					this.loginName = userObj.loginName;
					this.ischange = true;
					this.ischange1 = true;
					this.ischange2 = true;
				};
				if(userObj.loginType == 0) { // 用户名登录
					this.toUseCom(0);
					this.telePhone = userObj.telePhone;
					this.ischange3 = true;
					this.ischange4=true;
				};
			}
		},
		methods: {
			// 判断登录类型
			toUseCom: function(b) {
				if(b == 1) {
					this.isActive = true;
					this.isActive2 = false;
					this.loginType = '1';
					this.isChoose = true;
				};
				if(b == 0) {
					this.isActive = false;
					this.isActive2 = true;
					this.loginType = '0';
					this.isChoose = false;
				}
			},
			//使图标高亮
			toClass: function(a) {
				if(a == 0) {
					this.ischange = true;
				} else if(a == 1) {
					this.ischange1 = true;
				} else if(a == 2) {
					this.ischange2 = true;
				} else if(a == 3) {
					this.ischange3 = true;
				} else if(a == 4) {
					this.ischange4 = true;
				}
			},
			//去登录,同时判断工号登录1 、 手机号登陆0
			toLoginHome: function() {
				var queryString;
				var userData;
				///			判断工号登录
				if(this.loginType == 1) {
					if(!this.corpNo.trim()) {
						mui.alert("请输入企业代码");
						return;
					}
					if(!this.loginName.trim()) {
						mui.alert("请输入员工工号");
						return;
					}
					if(!this.comPass.trim()) {
						mui.alert("请输入密码");
						return;
					}
					queryString = {
						"corpNo": this.corpNo.trim(),
						"loginName": this.loginName.trim(),
						"loginType": this.loginType,
						"password": this.comPass.trim()
					};

				};
				//判断手机号登陆
				if(this.loginType == 0) {
					var reg = /^1[0-9]{10}$/;
					if(!reg.test(this.telePhone.trim())) {
						mui.alert("请输入正确的手机号");
						return;
					}
					if(!this.telePass.trim()) {
						mui.alert("请输入密码");
						return;
					}
					queryString = {
						"loginName": this.telePhone.trim(),
						"loginType": this.loginType,
						"password": this.telePass.trim()
					};
				};
				//代存储  用户信息
				var loginData = {
					loginType: this.loginType.trim(),
					loginName: this.loginName.trim(),
					telePhone: this.telePhone.trim(),
					corpNo: this.corpNo.trim()
				}
				$conn.getConn("user.vipLogin")(queryString, function(resp) {
					// 存储登录信息  用于 下次登录
				window.localStorage.setItem('loginGao', JSON.stringify(loginData));
					//将登录token缓存到浏览器本地储存
					common.sessionset("access_token", resp.data);
					// 获取员工信息
					$conn.getConn("user.getLoginUserInfo")({}, function(resp2) {
						common.sessionset("userInfo", resp2.data);
						//跳转到首页
						Vue.router.goPath("/home");
					});

				})

			},
		}
	});
	module.exports = VueComponent;
});