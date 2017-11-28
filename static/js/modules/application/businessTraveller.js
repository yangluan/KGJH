/**
 * Created by Best_An_An on 2017/8/17.
 */
//businessTraveller  出行人
define(function (require,exports,module) {
    var common = require("common");
    var $conn  = require("$conn");
    var businessTraveller = require("templates/application/businessTraveller.html");

    require('css/application/businessTraveller.css');

    var empInfo=common.getUserInfo().empInfo;
    function initCheckbox(arr){
        arr.forEach(function(item){
            item.checked=false;
        })
    }
    var businessTraveller = Vue.extend({
        template: businessTraveller,
        data:function(){
            return {
                "isYs":true,//是否因私
                "outerSize":true,//为外来人员
                colleague:[],//同事
                "linker":[],//常用联系人
                "cxrlist":[]
            }
        },
        created:function(){
            var empFindList=$conn.getConn('tkQuery.empFindList');
            empFindList('?count=9999&pageNum=1',function(res){
                this.colleague=res.data.list;
                // initCheckbox(res.data.list);
                console.log(this.colleague)
            },function(res){
                common.tips(res.errMsg);
            })
        },//created --END--
        methods:{
            //选中出行人
            // selectCxr:function (checked,id) {
            //     if(!checked){
            //
            //     }
            // },



            //选中出行人
            selectCxr:function(checked,id){
                if(!checked){
                    for(var i=0;i<this.colleague.length;i++){debugger
                        this.colleague[i].empId==id&&this.cxrlist.push(this.colleague[i]);
                        common.localset('tkcxrlist',this.cxrlist);
                        debugger
                        console.log(this.cxrlist)
                    }
                }else{debugger
                    for(var i=0;i<this.cxrlist.length;i++){
                        if(this.cxrlist[i].empId==id){
                            this.cxrlist.splice(i,1)};
                        debugger
                        console.log(this.cxrlist);
                        common.localset('tkcxrlist',this.cxrlist);
                        debugger
                    }
                }
                common.localset('tkcxrlist',this.cxrlist);
                Vue.router.goPath('/application')
            },

            //完成
            // complete:function(){
            //     common.sessionset('tkcxrlist',this.cxrlist);
            //     Vue.router.goPath("/application");
            // },
            //添加联系人
            addLinker:function(){
                common.tips('还没写 .....');
            },
        },
        watch:{

        },
        activated:function(){
            if(this.$route.query.isYs){

            }
            if(!this.$route.query.outerSize){
//     			this.outerSize=false;
            }
//			common.sessionremove('tkcxrlist');
            var self=this;
            //同事
            var empFindList=$conn.getConn('tkQuery.empFindList');
            empFindList('?count=9999&pageNum=1',function(res){
                self.colleague=res.data.list;
                initCheckbox(res.data.list);
            },function(res){
                common.tips(res.errMsg);
            })

            //常用联系人
            var vipEmpContactsGetList=$conn.getConn('user.vipEmpContactsGetList');
            vipEmpContactsGetList('?contactsId='+empInfo.empId,function(res){
                self.linker=res.data;
                initCheckbox(res.data);
            },function(res){
                common.tips(res.errMsg);
            });

        }

    });


    module.exports = businessTraveller;
});