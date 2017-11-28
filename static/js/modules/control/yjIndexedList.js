/**
 *  作者:魏麒
 *  时间 2017年8月25日21:25:00
 * 
 *  索引检索公共控件
 *  可传参数(String)
 *  urlPath;//返回路径  必传
 *  pathType;//请求类型 必传  1=>A-Z机场数据    2=>A-Z国家 
 *  showName;//页面展示名称  可选 
 *	showName1;//页面展示名称1 可选 
 *	backTab;//返回标记 可选
 * 
 *  使用方式:
 *  <router-link :to="{path:'/yjIndexedList',query:{urlPath : '/userInfo',pathType :1,showName : '' ,showName1 :'',backTab :''}}">
 *  </router-link>
 * 
 *  获取值的方式:
 *  common.sessionget("yjIndexedList");//存储数据
 * 
 *  注意: 
 *  1.其中backTab是由页面传过来的,可以做特殊业务处理
 *  2.页面取完值建议使用common.sessionremove("yjIndexedList")将数据清掉，防止其他页面使用时串数据
 */
define(function(require, exports, module) {
			var common = require("common");
			var $conn = require("$conn");
			require('css/mui.indexedlist.css');//mui筛选的js
			require('js/plugin/mui.indexedlist.js');//mui筛选的js
			var yjIndexedList = require("templates/control/yjIndexedList.html");//公共的筛选页面
			
		var yjIndexedListVue = Vue.extend({
			template: yjIndexedList,
			data: function() {
				return {
					urlPath : '',//返回路由
					pathType :'',//请求类型
					showName : '',//页面展示名称
					showName1 : '',//页面展示名称1
					dataList : '',//A-Z内容快
					rmList :'',//热门城市块
					dataTable : [
						'data-value','data-tags','data-1','data-2','data-3','data-4','data-5','data-6','data-7'
					],//这个是控制检索的条件
					backDataLsit :[],//存需要返回的对象集合,返回其中一个
					backTab : ''//返回标记,同一个页面使用可以用作返回的判断
				}
			},
			created:function(){
				this.urlPath   = this.$route.query.urlPath;//返回路径
				this.pathType = this.$route.query.pathType;//请求类型
				this.showName  = this.$route.query.showName;//页面展示名称
				this.showName1 = this.$route.query.showName1;//页面展示名称1
				this.backTab = this.$route.query.backTab;//返回标记
				this.dataList = '';//初始化前先清空展示的li数据
				this.backDataLsit =[];//初始化的时候清空这个数据
				if(this.pathType == 1){//cityAirport
					if(!this.showName){
						this.showName = 'airportName';
						this.showName1 = 'cityName';
					}
					this.rmListFor();
					this.cityAirportList();
					
				}else if(this.pathType == 2 ){//azCountryForPx
					if(!this.showName && !this.showName1){
						this.showName = 'cName';
					}
					this.azCountryForPxList();
				}
			},
			mounted : function(){
				mui('.mui-input-row input').input(); 
			},
			methods :{
				//机场--城市 
				cityAirportList : function(){
					var self = this;
					var cityAirportForPx = $conn.getConn("city.cityAirportForPx");
					//获取机场城市数据
					cityAirportForPx('',function(resp){
						this.dataFor(resp.data);
						Vue.nextTick(function () {
							var list = common.query('#list');//获取数据的dom
							list.style.height = document.body.offsetHeight +'px';
							window.indexedList = new mui.IndexedList(list);//初始化控件
							//绑定事件
							var lis = document.getElementsByClassName("_selcetObj");
							for(var i = 0;i<lis.length;i++){
								lis[i].onclick = function(){
									var _index = this.getAttribute('selcetObjIdx');//获取数据的下标
									backDate ={};
									backDate.backTab = self.backTab;//返回标记
									backDate.threeCode = self.backDataLsit[_index].threeCode || '';//三字码
									backDate.airportName = self.backDataLsit[_index].airportName || '';//机场名称
									backDate.cityName = self.backDataLsit[_index].cityName || '';//城市名称
									common.sessionset("yjIndexedList",backDate);//存储数据
									Vue.router.goPath(self.urlPath);//跳转
								}
							}
						});
					}.bind(this));
				},
				//A-Z国家
				azCountryForPxList : function(){
					var self = this;
					var azCountryForPx = $conn.getConn("city.azCountryForPx");
					azCountryForPx('',function(resp){
						this.dataFor(resp.data);
						Vue.nextTick(function () {
							var list = common.query('#list');//获取数据的dom
							list.style.height = document.body.offsetHeight +'px';
							window.indexedList = new mui.IndexedList(list);//初始化控件
							//绑定事件
							var lis = document.getElementsByClassName("_selcetObj");
							for(var i = 0;i<lis.length;i++){
								lis[i].onclick = function(){
									var _index = this.getAttribute('selcetObjIdx');//获取数据的下标
									var backDate = self.backDataLsit[_index];//返回数据
									backDate.backTab = self.backTab;//返回值
									common.sessionset("yjIndexedList",backDate);//存储数据
									Vue.router.goPath(self.urlPath);//跳转
								}
							}
						});
					}.bind(this));
				},
				//热门城市 
				rmListFor : function(){
					var self = this;
					var cityurl = $conn.getConn("city.cityurl");
					cityurl('',function(resp){
						//比那里展示热门城市
						for(var h in resp.data.HOT){
							self.rmList += '<span class=\"mui-col-xs-4 hot_class _selectRm\" selectRm="'+h+'" ><span>'+resp.data.HOT[h].cityName+'</span></span>';
						}
						Vue.nextTick(function () {
							//绑定点击事件
							var lis = document.getElementsByClassName("_selectRm");
							for(var i = 0;i<lis.length;i++){
								lis[i].onclick = function(e){
									var index =  this.getAttribute('selectRm');
									backDate ={};
									backDate.threeCode = resp.data.HOT[index].threeCode || '';//三字码
									backDate.airportName = resp.data.HOT[index].airportName || '';//机场名称
									backDate.cityName = resp.data.HOT[index].cityName || '';//城市名称
									backDate.backTab = self.backTab;//返回值
									common.sessionset("yjIndexedList",backDate);//存储数据
									Vue.router.goPath(self.urlPath);//跳转
								}
							}
						});
					}.bind(this));
				},
				//循环数据
				dataFor : function(e){
					var that = this;//获取作用域在vue上
					var data = '<li data-group="热" class="mui-table-view-divider mui-indexed-list-group">热门城市</li><li><div class="mui-row padR23 padT6" v-html="rmList">'+this.rmList+'</div></li>';
					var sum = 0; //存返回值的索引
					for(var r in e){
						//循环分组
						//分租的样式
						data += "<li data-group='"+r+"' class='mui-table-view-divider mui-indexed-list-group' >"+r+"</li>";
//							console.log(e[r]);
						//循环分组中的对象
						for(var t in e[r]){
							//如果是ud或者是空对象则不操作
//								say(resp.data[r][t]);
							var obj = e[r][t];
							var count = 0;//属性指针,取检索值的
							//开始拼接数据
							data += "<li "
							for(var o in obj){//循环对象中的属性
								if(this.dataTable.length == count){
								  break;
								}
								data += " "+ this.dataTable[count] + "='"+obj[o]+"' "
								count ++;
							}
							//存储返回list和list索引
							this.backDataLsit.push(obj);
							sum = this.backDataLsit.length-1;
							//内容的样式

							data += "class='mui-table-view-cell mui-indexed-list-item _selcetObj' selcetObjIdx='"+sum+"' >";
							if(this.showName && this.showName1){
								data += obj[this.showName1] +"<span class='right gray'>"+obj[this.showName]+'</span>'; //展示的值
							}else if(this.showName){
								data += obj[this.showName]; 
							}else if (this.showName1){
								data += obj[this.showName1]; 
							}else {
								data += obj[0]; //展示默认的
							}
							data += "</li>";
						}
						
					}
//						console.log(data);
					this.dataList = data;
				},
				back:function(){
					mui.back();
				},
			}
		});
	module.exports = yjIndexedListVue;
});