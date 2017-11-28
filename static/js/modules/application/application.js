/**
 * Created by Best_An_An on 2017/8/10.
 */
//出差申请单
define(function (require,exports,module) {
    var common = require("common");
    var $conn  = require("$conn");
    var application = require("../../../templates/application/application.html");
    require('../../../css/application/application.css');
    var application = Vue.extend({
        template: application,
        data:function(){
            return {
                cxrName:'',//出行人默认登录人
                spcgID:'', //审批规则id
                gzmc:'',   //审批规则名称
                gzid:'',   //选取规则后返回的审批规则id
                gzdm:'',   //选取规则后返回的规则代码
                CcsqDcbzxList:{},//成本中心数据列表
                cbZxCode:'',//成本中心代码
                cbZxName:'',//成本中心名字
                cbZxId:'',//成本中心id
                CcsqDxzxmList:{},//选择项目数据列表
                xzxmCode:'',//选择项目代码
                xzxmName:'',//选择项目名称
                xzxmId:'',//选择项目id
                ccrId:'',//出差人id
                ccsy:'',//出差事由
                TrafficPrice:0,//交通费
                ptText:'',//user输入de目的地
                HotelPrice:0,//住宿费
                otherPrice:0,//其他费用
                allprice:0,  //总价
                userUrl:'/home', //入口路径
                Remarks:'',//备注说明
                empId:'',//登录人id
                date1:"",//出差日期开始
                date2:"",//出差日期结束
                xcjhData:[],//行程计划下的数据显示
                sxr:'',//随行人名称
                getPeoplesNames:[],//同行人数组
                ccsqdId:'',//出差申请单id
                flag:'',//是否项目出差
                wbyy:'',//违背原因
                arrShow:false,//数组的遍历的机票数据
                weiShow:false,// 违背显示
                arr1Show:false,// 行程计划数据展示开关
                isShow:false,//机票数据的展示开关控制
                jiPiaoData:{},//机票数据返回的信息
                CxRdaTa:{},//出行人乘机的信息
                userInfo:{},//user data
                isOrXmxz:false,//项目选择默认不显示
                bjXcData:"",//不搜索直接确定返回数据
                daoDszm:'',//到达城市三字码
                chuFszm:'',//出发城市三字码
                arr:'',//到达城市名称
                dep:'',//出发城市名称
                chuxingPeople:{},//出行人
            }
        },
        //页面载入之前执行
        activated:function(){
            // this.muiInit();
            this.needApprovalYang();
            this.getpeoples();
            // this.getTongXingPeople();
            this.xingChengJh();
            this.getCbzxData();
            this.getXzxmData();
            this.getLoginInformation();
            this.getCxRdaTa();
            this.getJiPiaoData();
            mui('.mui-switch')['switch']();
        },
        //页面离开之后执行
        deactivated:function(){

        },
        methods:{
            //开关按钮的控制
            toggleSwich:function (ev) {
                   this.isOrXmxz=!this.isOrXmxz;
            },

            //清空缓存
            clearCache:function () {
                common.sessionremove('cbzxList');
                common.sessionremove('tkcxrlist1');
                common.sessionremove('cbzxParameter');
                common.sessionremove('cbzxParameter1');
                common.sessionremove('xzxmList');
                common.sessionremove('jiPiaoData');
                common.sessionremove('tkcxrlist2');
                common.sessionremove('city');
                common.sessionremove('tkSearchInfo');
                common.sessionremove('tkFlightList');
                common.sessionremove('tkViolateItem');
                common.sessionremove('tkVoyage1');
                common.sessionremove('bjXcData');
                common.sessionremove('SubSuccessData');
            },
            //跳转编辑行程页面的时候带过去出差人和同行人名称
            cxRtxR:function () {
                var cxRtxRNameData={
                    cxrName:this.cxrName,
                    sxr:this.sxr
                };
                common.sessionset('cxRtxRNameData',cxRtxRNameData)
            },

            //获取到同行人信息回显
            getpeoples:function () {
                var getcxr = common.sessionget("tkcxrlist2");//获取选中的出行人
                // var name=[];//选中人的名称
                if(getcxr){
                    for(var i in getcxr){
                        if(getcxr[i].checked==true){
                            // name.push(getcxr[i].empName);
                            var name = getcxr[i].empName;
                            this.sxr=name;
                        }
                    }
                    console.log(name)
                }
            },
            //获取到登陆人信息回显(get)   获取到出差人的信息回显    OK的
            getLoginInformation:function () {
                var userInfo= common.sessionget('userInfo');//获取用户登录信息
                var getcxr = common.sessionget("tkcxrlist1");//获取选中的出差人
                // var tkcxrlist= common.localget('tkcxrlist');
                this.ccrId=userInfo.empInfo.empId;//出差人id
                this.userInfo=userInfo;
                    this.cxrName=userInfo.empInfo.empName;//出差人名字
                if(getcxr){
                    for(var i in getcxr){
                        if(getcxr[i].checked==true){
                            var name=getcxr[i].empName;
                            this.cxrName=name
                        }
                    }
                }
            },
            //获取到审批规则id (post)
            needApprovalYang:function () {
                var memberId = common.sessionget("userInfo").empInfo.empId;
                var djlx = 11099;
                var queryString = {travelEmpIds:memberId,djlx:djlx,ifViolate:0};
                $conn.getConn("Approval.needApproval")(queryString,function(resp){
                    // say(resp.data);
                    this.spcgID=resp.data.spgzId;
                    this.needApprovalNameYang()
                }.bind(this));
            },
            //获取到审批规则名称(get)
            needApprovalNameYang:function () {
                var spgzList= common.sessionget('spgzList');
                var queryString = {gzid:this.spcgID};
                $conn.getConn("Approval.needApprovalName")(queryString,function(resp){
                    if(spgzList){
                        this.gzmc= spgzList.gzmc;
                        this.gzid= spgzList.gzid;
                        this.gzdm= spgzList.gzdm;
                    }else{
                        this.gzmc=resp.data.gzmc;
                    }
                }.bind(this))
            },
            //获取成本中心数据
            getCbzxData:function () {
                var CcsqDcbzxList= common.sessionget('cbzxList');
                if(CcsqDcbzxList){
                    this.CcsqDcbzxList=CcsqDcbzxList;
                    this.cbZxCode=CcsqDcbzxList.costCenterCode;
                    this.cbZxName=CcsqDcbzxList.costCenterName;
                    this.cbZxId=CcsqDcbzxList.costCenterId;
                }else{
                    this.cbZxCode='';
                    this.cbZxName='';
                    this.cbZxId='';
                }
            },
            //获取选择项目数据
            getXzxmData:function () {
                var CcsqDxzxmList= common.sessionget('xzxmList');
                if(CcsqDxzxmList){
                    this.CcsqDxzxmList=CcsqDxzxmList;
                    this.xzxmCode=CcsqDxzxmList.projectCode;
                    this.xzxmName=CcsqDxzxmList.projectName;
                    this.xzxmId=CcsqDxzxmList.id;
                    common.sessionset('cbzxParameter',this.xzxmId);
                    common.sessionset('cbzxParameter1',this.ccrId)
                }else{
                    this.xzxmId='';
                    this.xzxmName='';
                    this.xzxmId=''
                }
            },
            //行程计划删除按钮
            removeXcJh:function () {
                console.log(this.xcjhData);
                for(var i in this.xcjhData){
                    this.xcjhData.pop(this.xcjhData[i])
                }
                this.isShow=false;
                this.TrafficPrice=0
            },
            //行程计划数据展示的跳转向编辑行程页面
            xcJhGo:function () {
                Vue.router.goPath('/applicationTravelPlan')
            },
            //获取出行人的机票信息等
            getCxRdaTa:function () {
                var tkVoyage1=common.sessionget('tkVoyage1'); //乘机人信息
                var bjXcData=common.sessionget('bjXcData');//没点查询直接确定
                if(tkVoyage1){
                    this.isShow=true;
                    this.weiShow=true;
                    this.arrShow=true;
                    this.arr1Show=true;
                    this.CxRdaTa=tkVoyage1;
                    this.chuFszm=this.CxRdaTa.info.departAirport;//出发三字码
                    this.daoDszm=this.CxRdaTa.info.arriveAirport;//到达三字码
                    this.arr=this.CxRdaTa.info.departAirportName;//到达城市名称
                    this.dep=this.CxRdaTa.info.departAirportName//出发城市名称
                }else if(bjXcData){
                    {
                        this.isShow=true;
                        this.weiShow=true;
                        this.arrShow=true;
                        this.arr1Show=true;
                        this.bjXcData=bjXcData;
                        console.log(this.bjXcData);
                        this.chuFszm=bjXcData.chuFszm;
                        this.daoDszm=bjXcData.daoDszm;
                        this.arr=bjXcData.arr;
                        this.dep=bjXcData.dep;
                        var getxcjhData = common.sessionget("bjXcData");
                        if(getxcjhData){
                            this.isShow=true;
                            this.arrShow=true;
                            this.arr1Show=true;
                            this.weiShow=true;

                            this.xcjhData.push(getxcjhData);
                            for(var i in this.xcjhData){
                                if(this.xcjhData[i]===this.xcjhData[i]){
                                    this.xcjhData.splice(i+1,1);
                                    this.TrafficPrice=this.xcjhData[i].yuSuan*1;
                                }
                            }
                        }
                    }
                }
            },
            //保存草稿  subDraft
            subDraft:function () {
                var queryString = {
                    addMethod: 1,
                    appId: this.spcgID,
                    ccr: this.cxrName,
                    ccsy: this.ccsy,
                    costCenterCode: this.cbZxCode,
                    costCenterId: this.cbZxId,
                    costCenterName: this.cbZxName,
                    dateBegin: this.date1,
                    dateEnd: this.date2,
                    jtys: this.TrafficPrice,
                    mdd: this.ptText,
                    project: 1,
                    projectCode:this.xzxmCode,
                    projectId:this.xzxmId,
                    projectName:this.xzxmName,
                    qtys: this.otherPrice,
                    remark:this.Remarks,
                    sxr:this.sxr,
                    vipPerson: [
                        {
                            cxrName: this.cxrName,
                            empId: this.ccrId,
                            exPerson: 0,//是否外来人员
                            sxr:1,
                        }
                    ],
                    vipRoute: [
                        {
                            against:1,
                            arriveAirport: this.daoDszm,
                            arriveAirportName: this.arr,
                            arriveCity: "", //城市id
                            arriveCityName: this.jiPiaoData.dep,
                            arriveDate: this.jiPiaoData.arriveDate,
                            arriveTime: this.jiPiaoData.arriveTime,
                            cabin: this.jiPiaoData.cangWei,
                            cxr: this.cxrName+','+this.sxr,
                            cxrId: this.ccrId,//?同行人id
                            departAirport: this.chuFszm,
                            departAirportName: this.dep,
                            departCity: "",//城市id
                            departCityName: this.jiPiaoData.arriveAirportName,
                            departDate: this.CxRdaTa.info.departDate,
                            departTime: this.CxRdaTa.info.departTime,
                            dj: 0,
                            fjs: 0,
                            flightNo: this.jiPiaoData.flightNo,
                            fyys: this.jiPiaoData.price,
                            xcxh: "1",
                            proType: ""
                        }
                    ],
                    zsys: this.HotelPrice,
                    zys: this.allprice
                };
                var ptText = document.getElementById('ptText').value,
                    ccsy=document.getElementById('ccsy').value;
                if(!ptText){
                    mui.alert('目的地填写不完整')
                }else if(!ccsy){
                    mui.alert('请填写出差事由')
                }else if(this.cbZxName==''){
                    mui.alert('请选择成本中心')
                }else if(this.dateBegin==''){
                    mui.alert('请选择出差时间始')
                }else if(this.dateEnd==''){
                    mui.alert('请选择出差时间止')
                }else if(this.gzmc==''){
                    mui.alert('请选择审批规则')
                }else{
                    $conn.getConn('Approval.subDraftSs')(queryString,function (resp) {
                        console.log(resp);
                        Vue.router.goPath('/applicationList');
                    }.bind(this));
                }
            },
            //提交送审   submitCensorship
            submitCensorship:function () {
                var queryString = {
                    addMethod: 1,
                    appId: this.spcgID,
                    ccr: this.cxrName,
                    ccsy: this.ccsy,
                    costCenterCode: this.cbZxCode,
                    costCenterId: this.cbZxId,
                    costCenterName: this.cbZxName,
                    dateBegin: this.date1,
                    dateEnd: this.date2,
                    jtys: this.TrafficPrice,
                    mdd: this.ptText,
                    project: 1,
                    projectCode:this.xzxmCode,
                    projectId:this.xzxmId,
                    projectName:this.xzxmName,
                    qtys: this.otherPrice,
                    remark:this.Remarks,
                    sxr:this.sxr,
                    vipPerson: [
                        {
                            cxrName: this.cxrName,
                            empId: this.ccrId,
                            exPerson: 0,//是否外来人员
                            sxr:1,
                        }
                    ],
                    vipRoute: [
                        {
                            against:1,
                            arriveAirport: this.daoDszm,
                            arriveAirportName: this.arr,
                            arriveCity: "", //城市id
                            arriveCityName: this.jiPiaoData.dep,
                            arriveDate: this.jiPiaoData.arriveDate,
                            arriveTime: this.jiPiaoData.arriveTime,
                            cabin: this.jiPiaoData.cangWei,
                            cxr: this.cxrName+','+this.sxr,
                            cxrId: this.ccrId,//?同行人id
                            departAirport: this.chuFszm,
                            departAirportName: this.dep,
                            departCity: "",//城市id
                            departCityName: this.jiPiaoData.arriveAirportName,
                            departDate: this.CxRdaTa.info.departDate,
                            departTime: this.CxRdaTa.info.departTime,
                            dj: 0,
                            fjs: 0,
                            flightNo: this.jiPiaoData.flightNo,
                            fyys: this.jiPiaoData.price,
                            xcxh: "1",
                            proType: ""
                        }
                    ],
                    zsys: this.HotelPrice,
                    zys: this.allprice
                };
                var ptText = document.getElementById('ptText').value,
                    ccsy=document.getElementById('ccsy').value;
                    // bbsm=document.getElementById('bbsm').value;
                if(!ptText){
                    mui.alert('目的地填写不完整')
                }else if(!ccsy){
                    mui.alert('请填写出差事由')
                    }else if(this.cbZxName==''){
                    mui.alert('请选择成本中心')
                }else if(this.dateBegin==''){
                    mui.alert('请选择出差时间始')
                }else if(this.dateEnd==''){
                    mui.alert('请选择出差时间止')
                }else if(this.gzmc==''){
                    mui.alert('请选择审批规则')
                }else{
                    $conn.getConn('Approval.subDraftSs')(queryString,function (resp) {
                        this.ccsqdId=resp.data.ccsqdId;
                        Vue.router.goPath('/approvalSend?orderId='+this.ccsqdId+'&orderType='+11099+'&gzid='+this.spcgID)
                    }.bind(this));
                }
            },
            // 返回home页
            ReturnSuperior:function () {
                this.clearCache();
                this.isShow=false;
                this.arrShow=false;
                this.weiShow=false;
                this.arr1Show=false;
                this.ptText='';
                this.sxr='';
                this.date1='';
                this.date2='';
                this.ccsy='';
                this.Remarks='';
                this.getPeoplesNames=[];
                this.CcsqDcbzxList={};
                this.gzmc='';
                this.otherPrice=0;
                this.HotelPrice=0;
                this.TrafficPrice=0;
                Vue.router.goPath('/home');
            },
            //行程计划的数据回显
            xingChengJh:function () {

            },

            //获取到同行人进行回显
            // getTongXingPeople:function () {
            //     var getPeoplesNames = common.sessionget("tkcxrlist1");
            //     if(getPeoplesNames){//如果sessionage中存在getPeoplesNames
            //         this.getPeoplesNames=getPeoplesNames;
            //         for(var i in this.getPeoplesNames){
            //             this.sxr=this.getPeoplesNames[i].empName
            //         }
            //     }
            // },
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
            //项目选择开关控制
            btn:function () {
                var xmxz=document.getElementById('xmxz'),btnDot=document.getElementById('btnDot'),btnBox=document.getElementById('btnBox');
                if(xmxz.style.display=='none'){
                    xmxz.style.display='block';
                    this.flag=true;
                    btnBox.style.backgroundColor='green';
                    btnDot.style.marginLeft=20+'px'
                }else{
                    xmxz.style.display='none';
                    this.flag=false;
                    btnBox.style.backgroundColor='white';
                    btnDot.style.marginLeft=0+'px'
                }
        },
            //机票信息的展示
            getJiPiaoData:function () {
                var jiPiaoData=common.sessionget('jiPiaoData');
                var bjXcData=common.sessionget('bjXcData');//没点查询直接确定
                if(jiPiaoData){
                    this.weiShow=true;
                    this.isShow=true;
                    this.arrShow=true;
                    this.arr1Show=true;
                    this.jiPiaoData=jiPiaoData;
                    this.TrafficPrice=jiPiaoData.price;
                }else if(bjXcData){
                    this.weiShow=false;
                    this.isShow=true;
                    this.arrShow=true;
                    this.arr1Show=false;
                }else{
                    {
                        this.weiShow=false;
                        this.isShow=false;
                        this.arrShow=false;
                        this.arr1Show=false;
                    }
                }
                console.log(this.jiPiaoData)
            },
            //mui
            // muiInit:function () {
            //     mui.init({swipeBack:true})//启用右滑关闭功能
            // },
            //选择项目
            applicationProjectSelection:function () {
                Vue.router.goPath('/applicationProjectSelection');
            },
            //出差人
            businessTraveller:function () {
                var number = 1;
                Vue.router.goPath('/applicationColleague?number='+number);
            },
            //同行人员
            Colleague:function () {
                var number = 2;
                Vue.router.goPath('/applicationColleague?number='+number);
            },
            //成本中心   businessTraveller   applicationApproval
            costCenter:function () {
                Vue.router.goPath('/costCenter');
            },
            //审批规则   businessTraveller   applicationApproval
            applicationApproval:function () {
                Vue.router.goPath('/applicationApproval');
            },
            //酒店入住
            applicationAccommodation:function () {
                mui.alert('开发中...')
            }
        },
        computed:{}
    });
    module.exports = application;
});
