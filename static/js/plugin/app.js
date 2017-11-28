;

define(function(require, exports, module) {
	var a = '/obt-app/image/';
	var router = new VueRouter({
		linkActiveClass: 'mui-active',
		routes: [
			//登录、个人中心
			{
				path: '/',
				component: function(resolve) {
					require.async(['js/modules/login/loginIndex.js'], resolve);
				},
				meta: {
					keepAlive: false,
					baseUrl: a
				}
			},
			{
				//重置密码
				path: '/SetPass',
				component: function(resolve) {
					require.async(['js/modules/login/loginSetPassword.js'], resolve);
				},
				meta: {
					keepAlive: false
				}
			},
			{
				//忘记密码
				path: '/forgetPass',
				component: function(resolve) {
					require.async(['js/modules/login/loginForgetPassword.js'], resolve);
				},
				meta: {
					keepAlive: false
				}
			},
			{
				//个人中心首页
				path: '/home',
				component: function(resolve) {
					require.async(['js/modules/home/home.js'], resolve);
				},
				meta: {
					keepAlive: false
				}
			},
			{
				//个人中心详情
				path: '/userInfo',
				component: function(resolve) {
					require.async(['js/modules/home/userInfo.js'], resolve);
				},
				meta: {
					keepAlive: false
				}
			},
			{
				//修改个人中心详情
				path: '/editUserInfo',
				component: function(resolve) {
					require.async(['js/modules/home/editUserInfo.js'], resolve);
				},
				meta: {
					keepAlive: false
				}
			},
			{
				//个人中心
				path: '/usercenter',
				component: function(resolve) {
					require.async(['js/modules/home/usercenter.js'], resolve);
				},
				meta: {
					keepAlive: false
				}
			},
			{
				//出差申请单列表
				path: '/applicationList',
				component: function(resolve) {
					require.async(['js/modules/home/applicationList.js'], resolve);
				},
				meta: {
					keepAlive: false
				}
			},
			{
				//  applyListFilter   出差申请单  筛选
				path: '/applyListFilter',
				component: function(resolve) {
					require.async(['js/modules/home/applyListFilter.js'], resolve);
				},
				meta: {
					keepAlive: true
				}
			},
			{
				//需要我审批列表
				path: '/needApprovalList',
				component: function(resolve) {
					require.async(['js/modules/home/needApprovalList.js'], resolve);
				},
				meta: {
					keepAlive: false
				}
			},
			//选择出差申请单  控件
			{
				path: '/chooseApplicationList',
				component: function(resolve) {
					require.async(['js/modules/control/chooseApplicationList.js'], resolve);
				},
				meta: {
					keepAlive: true
				}
			},
			//常用信息页面
			{
				path: '/commonInfo',
				component: function(resolve) {
					require.async(['js/modules/home/commonInfo.js'], resolve);
				},
				meta: {
					keepAlive: false
				}
			},
			//新增常用地址
			{
				path: '/addCommonAddress',
				component: function(resolve) {
					require.async(['js/modules/home/addCommonAddress.js'], resolve);
				},
				meta: {
					keepAlive: false
				}
			},
			//新增常用联系人
			{
				path: '/addCommonContacts',
				component: function(resolve) {
					require.async(['js/modules/home/addCommonContacts.js'], resolve);
				},
				meta: {
					keepAlive: false
				}
			},
			//编辑护照信息
			{
				path: '/editPassport',
				component: function(resolve) {
					require.async(['js/modules/home/editPassport.js'], resolve);
				},
				meta: {
					keepAlive: false
				}
			},
			// 全部订单
			{
				path: '/allorder',
				component: function(resolve) {
					require.async(['js/modules/order/allorder.js'], resolve);
				},
				meta: {
					keepAlive: false
				}
			},
			//筛选订单
			{
				path: '/orderFilter',
				component: function(resolve) {
					require.async(['js/modules/order/orderFilter.js'], resolve);
				},
				meta: {
					keepAlive: true
				}
			},
			// 支付模块
			{
				path: '/pay',
				component: function(resolve) {
					require.async(['js/modules/pay/pay.js'], resolve);
				},
				meta: {
					keepAlive: false
				}
			},
			//申请退票
			{
				path: '/applyRefundTicket',
				component: function(resolve) {
					require.async(['js/modules/refundTicket/applyRefundTicket.js'], resolve);
				},
				meta: {
					keepAlive: true
				}
			},
			//申请退票完成
			{
				path: '/refundTicketCompelete',
				component: function(resolve) {
					require.async(['js/modules/refundTicket/refundTicketCompelete.js'], resolve);
				},
				meta: {
					keepAlive: false
				}
			},
			//退票详情页面
			{
				path: '/refundTicketDetail',
				component: function(resolve) {
					require.async(['js/modules/refundTicket/refundTicketDetail.js'], resolve);
				},
				meta: {
					keepAlive: false
				}
			},
			// 选择企业原因
			{
				path: '/chooseCompanyReason',
				component: function(resolve) {
					require.async(['js/modules/control/chooseCompanyReason.js'], resolve);
				},
				meta: {
					keepAlive: false
				}
			},
			//机票改签       申请改签
			{
				path: '/applyAlterTicket',
				component: function(resolve) {
					require.async(['js/modules/alterTicket/applyAlterTicket.js'], resolve);
				},
				meta: {
					keepAlive: true
				}
			},
			// 申请 改签完成页
			{
				path: '/alterTicketCompelete',
				component: function(resolve) {
					require.async(['js/modules/alterTicket/alterTicketCompelete.js'], resolve);
				},
				meta: {
					keepAlive: false
				}
			},
			// 改签 单 详情页
			{
				path: '/alterTicketDetail',
				component: function(resolve) {
					require.async(['js/modules/alterTicket/alterTicketDetail.js'], resolve);
				},
				meta: {
					keepAlive: false
				}
			},
			// 改签航班列表
			{
				path: '/alterFlightList',
				component: function(resolve) {
					require.async(['js/modules/alterTicket/alterFlightList.js'], resolve);
				},
				meta: {
					keepAlive: false
				}
			},
			// 审批进度  approvalProgress   公共
			{
				path: '/approvalProgress',
				component: function(resolve) {
					require.async(['js/modules/approval/approvalProgress.js'], resolve);
				},
				meta: {
					keepAlive: false
				}
			},
			//  送审 (公共)   gaosir
			{
				path: '/approvalSend',
				component: function(resolve) {
					require.async(['js/modules/approval/approvalSend.js'], resolve);
				},
				meta: {
					keepAlive: false
				}
			},
			//审批详情页面   
			{
				path: '/approvalDetail',
				component: function(resolve) {
					require.async(['js/modules/approval/approvalDetail.js'], resolve);
				},
				meta: {
					keepAlive: false
				}

			},
			//机票查询
			{
				path: '/tkQuery',
				component: function(resolve) {
					require.async(['js/modules/tkBook/tkQuery.js'], resolve);
				},
				meta: {
					keepAlive: true
				}
			},
			//航班列表
			{
				path: '/flightlist',
				component: function(resolve) {
					require.async(['js/modules/tkBook/flightlist.js'], resolve);
				},
				meta: {
					keepAlive: false
				}
			},
			//舱位列表
			{
				path: '/tkCabin',
				component: function(resolve) {
					require.async(['js/modules/tkBook/tkCabin.js'], resolve);
				},
				meta: {
					keepAlive: false
				}
			},
			//筛选页面
			{
				path: '/tkScreen',
				component: function(resolve) {
					require.async(['js/modules/tkBook/tkScreen.js'], resolve);
				},
				meta: {
					keepAlive: false
				}
			},
			//违背原因页面
			{
				path: '/tkViolateItem',
				component: function(resolve) {
					require.async(['js/modules/tkBook/tkViolateItem.js'], resolve);
				},
				meta: {
					keepAlive: false
				}
			},
			//订单填写页面
			{
				path: '/tkOrderEdit',
				component: function(resolve) {
					require.async(['js/modules/tkBook/tkOrderEdit.js'], resolve);
				},
				meta: {
					keepAlive: true
				}
			},
			//订单完成页面
			{
				path: '/tkBookcmp',
				component: function(resolve) {
					require.async(['js/modules/tkBook/tkBookcmp.js'], resolve);
				},
				meta: {
					keepAlive: false
				}
			},
			//订单详情页面
			{
				path: '/tkOrderDetails',
				component: function(resolve) {
					require.async(['js/modules/tkBook/tkOrderDetails.js'], resolve);
				},
				meta: {
					keepAlive: false
				}
			},
			//出行人
			{
				path: '/cxr',
				component: function(resolve) {
					require.async(['js/modules/control/cxr.js'], resolve);
				},
				meta: {
					keepAlive: false
				}
			},
			//城市
			{
				path: '/city',
				component: function(resolve) {
					require.async(['js/modules/control/city.js'], resolve);
				},
				meta: {
					keepAlive: false
				}
			},
			//日期
			{
				path: '/date',
				component: function(resolve) {
					require.async(['js/modules/control/date.js'], resolve);
				},
				meta: {
					keepAlive: false
				}
			},
			//新增乘机人
			{
				path: '/addContacts',
				component: function(resolve) {
					require.async(['js/modules/tkBook/addContacts.js'], resolve);
				},
				meta: {
					keepAlive: true
				}
			},
			//出差申请单
			{
				path: '/application',
				component: function(resolve) {
					require.async(['js/modules/application/application.js'], resolve);
				},
				meta: {
					keepAlive: true
				}
			},

            //出差申请单  出差人   applicationColleague
            {
                path: '/applicationColleague',
                component: function(resolve) {
                    require.async(['js/modules/application/applicationColleague.js'], resolve);
                },
                meta: {
                    keepAlive: true
                }
            },
			//出差申请单 (成本中心)
			{
				path: '/costCenter',
				component: function(resolve) {
					require.async(['js/modules/costCenter/costCenter.js'], resolve);
				},
				meta: {
					keepAlive: false
				}
			},
			//出差申请单 (住宿安排)
			{
				path: '/applicationAccommodation',
				component: function(resolve) {
					require.async(['js/modules/application/applicationAccommodation.js'], resolve);
				},
				meta: {
					keepAlive: false
				}
			},
			//出差申请单 (行程计划)
			{
				path: '/applicationTravelPlan',
				component: function(resolve) {
					require.async(['js/modules/application/applicationTravelPlan.js'], resolve);
				},
				meta: {
					keepAlive: true
				}
			},
			//出差申请单 (项目选择)
			{
				path: '/applicationProjectSelection',
				component: function(resolve) {
					require.async(['js/modules/application/applicationProjectSelection.js'], resolve);
				},
				meta: {
					keepAlive: false
				}
			},
			//出差申请单 (编辑行程页同行人员)
			{
				path: '/editTripCxr',
				component: function(resolve) {
					require.async(['js/modules/application/editTripCxr.js'], resolve);
				},
				meta: {
					keepAlive: false
				}
			},
			//出差申请单 (提交成功)  applicationApproval
			{
				path: '/subSuccess',
				component: function(resolve) {
					require.async(['js/modules/application/subSuccess.js'], resolve);
				},
				meta: {
					keepAlive: true
				}
			},
			//出差申请单 (审批规则)   DetailsApplications
			{
				path: '/applicationApproval',
				component: function(resolve) {
					require.async(['js/modules/application/applicationApproval.js'], resolve);
				},
				meta: {
					keepAlive: false
				}
			},
			//出差申请单 (详情)
			{
				path: '/DetailsApplications',
				component: function(resolve) {
					require.async(['js/modules/application/DetailsApplications.js'], resolve);
				},
				meta: {
					keepAlive: false
				}
			},
			//舱位列表
			{
				path: '/tkCabin',
				component: function(resolve) {
					require.async(['js/modules/tkBook/tkCabin.js'], resolve);
				},
				meta: {
					keepAlive: false
				}
			},
			//筛选页面
			{
				path: '/tkScreen',
				component: function(resolve) {
					require.async(['js/modules/tkBook/tkScreen.js'], resolve);
				},
				meta: {
					keepAlive: false
				}
			},
			//违背原因页面
			{
				path: '/tkViolateItem',
				component: function(resolve) {
					require.async(['js/modules/tkBook/tkViolateItem.js'], resolve);
				},
				meta: {
					keepAlive: false
				}
			},
			//订单填写页面
			{
				path: '/tkOrderEdit',
				component: function(resolve) {
					require.async(['js/modules/tkBook/tkOrderEdit.js'], resolve);
				},
				meta: {
					keepAlive: true
				}
			},
			//订单完成页面
			{
				path: '/tkBookcmp',
				component: function(resolve) {
					require.async(['js/modules/tkBook/tkBookcmp.js'], resolve);
				},
				meta: {
					keepAlive: false
				}
			},
			//订单详情页面
			{
				path: '/tkOrderDetails',
				component: function(resolve) {
					require.async(['js/modules/tkBook/tkOrderDetails.js'], resolve);
				},
				meta: {
					keepAlive: false
				}
			},
			//出行人
			{
				path: '/cxr',
				component: function(resolve) {
					require.async(['js/modules/control/cxr.js'], resolve);
				},
				meta: {
					keepAlive: false
				}
			},
			//城市
			{
				path: '/city',
				component: function(resolve) {
					require.async(['js/modules/control/city.js'], resolve);
				},
				meta: {
					keepAlive: false
				}
			},
			//日期
			{
				path: '/date',
				component: function(resolve) {
					require.async(['js/modules/control/date.js'], resolve);
				},
				meta: {
					keepAlive: true
				}
			},
			//新增乘机人
			{
				path: '/addContacts',
				component: function(resolve) {
					require.async(['js/modules/tkBook/addContacts.js'], resolve);
				},
				meta: {
					keepAlive: true
				}
			},

			{
				path: '/yjIndexedList',
				component: function(resolve) {
					require.async(['js/modules/control/yjIndexedList.js'], resolve);
				},
				meta: {
					keepAlive: false
				}
			},
		]
	});

	var app = new Vue({
		router: router
	}).$mount('#app');

	router.goPath = function(path) {
		window.location.hash = "#" + path;
	};
	Vue.router = router;
});