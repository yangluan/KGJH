define(function(require, exports, module) {
	//请求、公共js、模板页面
	var $conn = require("$conn");
	var common = require("common");
	var userInfo = require("templates/home/userInfo.html");
	require("css/home/userInfo.css");
	var userInfoVue = Vue.extend({
		template: userInfo,
		data: function() {
			return {
				empNo: '', //员工编号
				empName: '', //员工姓名
				idNumber: '', //身份证号
				passport: '', //护照
				phoneNumber: '', //手机号
				email: '', //邮箱
				preference: '', //个人偏好
				verifyPhone: '', //是否验证手机号 1是 0否

				//--------
				isShowDept: true, //判断tab切换
				deptName: '',   // 部门名称
				empRankName:'',  // 职级名称
				empRank: '',    // 职级
				costCenterName: '',  //成本中心
				appBook: "",         //作为预订人时的审批属性:
				appTravel: '',        //作为预订人时的审批属性
				ifApprover :'',  //是否审批人
				bookRange:'',    //待定范围
				bookOutside :''  ,  //为外来人预定
			}
		},
		created: function() {
			var user = common.sessionget("userInfo");
			var empInfo = user.empInfo;
			this.empNo = empInfo.empNo; //员工编号
			this.empName = empInfo.empName; //员工姓名
			this.idNumber = empInfo.idNumber; //身份证号
			this.passport = empInfo.passport; //护照
			this.phoneNumber = empInfo.phoneNumber; //手机号
			this.email = empInfo.email; //邮箱
			this.preference = empInfo.preference; //个人偏好
			this.verifyPhone = empInfo.verifyPhone; //是否验证手机号 1是 0否
			if(this.preference) {
				if(this.preference.length > 5) {
					this.preference = this.preference.substring(0, 10) + "...";
				}
			};
			//---------tab切换
			this.deptName = empInfo.deptName;
			this.empRank = empInfo.empRank;
			this.empRankName = empInfo.empRankName;
			console.log(this.empRankName,'员工职级')
			this.costCenterName = empInfo.costCenterName;
			this.appBook = empInfo.appBook;
			this.appTravel = empInfo.appTravel;
			this.ifApprover = empInfo.ifApprover;
			this.bookOutside = empInfo.bookOutside;
			this.bookRange = empInfo.bookRange;
		},
		methods: {
			goback:function(){
				Vue.router.goPath('/userCenter');
			},
			logOut: function() {
				var btnArray = ['否', '是'];
				mui.confirm("请确认退出？", "提示", btnArray, function(e) {
					if(e.index == 1) {
						var loginData = window.localStorage.getItem("loginGao");
//						console.log(JSON.parse(loginData),'JSON')
//							console.log(JSON.parse(loginData),'josn')
						common.sessionclear();
						common.localclear();
//						console.log(JSON.stringify(loginData))
						window.localStorage.setItem("loginGao", loginData); //只留下用户的信息
						Vue.router.goPath("/");
					}
				});
			},
			lookDept: function(num) {
				if(num == 1) {
					this.isShowDept = true;
				} else {
					this.isShowDept = false;
				}
			},

		},
		filters: {
			mianshen: function(val) {
				if(val == 0) {
					return '审批';
				};
				if(val == 1) {
					return "免审"
				}
			},
			rangeFilter:function(val){
				if(val==0){
					return  '为本人预定'
				}else if(val == 1){
					return  '为本部门预定'
				}else{
					return '为全公司预定'
				}
			},
			waiFilter:function(val){
				if(val==0){
					return '否'
				}else{
					return '能'
				}
			},
			shenFilter:function(val){
				if(val==0){
					return '否'
				}else{
					return '是'
				}
			}
		},
	});
	module.exports = userInfoVue;
});