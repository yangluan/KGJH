;
define(function(require, exports, module) {
	var applyListFilter = require("templates/home/applyListFilter.html");
	var common = require("common");
	require('css/home/applyListFilter.css');
	var VueComponent = Vue.extend({
		template: applyListFilter,
		data: function() {
			return {
				wayArr: ['飞机', '火车', '其他'],
				applyStatusArr: ['全部', '草稿', '审批中', '审批通过', '审批拒绝', '报销中', '已报销'],
				dateType: ['申请日期', '出差日期'],
				startDate: '2017-08-15',
				endDate: '2017-10-10',
				person: '',
				//  被选中索引  默认索引
				indexWay: 0,
				indexStatus: 0,
				indexDateType: 1,
				//------
			}
		},
		created: function() {

		},
		activated:function(){
			this.getDateByRoute();
		},
		methods: {
			goback: function() {
				history.go(-1);
			},
			cancelFilter: function() {
				this.indexWay = 0;
				this.indexStatus = 0;
				this.indexDateType = 1;
			},
			// 单选    选择出差方式
			chooseApplyWay: function(index) {
				this.indexWay = index;
			},
			//单选  选择出差状态
			chooseApplyStatus: function(index) {
				this.indexStatus = index;
			},
			//单选   日期类型
			chooseDateType: function(index) {
				this.indexDateType = index + 1;
			},
			//确认选中的过滤条件
			confirmFilter: function() {
				var filterQuery = {
					status: this.indexStatus,
					dateType: this.indexDateType,
					dateBegin: this.startDate,
					dateEnd: this.endDate,
					ccr: this.person
				};
				Vue.router.goPath('/applicationList?queryFilter=' + JSON.stringify(filterQuery))
			},
			//点击 去获取日期
			getDate:function(num){
				if(num==1){
					Vue.router.goPath('date?type=applyListFilter&dateNo=start&beforeDate=1');
				};
				if(num==2){
					Vue.router.goPath('date?type=applyListFilter&dateNo=end&beforeDate=1');
				}
			},
			//通过路由获取时间
			getDateByRoute:function(){
				var dateNo = this.$route.query.dateNo || '';
				var date = this.$route.query.date ;
				if(dateNo=='start'){
					this.startDate = date ;
				}
				if(dateNo=='end'){
					this.endDate = date ;
				}
			},
			
			
		},
	});

	module.exports = VueComponent;
});