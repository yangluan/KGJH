define(function(require, exports, module){
	//保持大小写一致
	var ForgetPassword = require("templates/login/loginForgetPassword.html");
	var common = require("common");
	var $conn = require("$conn");
	require("css/login/loginForgetPassword.css");
	var VueComponent = Vue.extend({
		template: ForgetPassword,
		data: function() {
			return {
				wait: 60,
				telephone: "",
				type: "",
				yanzhengma: ""
			};
		},
		created: function() {},
		methods: {
			//倒计时60s
			show: function(o) {
				var time = this;
				if(time.wait == 0) {
					o.removeAttribute("disabled");
					o.innerHTML = "获取验证码";
					time.wait = 60;
				} else {
					o.setAttribute("disabled", true);
					o.innerHTML = time.wait + "s";
					time.wait--;
					setTimeout(function() {
						time.show(o);
					}, 1000);
				}
			},
			//获取短信验证码
			getsmscode: function() {
				if(this.telephone == '') {
					
					mui.alert('您的手机号不能为空！');
					return;
				} else {
					var reg = /^1[0-9]{10}$/,
						flag = reg.test(this.telephone);
					if(flag) {	
						var queryString = {
							phoneNumber: this.telephone,
							type: "忘记密码"
						};
						$conn.getConn("user.smsCodeGet")(queryString, function(resp) {
							var second = document.getElementById("btn");
						    this.show(second);
//							say(resp.data);
						}.bind(this));
					};
					if(!flag) {
						mui.alert('您的手机号格式不正确！');
					};
				};

			},
			//获取短信验证码校验
			smscodecheck: function() {
				var queryString = {
					phoneNumber: this.telephone,
					smsCode: this.yanzhengma
				};
				if(this.yanzhengma == '') {
					mui.alert('请输入验证码！');
					return;
				} else {
					var reg1 = /^\d{6}$/,
						flag1 = reg1.test(this.yanzhengma);
					say(flag1);
					if(flag1) {
						//调用获取验证码校验接口
						$conn.getConn("user.smsCodeCheck")(queryString, function(resp) {
//							say(resp.data);
							//跳转路由到重置密码页面
							if(resp.data.checkResult == 0) {
								mui.alert(resp.data.cause);
							};
							if(resp.data.checkResult == 1) {
								Vue.router.goPath("/SetPass?phoneNumber=" + this.telephone + '&smsCode=' + this.yanzhengma);
							};

						}.bind(this));
					};
					if(!flag1){
						mui.alert('验证码格式不正确！');
					}
				}

			}
		}
	});
	module.exports = VueComponent;
});