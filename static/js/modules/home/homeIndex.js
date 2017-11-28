/**
 * Created by zackey on 2016/5/28.
 */
// 定义组件

define(function (require,exports,module) {
    var homeIndex = require("templates/home/homeIndex.html");
    var common = require("common");
	require('css/home/homeIndex.css');
    var VueComponent = Vue.extend({
        template: homeIndex,
        data:function(){
        	return {
        		bookStyle:1,
        	}
        },
        created:function(){
        	this.startFooter();
        },
        methods:{
        	startFooter:function(){
        	 var userInfo = common.sessionget('userInfo');
        	 this.bookStyle = userInfo.vipCorp.bookStyle;
        	},
       
        }
    });

    module.exports = VueComponent;
});

