/**
 * Created by Best_An_An on 2017/8/17.
 */
//编辑行程
define(function (require,exports,module) {
    var common = require("common");
    var $conn  = require("$conn");
    var applicationTravelPlan = require("../../../templates/application/applicationTravelPlan.html");
    require('../../../css/application/applicationTravelPlan.css');
    // require('./setRem.js');
    function tips(str){
        mui.toast(str,{ duration:'long', type:'div' });
    }
    var applicationTravelPlan = Vue.extend({
        template: applicationTravelPlan,
        data: function(){
            return {
                userUrl:'/application',
                getPeoplesNames:[],
                'dc':true,//单程,往返
                "date1":"",//出发日期
                "dep":"",//出发城市
                "arr":"",//到达城市
                "depszm":"",//出发三字码
                "arrszm":"",//到达三字码
                'minZj':'',
                yuSuan:'',//预算
                zcGnjp:'',
                outerSize:'',
                isshow:false,
                arriveAirportName:'',
                departAirportName:'',
                arriveDate:'',
                arriveTime:'',
                airlineName:'',
                flightNo:'',
                airlineImg:'',
                cangWei:'',//舱位信息
                price:'',//价格
                yusuanShow:true,
                cxRtxRNameData:{},//带过来的出行人和同行人名称
                chuFszm:"",//出发城市三字码
                daoDszm:"",//daoda城市三字码
            }
        },
        created:function(){
            this.getTongXingPeople();
            this.getUserZj();


        },
        methods:{
            //跳转倒出行人页面    editTripCxr
            editTripCxr:function () {
                var number =3;
                Vue.router.goPath('/applicationColleague?number='+number)
            },

            //获取倒带过来的出差人和同行人
            getcxRtxRNameData:function () {
                var cxRtxRNameData=common.sessionget('cxRtxRNameData');
                this.cxRtxRNameData=cxRtxRNameData;
                console.log(this.cxRtxRNameData)
            },
            //不搜索直接点确定
            btnQueDing:function () {
                if(!this.dep){tips('请选择出发城市');return false;}
                if(!this.arr){tips('请选择到达城市');return false;}
                if(!this.date1){tips('请选择出发日期');return false;}
                if(!this.dc&&!this.date2){tips('请选择返程日期');return false;}



                var queryString={
                        date1:this.date1,
                        dep:this.dep,
                        arr:this.arr,
                        yuSuan:this.yuSuan,
                        chuFszm:this.depszm,
                        daoDszm:this.arrszm,
                    // departAirportName:this.arr,//到达城市名称
                    // departAirportName2:this.dep,//出发城市名称
                    };
                common.sessionset('bjXcData',queryString);

                Vue.router.goPath(this.userUrl)
            },
            //获取到同行人进行回显
            getTongXingPeople:function () {
                var getPeoplesNames = common.sessionget("tkcxrlist3");
                // console.log(getPeoplesNames);
                this.getPeoplesNames=getPeoplesNames;
            },

            //获取到出差人职级
            getUserZj:function () {
                var UsersZj = common.sessionget("userInfo");
                // console.log(UsersZj);
                this.minZj=UsersZj.empInfo.empRank;
                this.zcGnjp=UsersZj.vipCorp.zcGnjp;
                this.outerSize=UsersZj.empInfo.outerSize;
            },


        //    返回上级页面
            ReturnSuperior:function () {
                Vue.router.goPath(this.userUrl)
            },

            //单程
            onlyWay:function(){
                this.dc=true;
            },
            //时间
            getDate1:function(){
                mui.init();
                var dtPicker = new mui.DtPicker({"type":"date"});
                var self=this;
                dtPicker.show(function (selectItems){
                    self.date1=selectItems.y.value+'-'+selectItems.m.value+'-'+selectItems.d.value;
                })
            },
            // 出发地
            getCity:function(){
                Vue.router.goPath("/city?city=1&type=applicationTravelPlan");
            },
            // 目的地
            getCity2:function(){
                Vue.router.goPath("/city?city=2&type=applicationTravelPlan");
            },
            //调换城市
            deparr:function(){
                var cache=this.dep;
                this.dep=this.arr;
                this.arr=cache;
                var szm=this.depszm;
                this.depszm=this.arrszm;
                this.arrszm=szm;
            },
            //搜索
            search:function(){
                if(!this.dep){tips('请选择出发城市');return false;}
                if(!this.arr){tips('请选择到达城市');return false;}
                if(!this.date1){tips('请选择出发日期');return false;}
                if(!this.dc&&!this.date2){tips('请选择返程日期');return false;}
                var tripType=1;
                this.isYs?tripType=2:tripType;
                Vue.router.goPath("/flightlist?dep="+this.dep+'&arr='+this.arr+'&date1='+this.date1+'&date2='+this.date2+'&empRank='+this.minZj+'&tripType='+tripType+'&depszm='+this.depszm+'&arrszm='+this.arrszm+'&againQuery=0'+'&type=applicationTravelPlan'+'&ccsqdSearch=1');
                var tkSearchInfo={
                    "dep":this.dep,//出发城市
                    "arr":this.arr,//到达城市
                    "depszm":this.depszm,//出发城市三字码
                    "arrszm":this.arrszm,//到达城市三字码
                    "date1":this.date1,//出发日期
                    // "date2":this.date2,//返程日期
                    "empRank":this.minZj,//最低职级
                    "tripType":1,//因公 因私
                    "showXc":true,//是否走出差申请单
                    "dc":true,//单程or往返
                    "cxr":this.getPeoplesNames,//出行人集合
                    "zcGnjp":this.zcGnjp,//是否开启差旅政策
                    "outerSize":this.outerSize//是否可为外来人订票
                };
                common.sessionset('tkSearchInfo',tkSearchInfo);
            },

            //获取机票查询返回的数据
            getTkVoyage1:function () {
                var Voyage1Data=common.sessionget('tkVoyage1');
                if(Voyage1Data){
                    this.isshow=true;
                    this.yusuanShow=false;
                    console.log(Voyage1Data);
                    var cabinType=Voyage1Data.cabinType;//舱位的key值
                    this.cabinMap=Voyage1Data.info.cabinMap;//舱位map
                    this.cangWei=this.cabinMap[cabinType].cabinName;//舱位信息
                    var priceId=Voyage1Data.priceId;//价格的priceID
                    this.priceMap=Voyage1Data.priceMap;//PriceMap
                    this.price=this.priceMap[priceId].salePrice*1+this.priceMap[priceId].serviceFee*1;//价格
                    console.log(this.price);
                    this.arriveAirportName=Voyage1Data.info.arriveAirportName;//出发机场
                    this.departAirportName=Voyage1Data.info.departAirportName;//到达机场
                    this.arriveDate=Voyage1Data.info.arriveDate;//出发日期
                    this.arriveTime=Voyage1Data.info.arriveTime;//出发时间
                    this.airlineName=Voyage1Data.info.airlineName;//航空公司名称
                    this.flightNo=Voyage1Data.info.flightNo;//航班名称
                    this.airlineImg=Voyage1Data.info.airlineImg;//航空公司logo图
                    var querySting = {
                        arriveAirportName:this.arriveAirportName,
                        departAirportName:this.departAirportName,
                        arriveDate:this.arriveDate,
                        arriveTime:this.arriveTime,
                        airlineName:this.airlineName,
                        flightNo:this.flightNo,
                        airlineImg:this.airlineImg,
                        cangWei:this.cangWei,
                        price:this.price,
                        dep:this.dep,
                        arr:this.arr,
                        wbsx:Voyage1Data.wbsx
                    };
                    common.sessionset('jiPiaoData',querySting)
                }else{
                    this.isshow=false;
                    this.yusuanShow=true;
                }
            },
        },
        computed:{},
        activated:function () {
            this.getcxRtxRNameData();
            this.getTongXingPeople();
            this.getUserZj();
            this.getTkVoyage1();
            // 始发地
            if(this.$route.query.cname){
                this.dep=this.$route.query.cname;
                this.depszm=this.$route.query.szm;
            }
            // 目的地
            if(this.$route.query.cname2){
                this.arr=this.$route.query.cname2;
                this.arrszm=this.$route.query.szm;
            }
        }

    });


    module.exports = applicationTravelPlan;
});