define(function(require, exports, module) {
	//请求、公共js、模板页面
	var $conn = require("$conn");
	var common = require("common");
	var editUserInfo = require("templates/home/editUserInfo.html");
	require("css/home/editUserInfo.css");
	
	var user= common.sessionget("userInfo");
	var empInfo = user.empInfo;
	
	//定义vue扩展对象
	var editUserInfoVue = Vue.extend({
		template : editUserInfo,
		data : function(){
			return {
				editIdx :'',//页面展示的枚举
				editHomeName : '',//页面头部内容
				empInfo : empInfo,
				oldIdNumber : '',//旧身份证号 接口需要的
				yzmNo:'', //验证码
				oldPwd :'',//旧密码
				pwd : '',//当前密码
				qrPwd : '',//确认当前密码
			}
		},
		created :function() {
			this.editIdx = this.$route.query.editIdx; 
			this.editInfo();
			this.oldIdNumber = this.empInfo.idNumber;
		},
		mounted : function(){
			//获取用户信息
		 	var user= common.sessionget("userInfo");
			this.empInfo = user.empInfo;
			
			var self = this;
			mui('.mui-input-row input').input(); 
			mui(document.body).on('tap', '.mui-btn', function(e) {
				var yzmType = this.getAttribute('data-yzmType');
			    mui(this).button('loading');
			  	self.yzmTime(60,this)
			  	self.getYzm(yzmType);
			});
		},
		methods : {
			//编辑页面初始化的方法
			editInfo : function(){
				console.log(this.editIdx)
				if(this.editIdx == 1){
					this.editHomeName = "身份证号";
				}else if(this.editIdx == 2){
					this.editHomeName = "护照";
				}else if(this.editIdx == 3 && this.empInfo.verifyPhone == 1){
					this.editHomeName = "解绑手机";
				}else if(this.editIdx == 3 && this.empInfo.verifyPhone == 0){
					this.editHomeName = "绑定手机";
				}else if(this.editIdx == 4){
					this.editHomeName = "邮箱";
				}else if(this.editIdx == 5){
					this.editHomeName = "个人偏好";
				}else if(this.editIdx == 6){
					this.editHomeName = "修改密码";
				}
			},
			//保存
			saveUser : function(){
				var queryString = {
					email : this.empInfo.email,//邮箱
					idNumber : this.empInfo.idNumber,//身份证号码
					oldIdNumber : this.oldIdNumber,//旧身份证号
					passport : this.empInfo.passport,//护照号
					phoneNumber : this.empInfo.phoneNumber,//手机号
					preference : this.empInfo.preference, // 个人偏好 ,
				}
				$conn.getConn("user.vipEmpEditInfo")(queryString,function(resq){
					mui.alert("修改成功");
					$conn.getConn("user.getLoginUserInfo")({}, function(resp) {
						common.sessionset("userInfo", resp.data);
						Vue.router.goPath("/userInfo");
					});
				}.bind(this));
			},
			//返回个人信息页面
			goUserInfo :function(){
				Vue.router.goPath('/userInfo')
			},
			//倒计时
			yzmTime: function(time,th){
				var self = this;
				th.innerHTML= time;
				setTimeout(function() {
					time--;
					console.log(time);
					if(time == 0){
						mui(th).button('reset');
					}else{
						self.yzmTime(time,th);
					}
			    }.bind(th), 1000);
			},
			//获取验证码
			getYzm : function(yzmType){
				var queryString ={
					phoneNumber : this.empInfo.phoneNumber,
					type : yzmType
				}
				$conn.getConn("user.smsCodeGet")(queryString,function(resq){
					mui.alert("正在获取验证码");
				});
			},
			//手机绑定和解绑
			updatePhone : function(){
				if(this.empInfo.phoneNumber && this.yzmNo){
					var queryString = {
						phoneNumber :this.empInfo.phoneNumber,//手机号
						smsCode : this.yzmNo//验证码
					};
					//解绑手机
					if(this.empInfo.verifyPhone ==1){
						$conn.getConn("user.phoneUnbind")(queryString,function(resq){
							//解绑成功后
							if(resq.data.unbindResult==1){
								mui.alert("解绑成功");
								$conn.getConn("user.getLoginUserInfo")({}, function(resp) {
									common.sessionset("userInfo", resp.data);
									Vue.router.goPath("/userInfo");
								});
							}else{
								mui.alert(resq.data.cause);
							}
						}.bind(this));
					}else{//绑定手机
						$conn.getConn("user.phoneBinding")(queryString,function(resq){
							if(resq.data.bindResult == 1){
								$conn.getConn("user.getLoginUserInfo")({}, function(resp) {
									common.sessionset("userInfo", resp.data);
									Vue.router.goPath("/userInfo");
								});
							}else{
								mui.alert("绑定成功");
							}
						}.bind(this));
					}
				}else{
					mui.alert("手机号或验证码为空")
				}
			},
			//修改密码
			updatePwd : function(){
				var queryString ={
					oldPwd :this.oldPwd,
					pwd : this.pwd,
				};
				if(this.pwd != this.qrPwd){
					mui.alert("两次密码不相符");
				}else if(!this.oldPwd ){
					mui.alert("当前密码不能为空");
				}else{
					$conn.getConn("user.vipEmpEditPwd")(queryString,function(resq){
						mui.alert("修改成功,请重新登陆",function(){
							common.sessionclear();
							common.localclear();
							Vue.router.goPath("/");
						});
					});
				}
			}
		}
	});
	module.exports = editUserInfoVue;
});