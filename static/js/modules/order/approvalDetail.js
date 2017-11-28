

define(function (require,exports,module) {
    var approvalDetail = require("templates/approval/approvalDetail.html");
    var common = require("common");
	require('css/approval/approvalDetail.css');
    var VueComponent = Vue.extend({
        template: approvalDetail ,
        data:function(){
        	return {
        		
        	}
        },
        created:function(){
        	
        },
        methods:{
        	
        },
    });

    module.exports = VueComponent;
});