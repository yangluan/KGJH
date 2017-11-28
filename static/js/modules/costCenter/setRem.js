
//使用方式：
     //1.直接在html页面中引入这个js文件
     //2.移动端适配在scss中先写入以下3行代码
     //3.当测量width为200px时候   eg:width: rem(200)
// @function rem($px) {
// @return $px / 46.875 + rem;
// }



window.addEventListener('orientationchange', setRem)
window.addEventListener('resize', setRem)
setRem()
function setRem() {
    var html = document.querySelector('html')
    var width = html.getBoundingClientRect().width;
    html.style.fontSize = width / 16 + 'px'
}
