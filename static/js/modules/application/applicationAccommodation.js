/**
 * Created by Best_An_An on 2017/8/17.
 */
define(function (require,exports,module) {
    var common = require("common");
    var $conn  = require("$conn");
    var applicationAccommodation = require("../../../templates/application/applicationAccommodation.html");
    require('../../../css/application/applicationAccommodation.css');
    require('./setRem.js');
    var applicationAccommodation = Vue.extend({
        template: applicationAccommodation,
        data: function(){
            return {
                userUrl:'/application',
            }
        },
        created:function(){},
        methods:{
            //    返回上级页面
            ReturnSuperior:function () {
                Vue.router.goPath(this.userUrl)
            }
        },
        computed:{}

    });


    module.exports = applicationAccommodation;
});