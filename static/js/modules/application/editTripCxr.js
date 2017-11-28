/**
 * Created by Best_An_An on 2017/8/17.
 */
//编辑行程页同行人员
define(function (require,exports,module) {
    var common = require("common");
    var $conn  = require("$conn");
    var Colleague = require("templates/application/Colleague.html");

    require('css/application/Colleague.css');

    var empInfo=common.getUserInfo().empInfo;
    function initCheckbox(arr){
        arr.forEach(function(item){
            item.checked=false;
        })
    }
    var Colleague = Vue.extend({
        template: Colleague,
        data:function(){
            return {
                "isYs":true,//是否因私
                "outerSize":true,//为外来人员
                "colleague":[],//同事
                "linker":[],//常用联系人
                "cxrlist1":[]
            }
        },
        created:function(){
            var self=this;

            var empFindList=$conn.getConn('tkQuery.empFindList');
            empFindList('?count=9999&pageNum=1',function(res){
                self.colleague=res.data.list;
                initCheckbox(res.data.list);
            },function(res){
                common.tips(res.errMsg);
            })
        },//created --END--
        methods:{
            //选中出行人
            selectCxr:function(checked,id){
                if(!checked){
                    for(var i=0;i<this.colleague.length;i++){
                        this.colleague[i].empId==id&&this.cxrlist1.push(this.colleague[i]);
                        common.sessionset('tkcxrlist2',this.cxrlist1);
                    }
                }else{
                    for(var i=0;i<this.cxrlist1.length;i++){
                        if(this.cxrlist1[i].empId==id){
                            this.cxrlist1.splice(i,1)};
                    }
                    common.sessionset('tkcxrlist2',this.cxrlist1);
                }

            },
            //完成
            complete:function(){
                common.sessionset('tkcxrlist2',this.cxrlist1);
                Vue.router.goPath("/applicationTravelPlan");
            },
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


    module.exports = Colleague;
});
