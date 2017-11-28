/**
 * Created by Best_An_An on 2017/8/17.
 */
//审批规则
define(function (require,exports,module) {
    var common = require("common");
    var $conn  = require("$conn");
    var applicationApproval = require("templates/application/applicationApproval.html");
    require('css/application/applicationApproval.css');
    var applicationApproval = Vue.extend({
        template: applicationApproval,
        data:function(){
            return {
                userUrl:'/application',
                spcgList:[],
                isShow:true,//
                searchXm:'',//查找的值
                arr:[],//找到的值
            }
        },
        created:function(){
            this.projectSelection()
        },//created --END--
        methods:{
            //    返回上级页面
            ReturnSuperior:function () {
                Vue.router.goPath(this.userUrl)
            },
            //获取审批规则列表
            projectSelection:function () {
                var queryString = {orderId:'7f3fe73c92f8781c6b40879304c1d9cd'};
                $conn.getConn("Approval.spgzList")(queryString,function(resp){
                    // say(resp.data);
                    this.spcgList=resp.data;
                    console.log(this.spcgList)
                }.bind(this));
            },
            //选中后回显
            goSuperior:function (i,index) {
                var inputRadio = document.getElementsByName('contentSub');
                for (var a in inputRadio) {
                    if (inputRadio[a].checked) {
                        common.sessionset('spgzList',i)
                    }
                }
                common.sessionset('spgzList',i);
                Vue.router.goPath(this.userUrl)
            },
        },
        watch:{
            searchXm:function (){
                var len = this.spcgList,arr=[];
                for(var i = 0;i < len.length;i++){
                    if(len[i].gzmc.indexOf(this.searchXm)>=0||len[i].gzdm.indexOf(this.searchXm)>=0){
                        arr.push(len[i])
                    }
                }
                this.arr=arr;
                this.isShow=!this.isShow;
                console.log(this.arr);
                return this.arr;
            }
        }


    });


    module.exports = applicationApproval;
});