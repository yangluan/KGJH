/**
 * Created by Best_An_An on 2017/8/11.
 */
//项目选择
define(function (require,exports,module) {
    var common = require("common");
    var $conn  = require("$conn");
    var applicationProjectSelection = require("../../../templates/application/applicationProjectSelection.html");
    require('../../../css/application/applicationProjectSelection.css');
    // require('./setRem.js');
    var applicationProjectSelection = Vue.extend({
        template: applicationProjectSelection,
        data: function(){
            return {
                userUrl:'/application',
                choiceProject:[],
                isShow:true,//
                searchXm:'',//查找的值
                arr:[],//找到的值
            }
        },
        created:function(){
            this.projectSelection()
        },
        methods:{
            //    返回上级页面
            ReturnSuperior:function () {
                Vue.router.goPath(this.userUrl)
            },
            //获取项目
            projectSelection:function () {
                var queryString = {count:999,keywords:'',pageNum:1,status:''};
                $conn.getConn("Approval.projectSelection")(queryString,function(resp){
                    say(resp.data);
                    this.choiceProject=resp.data.list;
                    console.log(this.choiceProject);
                }.bind(this));
            },
            //选中后回显
            goSuperior:function (i,index) {
                var inputRadio = document.getElementsByName('contentSub');
                for (var a in inputRadio) {
                    if (inputRadio[a].checked) {
                        console.log(i);
                        common.sessionset('xzxmList',i)
                    }
                }
                common.sessionset('xzxmList',i);
                Vue.router.goPath(this.userUrl)
            },
        },

        watch:{
            searchXm:function (){
                var len = this.choiceProject,arr=[];
                for(var i = 0;i < len.length;i++){
                    if(len[i].projectName.indexOf(this.searchXm)>=0||len[i].projectCode.indexOf(this.searchXm)>=0){
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

    module.exports = applicationProjectSelection;
});