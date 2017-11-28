define(function(require, exports, module) {
			var common = require("common");
			var $conn = require("$conn");
			var citys = require("templates/control/city.html");
			require('css/control/city.css');
			require('js/plugin/mui.indexedlist.js');

			var city = Vue.extend({
					template: citys,
					data: function() {
						return {
							"city": [],
							"hotcity": [],
							"userUrl": "",
							"ss": ""
						}
					},

					created: function() {
						mui.init();
//						var aircityurl = $conn.getConn("city.aircityurl");
//						aircityurl("",function(res){
//							console.log(res.data);
//							},function(){
//								
//							}
//							
//						)
						var cityurl = $conn.getConn("city.cityurl");
						var self = this;
						cityurl("", function(response) {
							self.hotcity.push(response.data.HOT);
							delete response.data['HOT'];
							self.city.push(response.data);
							self.city = self.city[0];
							common.sessionset('city',self.city);
						}, function() {});

						this.getUrlData();

					},
					mounted: function() {
						mui.ready(function() {
							var header = document.querySelector('header.mui-bar');
							var list = document.getElementById('list');
							//calc hieght
							list.style.height = (document.body.offsetHeight - header.offsetHeight) + 'px';
							//create
							window.indexedList = new mui.IndexedList(list);
							mui("#list").indexedList().findElements();
						});
					},
					activated: function() {
						mui.init();

					},
					methods: {
						getUrlData: function() {
							var type = this.$route.query.type;
							if(type != undefined) {
								this.userUrl = type;
							} else {
								this.userUrl = ''
							}

						},
						getszm: function(cname, szm) {
							if(this.userUrl != '') {
								if(this.$route.query.city == 1) {
									Vue.router.goPath('/' + this.userUrl + '?cname=' + cname + '&szm=' + szm);
								} else {
									Vue.router.goPath('/' + this.userUrl + '?cname2=' + cname + '&szm=' + szm);
								}
							} else {
								if(this.$route.query.city == 1) {
									Vue.router.goPath('/tkQuery?cname=' + cname + '&szm=' + szm);
								} else {
									Vue.router.goPath('/tkQuery?cname2=' + cname + '&szm=' + szm);
								}
							}
						},
						search: function(news) {
							var newArr = [];
							var arr=[];
							this.city=common.sessionget('city');
							var self=this;
							
							news = news.trim().toUpperCase();
//							var inputsmall = this.cityInput.trim().toLowerCase();
							if(news != '') {
								for(var key in self.city) {
									for(var i = 0; i < self.city[key].length; i++) {
										var objItem = self.city[key][i];
										if(objItem['pyjsm'].search(news) > -1||objItem['threeCode'].search(news) > -1||objItem['cityName'].search(news) > -1||objItem['fullspell'].search(news) > -1) {
											newArr.push(self.city[key][i]);
										}
									}
									arr.push({key:newArr});
									console.log(key);
								};
							}
						}
					},
					watch: {
							ss: function(news,old) {
								console.log(news,old)
								if(!news){
									Vue.set(this,'city',common.sessionget('city'))
									
									return false;}
								if(news!=old){
//									this.city=common.sessionget('city');
									Vue.set(this,'city',common.sessionget('city'))
								}
								this.search(news);
							}
						}
					});

				module.exports = city;
			});