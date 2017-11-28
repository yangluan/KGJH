define(function(require, exports, module) {
	//大小写一致
	var addCommonAddress = require("templates/home/addCommonAddress.html");
	var common = require("common");
	var $conn = require("$conn");
	require("css/home/addCommonAddress.css");
	var VueComponent = Vue.extend({
		template: addCommonAddress,
		data: function() {  
			return {
				recipient: '', //收件人
				phoneNumber: '', //手机号
				addr: '', //详细地址
				post: '', //邮编
				isDefault: '0', //是否默认为常用地址
				province: '',//省
				provinceName : '',//省份名字
				city: '',//市
				cityName : '',//市名字
				empAddrId : ''//常用地址id
			};
		},
		created: function() {
			if(this.$route.query){
				this.recipient = this.$route.query.recipient;
				this.phoneNumber = this.$route.query.phoneNumber;
				this.addr = this.$route.query.addr;
				this.post = this.$route.query.post;
				this.isDefault = this.$route.query.isDefault;
				this.province = this.$route.query.province;
				this.provinceName = this.$route.query.cName;
				this.city = this.$route.query.city;
				this.cityName = this.$route.query.cityName;
				this.empAddrId = this.$route.query.empAddrId;
			}
		},
		mounted:function(){


		},
		methods: {
			//保存常用地址
			saveCommonInfo: function() {
				var reg = /^1[0-9]{10}$/,
				flag = reg.test(this.phoneNumber);
				if(!flag){
					mui.alert("请输入正确的手机号")
				}else{
					var queryString = {
						recipient: this.recipient, //收件人
						phoneNumber: this.phoneNumber, //手机号
						addr: this.addr, //详细地址
						post: this.post, //邮编
						isDefault: this.isDefault,//是否默认
						province: this.province,//省
						city: this.city,//市
					};
					if(this.empAddrId){
						queryString.empAddrId =this.empAddrId;
					}
					$conn.getConn("user.vipEmpAddrEdit")(queryString,function(resq) {
						mui.alert("保存成功");
//						say(resq.data);
						Vue.router.goPath("/commonInfo?active=1");	
					}.bind(this));
				}
				
			},//二级联动城市
			showCity :function(){
				var picker = new mui.PopPicker({
				    layer: 2
				});
				//如果缓存没有值
				if(!common.localget('provinceArray')){
					$conn.getConn("city.proCity")('',function(resq) {
	//					console.log(resq.data);
						var province =resq.data.province;//获取省份
	//					console.log(province['00002']);
						var city = resq.data.city;//获取城市
						var provinceArray = [];
						//遍历省份和城市
						for(var p in province['00002']){
							var _province ={};
							_province.value = province['00002'][p].id;
							_province.text = province['00002'][p].cName;
							var cityArray = [];
							for(var c in city[_province.value]){
								var _city ={};
								_city.value = city[_province.value][c].id;
								_city.text = city[_province.value][c].cityName;
								cityArray.push(_city);
							}
							_province.children = cityArray;
							provinceArray.push(_province);
						}
						//将数据存到localStorage缓存里
						common.localset('provinceArray',provinceArray);
	//					console.log(common.localget('provinceArray'));
						 picker.setData(provinceArray);
					}.bind(this));
				}else{
					var provinceArray =common.localget('provinceArray')
					picker.setData(provinceArray);
				}
				picker.pickers[0].setSelectedIndex(0);
				picker.pickers[1].setSelectedIndex(0);
				picker.show(function(SelectedItem) {
					this.provinceName = picker.getSelectedItems()[0].text;
					this.province = picker.getSelectedItems()[0].value;
					this.city = picker.getSelectedItems()[1].value;
					this.cityName = picker.getSelectedItems()[1].text;
				}.bind(this))
			},
			//默认值处理
			defSwt : function(){
				if(this.isDefault =='0'){
					this.isDefault = '1';
				}else{
					this.isDefault = '0';
				}
			},
			//跳转到常用信息列表
			toCommonInfo :function(){
				Vue.router.goPath("/commonInfo?active=1");	
			}
		}
	});

	module.exports = VueComponent;
});