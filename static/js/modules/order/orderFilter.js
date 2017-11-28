//
;
define(function(require, exports, module) {
	var orderFilter = require("templates/order/orderFilter.html");
	var common = require("common");
	require('css/order/orderFilter.css');
	var VueComponent = Vue.extend({
		template: orderFilter,
		data: function() {
			return {
				//数据  展示
				applyType: [{
					name: '全部',
					tripType: '',
					isChoose: true
				}, {
					name: '因公',
					tripType: '1',
				}, {
					name: '因私',
					tripType: '2'
				}],
				passTrip: [{
					name: '全部',
					productType: '',
					isChoose: true
				},  {
					name: '机票',
					productType: '10901',
				},
//				{
//					name: '国际机票',
//					productType: '10902',
//				},
				{
					name: '酒店',
					productType: '10903',
				}
//				, {
//					name: '国际酒店',
//					productType: '10903',
//				}
				, {
					name: '火车票',
					productType: '10904',
				}
//				, {
//					name: '其他',
//					productType: '10999'
//				}
				],
				dateTypeArr: [{
					name: '预订日期',
					num: '1',
					isChoose: true
				}, {
					name: '出发/入住日期',
					num: '2'
				}],
				dateStartInput: '2017-06-05',
				dataEndInput: '2017-09-25',
				chooseDateType: 1,
				chooseProductType: '',
				chooseTripType: '',
				
			};
		},
		created: function() {

		},
		mounted: function() {

		},
		activated:function(){
			this.getRouteDate();
		},
		methods: {
			goback: function() {
				window.history.go(-1);
			},
			//取消筛选
			toCancleFilter: function() {
				for(var a = 0; a < this.applyType.length; a++) {
					if(a != 0) {
						Vue.set(this.applyType[a], 'isChoose', false)
					} else {
						Vue.set(this.applyType[0], 'isChoose', true)
					}
				};
				for(var a = 0; a < this.dateTypeArr.length; a++) {
					if(a != 0) {
						Vue.set(this.dateTypeArr[a], 'isChoose', false)
					} else {
						Vue.set(this.dateTypeArr[0], 'isChoose', true)
					}
				};
				for(var a = 0; a < this.passTrip.length; a++) {
					if(a != 0) {
						Vue.set(this.passTrip[a], 'isChoose', false)
					} else {
						Vue.set(this.passTrip[0], 'isChoose', true)
					}
				};
			},
			// 单选问题
			// 出差类型
			applyDanXuan: function(val, i) {
				Vue.set(val, 'isChoose', true);
				if(val['isChoose']) {
					this.chooseTripType = val['tripType'];
					for(var a = 0; a < this.applyType.length; a++) {
						if(a != i) {
							Vue.set(this.applyType[a], 'isChoose', false);
						}
					}
				};
			},
			//行程类型
			passTripDanXuan: function(val, i) {
				Vue.set(val, 'isChoose', true);
				if(val['isChoose']) {
					this.chooseProductType = val['productType'];
					for(var a = 0; a < this.passTrip.length; a++) {
						if(a != i) {
							Vue.set(this.passTrip[a], 'isChoose', false);
						}
					}
				};
			},
			// 日期类型
			dateTypeDanXuan: function(val, i) {
				Vue.set(val, 'isChoose', true);
				if(val['isChoose']) {
					this.chooseDateType = val['num'];
					for(var a = 0; a < this.dateTypeArr.length; a++) {
						if(a != i) {
							Vue.set(this.dateTypeArr[a], 'isChoose', false);
						}
					}
				};
			},
			// 筛选
			toConfirmFilter: function() {
				var queryData = {
					dateStart :this.dateStartInput,
					dateEnd :this.dataEndInput,
					dateType : this.chooseDateType,
					productType : this.chooseProductType,
					tripType : this.chooseTripType,
					findType:this.$route.query.findType,
					findScope:this.$route.query.findScope,
				};
				var queryString = JSON.stringify(queryData);
				Vue.router.goPath('/allorder?filterData=' + queryString );
			},
			// 获取日期    1 指开始日期      2. 指结束日期
			getDate:function(num){
				if(num==1){
					Vue.router.goPath('date?type=orderFilter&dateNo=start&beforeDate=1');
				};
				if(num==2){
					Vue.router.goPath('date?type=orderFilter&dateNo=end&beforeDate=1');
				};	
			},
			// 通过路由传值  获取
			getRouteDate:function(){
				var dateNo = this.$route.query.dateNo || '';
				var date = this.$route.query.date ;
				if(dateNo=='start'){
					this.dateStartInput = date ;
				}
				if(dateNo=='end'){
					this.dataEndInput = date ;
				}
			},
			
			
			
		},

	});

	module.exports = VueComponent;
});