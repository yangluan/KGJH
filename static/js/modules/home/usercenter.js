/**
 * Created by zackey on 2016/5/28.
 */
// 定义组件

define(function(require, exports, module) {
	//请求、公共js、模板页面
	var $conn = require("$conn");
	var common = require("common");
	var UserCenter = require("templates/home/userCenter.html");
	require("css/home/usercenter.css");
	var homeFooter = require('js/modules/home/homeIndex.js');//主页切换导航栏
	
	var VueComponent1 = Vue.extend({
		template: UserCenter,
		components: {
			'home-footer':homeFooter
		},

		data: function() {
			return {
				empInfo : '', //用户数据
				vipCorp : ''  // 用户对应的企业数据
			}
		},
		created: function() {
			this.getUserData();
		},
		methods: {
			//初始话页面的数据
			getUserData: function() {
				this.empInfo = common.sessionget('userInfo').empInfo;//从缓存中获取用户数据
				this.vipCorp = common.sessionget('userInfo').vipCorp;//从缓存中获取用户对应的企业数据
			}
		},
	});

	module.exports = VueComponent1;
});