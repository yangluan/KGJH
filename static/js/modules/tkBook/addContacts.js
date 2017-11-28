define(function (require,exports,module) {
    var common = require("common");
    var $conn  = require("$conn");
    var addContactss = require("templates/tkBook/addContacts.html");

    var addContacts = Vue.extend({
        template: addContactss,
        data:function(){
        	return {
				"name":"",
				"idCard":1,
				"tel":"",
				"selected":false,
				"xcJSel":false,
				"idNumber":"",
				"crselected":true,
				"rtselected":false,
				"addxjr":""
        	}
        },
        created:function(){
			if(this.$route.query.addxjr==0){
				this.addxjr="新增乘机人";
			}
			if(this.$route.query.addxjr==1){
				this.addxjr="修改乘机人";
				var tkcxrlist=common.sessionget('tkcxrlist');
				for(var i=0;i<tkcxrlist.length;i++){
					if(tkcxrlist[i].empId==this.$route.query.id){						
						console.log(tkcxrlist);
						this.name=tkcxrlist[i].empName;
						this.idNumber=tkcxrlist[i].idNumber;
						this.tel=tkcxrlist[i].phoneNumber;
					}
				}
			}
		},//created --END--
        methods:{
		
			//添加联系人
			addLinker:function(){
				if(!this.name){tips('请输入姓名');return false;}
	      		if(!this.idCard){tips('请选择乘客类型');return false;}
	      		if(!this.idNumber){tips('请输入证件号码');return false;}
				var queryString={
					"name":this.name,
					"idCard":this.idCard,
					"idNumber":this.idNumber,
					"tel":this.tel
				}
				common.sessionset('addcjr',queryString);
				Vue.router.goPath("/addContacts");
			},
			getUrlData:function(){
			    var type = this.$route.query.type;
			    if(type!=undefined){
			    	this.userUrl = type;
			    }else{
			    	this.userUrl=''
			    }
			    
			},
			selcted:function(n){
				(n==1)&&(this.idCard=1);
				(n==2)&&(this.idCard=2);
			},
			back:function(){
				mui.back();
			},
      	},
      	watch:{

       	},
       	activated:function(){
    
			
       }

    });


    module.exports = addContacts;
});
