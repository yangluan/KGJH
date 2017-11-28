/**
 * Created by Best_An_An on 2017/8/11.
 */
//成本中心
define(function (require,exports,module) {
    var common = require("common");
    var $conn  = require("$conn");
    var costCenter = require("../../../templates/costCenter/costCenter.html");
    require('../../../css/costCenter/costCenter.css');
    // require('./setRem.js');
    var costCenter = Vue.extend({
        template: costCenter,
        data: function(){
            return {
                cbzxData: [],
                userUrl:'/application',
                isShow:true,//
                searchXm:'',//查找的值
                arr:[],//找到的值
            }
        },
        created:function(){
            this.getFindList()
        },
        activated:function () {
            this.getFindList();
        },
        methods:{
            //search输入框focus事件
            focus:function () {
                var searchInp = document.getElementById('searchIpt'),jiaData = document.getElementById('jiaData');
                if(searchInp.value){
                    jiaData.style.display='none';
                }
            },
            //请求接口 成本中心列表
            getFindList:function () {
                var recepitionParameter = common.sessionget('cbzxParameter');
                var recepitionParameter1 = common.sessionget('cbzxParameter1');
                console.log(recepitionParameter);
                console.log(recepitionParameter1);
                var queryString = {projectId:recepitionParameter,travelEmpId:recepitionParameter1,txEmpIds:''};
                $conn.getConn("Approval.costCenterFindList")(queryString,function(resp){
                    say(resp.data);
                    this.cbzxData=resp.data.list;
                    console.log(this.cbzxData)
                }.bind(this))
            },
            //单选获取其他元素的值 传入sessionStorage cbzxName
            radioClick:function (i,index) {
                var inputRadio = document.getElementsByName('contentSub');
                for (var a in inputRadio) {
                    if (inputRadio[a].checked) {
                        console.log(i);
                        common.sessionset('cbzxList',i)
                    }
                }
                Vue.router.goPath(this.userUrl)
            },
            //    返回上级页面
            ReturnSuperior:function () {
                Vue.router.goPath(this.userUrl)
            }
        },
        computed:{},
        watch:{
            searchXm:function (){
                var len = this.cbzxData,arr=[];
                for(var i = 0;i < len.length;i++){
                    if(len[i].costCenterName.indexOf(this.searchXm)>=0||len[i].costCenterCode.indexOf(this.searchXm)>=0){
                        arr.push(len[i])
                    }
                }
                this.arr=arr;
                this.isShow=!this.isShow;
                console.log(this.arr);
                return this.arr;
            }
        },
    });
    module.exports = costCenter;
});
