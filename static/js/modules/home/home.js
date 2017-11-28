/**
 * Created by zackey on 2016/5/28.
 */
// 定义组件

define(function(require, exports, module) {
	//请求、公共js、模板页面
	var $conn = require("$conn");
	var common = require("common");
	var Home = require("templates/home/home.html");
	var homeFooter = require('js/modules/home/homeIndex.js');
	require("css/home/home.css");

	var fun = {
		beforeFun: function() {
			//			mui.alert("方法调用前执行")
			say("方法调用前执行");
		},
		thenBefore: function() {
			//			mui.alert("请求发生前执行")
			say("请求发生前执行");
		},
		thenAfter: function() {
			//			mui.alert("收到响应后执行")
			say("收到响应后执行");
		}
	}

	var VueComponent = Vue.extend({
		template: Home,
		components: {
			'home-footer':homeFooter
		},
		data: function() {
			return {
				bookStyle: 1,
			}
		},
		created: function() {
			this.startFooter();

		},
		mounted: function() {
			this.sliderImg();
		},

		methods: {
			startFooter: function() {
				var userInfo = common.sessionget('userInfo');
				this.bookStyle = userInfo.vipCorp.bookStyle;
			},
			sliderImg: function() {
				mui.init({
					swipeBack: true //启用右滑关闭功能
				});
				var slider = mui("#slider");
				slider.slider({
					//										interval: 5000 //每隔5秒调用一次
				});
			},
			//即将上线
			willLine: function() {
				mui.alert('即将上线,敬请期待！')
			},
		}

	});

	module.exports = VueComponent;
});