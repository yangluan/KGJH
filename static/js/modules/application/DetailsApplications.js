/**
 * Created by Best_An_An on 2017/8/22.
 */
//DetailsApplications  出差申请单详情
define(function (require,exports,module) {
    var common = require("common");
    var $conn  = require("$conn");
    var DetailsApplications = require("templates/application/DetailsApplications.html");
    require('css/application/DetailsApplications.css');
    // require('./setRem.js');

    var DetailsApplications = Vue.extend({
        template: DetailsApplications,
        data:function(){
            return {
                orderId:'',//
                allData:{},//
                zys:'',//原总预算
                allRouteList:[],//
                dep:'',//出发城市
                arr:'',//到达城市


                date1:'',//出发时间始
                date2:'',//出发时间止
                changeNo:'',//变更单号
                changeZt:'',//审批状态
                status:'',//审批进度

                personList:[],//出行人集合
                sxr:'',//随行人
                costCenterName:'',//成本中心名称
                jtys:'',//交通预算
                zsys:'',//住宿预算
                qtys:'',//其他预算
                remark :'',//备注
                spjd :'',//审批进度
                ccsqdNo:'',//出差申请单单号
                mdd:'',//目的地
                projectName:'',//出差项目名称
                dateBegin:'',//出差日始
                dateEnd:'',//出差日止
                ccr:'',//出行人
                ccsy:'',//出差事由
                newDate:'',//申请时间
                gzmc:'',//审批规则
                // allRouteList:'',//出发机场
                departAirportName:'',//到达机场
                departDate:'',//出发日期
                departTime:'',//出发时间
                cabin:'',//舱位
                arriveCityName:'',//舱位
                departCityName:'',//舱位
            }
        },
        activated:function () {

        },
        created:function(){
            this.getCit();
            this.getSuccessData();
            // this.ccsqdSuccess();
            this.YuanAllPrice()
        },//created --END--
        methods:{
            //行程计划的城市
            getCit:function () {
                var getCt=common.sessionget('tkSearchInfo');
                console.log(getCt);
                this.dep=getCt.dep;
                this.arr=getCt.arr;
            },


            //总预算
            YuanAllPrice:function () {
                this.zys=this.jtys*1+this.zsys*1+this.qtys*1
            },
            //获取数据
            getSuccessData:function () {
                this.orderId = this.$route.query.orderId;
                var queryString = {ccsqdId:this.orderId};
                $conn.getConn("Approval.ccsqdSubSuccess")(queryString,function(resp){
                    console.log(resp.data);
                    this.allData=resp.data;
                        this.dateBegin=this.allData.dateBegin;
                        this.dateEnd=this.allData.dateEnd;
                    this.newDate=new Date().toLocaleDateString();//申请时间
                    this.allRouteList=this.allData.allRouteList;
                    console.log(this.allRouteList);
                   this.jtys= this.allData.jtys;
                   this.qtys= this.allData.qtys;
                   this.zsys= this.allData.zsys;
                        if(this.allData.status==0){return this.allData.status='草稿'}
                        if(this.allData.status==1){return this.allData.status='审批中'}
                        if(this.allData.status==2){return this.allData.status='审批通过'}
                        if(this.allData.status==3){return this.allData.status='审批拒绝'}
                        if(this.allData.status==4){return this.allData.status='已删除'}
                        if(this.allData.status==5){return this.allData.status='报销中'}
                        if(this.allData.status==6){return this.allData.status='已报销'}
                }.bind(this))
            },

            //    列表页
            ReturnSuperior:function () {
                Vue.router.goPath('/applicationList');
            },
            // 始发日
            getDate1:function(){
                mui.init();
                var dtPicker = new mui.DtPicker({"type":"date"});
                var self=this;
                dtPicker.show(function (selectItems){
                    self.date1=selectItems.y.value+'-'+selectItems.m.value+'-'+selectItems.d.value;
                })
            },
            //返程日
            getDate2:function(){
                mui.init();
                var dtPicker = new mui.DtPicker({"type":"date"});
                var self=this;
                dtPicker.show(function (selectItems){
                    self.date2=selectItems.y.value+'-'+selectItems.m.value+'-'+selectItems.d.value;
                })
            },
        },
        watch:{

        },


    });


    module.exports = DetailsApplications;
});