
define(function (require, exports, module) {
  //大小写一致
  var SetPassword = require("templates/login/loginSetPassword.html");
  var common = require("common");
  var $conn = require("$conn");
  require("css/login/loginSetPassword.css");
  var VueComponent = Vue.extend({
    template: SetPassword,
    data: function () {
      return {
        newPassword: "",
        secondPassword: ""
      };
    },
    created: function () { },
    methods: {
      setsmscode: function () {
        if (this.newPassword == '') {
          mui.alert('您的密码不能为空！');
          return;
        } else {
          var reg = /^(?![\d]+$)(?![a-zA-Z]+$)(?![^\da-zA-Z]+$).{6,20}$/,
            flag = reg.test(this.newPassword);
         
          if (flag) {
//        	say(this.newPassword);
//        	say(this.secondPassword);
            if (this.newPassword == this.secondPassword) {
              var queryString = {
                phoneNumber: this.$route.query.phoneNumber,
                pwd: this.newPassword.trim(),
                smsCode: this.$route.query.smsCode
              };
         
              $conn.getConn("user.vipEmpResetPwd")(queryString, function (resp) {
                say(resp);
                mui.alert('您的密码修改成功！')
                Vue.router.goPath("/");
              });
            } else {
              mui.alert('两次密码不一致！')
            };
          };
          if (!flag) {
            mui.alert('您的密码格式不正确！');
          }
        };

      }
    }
  });
  module.exports = VueComponent;
});

