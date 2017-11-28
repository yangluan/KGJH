/**
 * Created by Best_An_An on 2017/8/17.
 */
//送审成功页面
define(function (require,exports,module) {
    var common = require("common");
    var $conn  = require("$conn");
    var subSuccess = require("templates/application/subSuccess.html");
    require('css/application/subSuccess.css');
    // require('./setRem.js');
    var subSuccess = Vue.extend({
        template: subSuccess,
        data:function(){
            return {
                orderId:'',
                ccsqdNo:'',//出差申请单单号
                mdd:'',//目的地
                projectName:'',//出差项目名称
                dateBegin:'',//出差日始
                dateEnd:'',//出差日止
                ccr:'',//出行人
                ccsy:'',//出差事由
                zys:'',//总预算
                zsys:'',//住宿预算
                qtys:'',//其他预算
                jtys:'',//交通预算
                sxr:'',//随行人
                orderType:'',
                spgzId:'',
            }
        },
        activated:function () {
            this.ccsqdSuccess()
        },
        created:function(){

        },//created --END--
        methods:{
            //费用明细
            feiYongMingX:function () {
                mui.alert('住宿预算：'+this.zsys+'元       交通预算：'+this.jtys+'元        其他预算：'+this.qtys)
            },
            //    返回首页
            ReturnSuperior:function () {
                Vue.router.goPath('/home');
            },
            //出差申请单提交成功
            ccsqdSuccess:function () {
                this.orderId = this.$route.query.orderId;
                var queryString = {ccsqdId:this.orderId};
                    $conn.getConn("Approval.ccsqdSubSuccess")(queryString,function(resp){
                        // say(resp.data);
                        // common.sessionset('SubSuccessData',resp.data);
                        console.log(resp.data);
                        this.ccsqdNo=resp.data.ccsqdNo;
                        this.mdd=resp.data.mdd;
                        this.sxr=resp.data.sxr;
                        this.projectName=resp.data.projectName;
                        console.log(resp.data.projectName);
                        this.dateBegin=resp.data.dateBegin;
                        this.dateEnd=resp.data.dateEnd;
                        this.ccr=resp.data.ccr;
                        this.ccsy=resp.data.ccsy;
                        this.jtys=resp.data.jtys;
                        this.qtys=resp.data.qtys;
                        this.zsys=resp.data.zsys;
                        this.zys=this.jtys*1+this.qtys*1+this.zsys*1;
                    }.bind(this))
            },
            //查看详情
            getSendRule: function() {
                    Vue.router.goPath('/DetailsApplications?orderId='+this.orderId);
            },

            //    查看详情  DetailsApplications
            goDetailsApplications:function () {
                this.getSendRule()
            },
        },
        watch:{

        },


    });


    module.exports = subSuccess;
});