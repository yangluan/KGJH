define(function(require, exports, module) {
	var applicationList = require("templates/home/applicationList.html");
	var common = require("common");
	var $conn = require("$conn");
	var Scroll = require("js/modules/control/loaderMore.js");
	require('css/home/applicationList.css');
	var VueComponent = Vue.extend({
		template: applicationList,
		data: function() {
			return {
				applyList: [],
				pages: 0, //总页数
				downdata: [],
				isLoader: true,
				pageNum: 1,
				count: 10,
				// 其他过滤条件
				status: '',
				dateType: '',
				dateBegin: "",
				dateEnd: '',
				ccr: '',
			}
		},
		components: {
			'v-scroll':Scroll,
		},
		created: function() {
			var queryFilter = this.$route.query.queryFilter;
			if(queryFilter != undefined && queryFilter != '') {
				var queryObj = JSON.parse(this.$route.query.queryFilter);
				this.status = queryObj.status || '';
				this.dateType = queryObj.dateType || '';
				this.dateBegin = queryObj.dateBegin || '';
				this.dateEnd = queryObj.dateEnd || '';
				this.ccr = queryObj.ccr || '';
				this.getApplicationList(1, '1');
			} else {
				//初始指   下拉刷新  传值 1  ；
//				this.onRefresh();
				this.getApplicationList(1, '1');
			};

		},
		mounted: function() {

		},
		//过滤器判断订单状态
		filters: {
			orderListStatus: function(val) {
				if(val == 0) {
					return '草稿';
				};
				if(val == 1) {
					return '审批中';
				};
				if(val == 2) {
					return '审批通过';
				};

				if(val == 3) {
					return '审批拒绝';
				};
				if(val == 4) {
					return '报销中';
				};
				if(val == 5) {
					return '已报销';
				};
			}
		},
		methods: {
			addApply:function(){
				Vue.router.goPath('/application');
			},
			goback:function(){
				Vue.router.goPath('/userCenter');			
			},
			//获取接口，设置函数回调
			getApplicationList: function(pageNum, type) {
				var queryString = {
					count: 10, //每页条数
					pageNum: pageNum,
					status: this.status,
					dateType: this.dateType,
					dateBegin: this.dateBegin,
					dateEnd: this.dateEnd,
					ccr: this.ccr,
				};
				console.log(queryString)
				$conn.getConn("user.vipCcsqdGetList")(queryString, function(resq) {
					say(resq.data);
					if(type == 1) {
						
						this.applyList = resq.data.list;
						this.pages = resq.data.pages;
						console.log('-----')
						if(resq.data.total<10){
							console.log('+++++++')
							console.log(this.$children[0]);
							console.log(this.$el)
						
						};
					};
					if(type == 2) {
						this.downdata = this.downdata.concat(resq.data.list);
						console.log(this.downdata, '加载更多数据！')
						this.isLoader = true;
						return;
					};
				}.bind(this));
			},
			onRefresh: function(done) {
				this.getApplicationList(1, 1);
				done(); // call done
				this.$el.querySelector('.load-more').style.display = 'none';
			},
			onInfinite: function(done) {

				if(!this.isLoader) {
					return;
				} else {
					this.pageNum++;
					if(this.pageNum <= this.pages) {
						this.getApplicationList(this.pageNum, 2);
					}
					this.$el.querySelector('.load-more').style.display = 'none';
					this.$el.querySelector('.load-more').innerText = '已经是最后一条了！'		
					done();
				}
			},
			//--------删除操作
			toDelApplication: function(id, index) {
				mui.confirm('您确定要删除草稿吗？', '', ['取消', '确定'], function(e) {
					e.index == 0 ? '' : this.toDelCaoGaoAjax(id, index);
					Vue.nextTick(function() {});
				}.bind(this));
			},
			toDelCaoGaoAjax: function(id, index) {
				var queryString = {
					ccsqdId: id
				};
				$conn.getConn("user.vipCcsqdDel")(queryString, function(resq) {
					this.applyList.splice(index, 1);
				}.bind(this));
			},
			//出差申请单  筛选操作
			toFilter: function() {
				Vue.router.goPath('/applyListFilter')
			}
		},
		watch: {}
	});

	module.exports = VueComponent;
});