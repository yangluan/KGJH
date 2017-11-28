/**
 * Created by Best_An_An on 2017/8/26.
 */
define(function (require,exports,module) {
    var common = require("common");
    var $conn  = require("$conn");
    var applicationColleague = require("templates/control/cxr.html");

    require('css/control/cxr.css');

    var empInfo=common.getUserInfo().empInfo;
    function initCheckbox(arr){
        arr.forEach(function(item){
            item.checked=false;
        })
    }
    var applicationColleague = Vue.extend({
        template: applicationColleague,
        data:function(){
            return {
                "isYs":"",//是否因私
                "outerSize":"",//为外来人员
                "colleague":[],//同事
                "linker":[],//常用联系人
                "cxrlist":[],
                "userUrl":"",
                "ts":true,
                "searchcxr":"",//检索值
                "enames":[],//姓名
                "isempty":false//出行人 是否为空
            }
        },
        mounted:function(){
        },
        created:function(){

            this.getUrlData();
            var tkQStatus=common.sessionget('tkQStatus');
            var tkSearchInfo=common.sessionget('tkSearchInfo');
            if(tkQStatus==2){
                this.isYs=true;
            }else{
                this.isYs=false;
            }

            if(this.$route.query.bookStyle==2&&this.$route.query.appBook==1||this.$route.query.bookStyle==1){
                if(this.$route.query.wlcor=='true'){
                    this.outerSize=true;
                }else{
                    this.outerSize=false;
                }
            }
            if(this.$route.query.bookStyle==2&&this.$route.query.appBook!=1){
                this.ts=false;
                this.outerSize=false;
            }
            var self=this;
            var c=common.sessionget('tkcxrlist');
            //同事
            if(c&&c!='[]'&&this.$route.query.type||c&&c!='[]'&&this.$route.query.showXc=='true'){
                self.colleague=c;
            }
            else{
                var empFindList=$conn.getConn('tkQuery.empFindList');
                empFindList('?count=9999&pageNum=1',function(res){
                    self.colleague=res.data.list;
                    initCheckbox(res.data.list);
                },function(res){
                    common.tips(res.errMsg);
                })
            }

            //常用联系人
            var vipEmpContactsGetList=$conn.getConn('user.vipEmpContactsGetList');
            vipEmpContactsGetList('?contactsId='+empInfo.empId,function(res){
                self.linker=res.data;
                initCheckbox(res.data);
            },function(res){
                common.tips(res.errMsg);
            });

        },//created --END--
        methods:{
            //选中出行人
            selectCxr:function(checked,id){
                console.log(checked);
//				if(this.$route.query.showXc=='true'){
                if(checked){
                    for(var i=0;i<this.colleague.length;i++){
                        (this.colleague[i].empId==id)&&(this.colleague[i].checked=true)&&(this.enames.push(this.colleague[i].empName));
                    }
                    this.isempty=true;


                    var CXR = this.$route.query.number;
                    if(CXR==1){
                        common.sessionset('tkcxrlist1',this.colleague);
                    }else if(CXR==2){
                        common.sessionset('tkcxrlist2',this.colleague);
                    }else if(CXR==3){
                        common.sessionset('tkcxrlist3',this.colleague);
                    }


                    // common.sessionset('tkcxrlist1',this.colleague);
                }else{
                    for(var i=0;i<this.colleague.length;i++){
                        if(this.colleague[i].empId==id||this.colleague[i].empName==id){
                            this.colleague[i].checked=false;
                            var ind=this.enames.indexOf(this.colleague[i].empName);
                            ind>-1&&this.enames.splice(ind,1);
                        }
                    }
                    var CXR = this.$route.query.number;
                    if(CXR==1){
                        common.sessionset('tkcxrlist1',this.colleague);
                    }else if(CXR==2){
                        common.sessionset('tkcxrlist2',this.colleague);
                    }else if(CXR==3){
                        common.sessionset('tkcxrlist3',this.colleague);
                    }
                }
            },
            //完成
            complete:function(){
                var CXR = this.$route.query.number;
                if(CXR==1){
                    Vue.router.goPath('/application');
                }else if(CXR==2){
                    Vue.router.goPath('/application');
                }else if(CXR==3){
                    Vue.router.goPath('/applicationTravelPlan');
                }
                // if(this.userUrl!= ''){
                //     Vue.router.goPath('/'+this.userUrl);
                // }else{
                //     Vue.router.goPath("/application?isYs="+this.isYs);
                // }
            },
            //添加联系人
            addLinker:function(){
                Vue.router.goPath("/addCommonContacts?type=cxr");
            },
            back:function(){
                if(this.userUrl!= ''){
                    Vue.router.goPath('/'+this.userUrl);
                }else{
                    Vue.router.goPath('/application');
                }
            },
            getUrlData:function(){
                var type = this.$route.query.type;
                if(type!=undefined){
                    this.userUrl = type;
                }else{
                    this.userUrl=''
                }
            },
            splicecxr:function(ename){
                this.selectCxr(false,ename);
            }
        },
        watch:{
            searchcxr:function(){
                if(this.searchcxr){
                    this.searchcxr=this.searchcxr.toUpperCase();
                    var arr=[];
                    for	(var i=0;i<this.colleague.length;i++){
                        if(this.colleague[i].empName.indexOf(this.searchcxr)>-1||this.colleague[i].empNo.indexOf(this.searchcxr)>-1||this.colleague[i].phoneNumber.indexOf(this.searchcxr)>-1){
                            arr.push(this.colleague[i]);
                        }
                    }
                    Vue.set(this,'colleague',arr);
                }else{
                    var self=this;
                    var c=common.sessionget('tkcxrlist1');
                    //同事
                    if(c&&c!='[]'&&this.$route.query.type||c&&c!='[]'&&this.$route.query.showXc=='true'){
                        self.colleague=c;
                    }
                    else{
                        var empFindList=$conn.getConn('tkQuery.empFindList');
                        empFindList('?count=9999&pageNum=1',function(res){
                            self.colleague=res.data.list;
                            initCheckbox(res.data.list);
                        },function(res){
                            common.tips(res.errMsg);
                        })
                    }
                }
            }
        },
        activated:function(){


        }

    });


    module.exports = applicationColleague;
});
