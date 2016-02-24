/*
   保存页面位置信息 & 驱使页面跳到历史位置 的组件
 */
function SavePoint() {
    // 当前页面的滚动距离
    this.scrollTop = document.body.scrollTop || document.documentElement.scrollTop;
    // 当前页面所属标签
    this.tag = document.title;
}
SavePoint.prototype = {
        // 修复构造器指针
        constructor: SavePoint,
        // 判断类型
        type: function(arg) {
            var t = typeof arg,
                s;
            if (t === 'object') {
                if (arg === null) {
                    return 'null';
                } else {
                    s = Object.prototype.toString.call(arg);
                    return s.slice(8, -1).toLowerCase();
                }
            } else {
                return t;
            }
        },
        /*
           根据传入的key获取保存在本地的value
           支持本地存储的浏览器使用本地存错，否则使用cookie
         */
        getDate: function(key) {
            key = key || this.tag;
            key = encodeURIComponent(key);
            var arr, reg = new RegExp("(^| )" + key + "=([^;]*)(;|$)");
            if (arr = document.cookie.match(reg)) {
                return JSON.parse(decodeURIComponent(arr[2]));
            } else {
                return null;
            }
        },
        /*
           根据key把data保存在本地
           支持本地存错的浏览器使用本地存储，否则使用cookie
         */
        setData: function(key, data, days) {
            // 设置cookie过期事件,默认是1天
            var expire = new Date();
            days = days || 1;
            expire.setTime(expire.getTime() + (+days) * 24 * 60 * 60 * 1000);
            document.cookie = encodeURIComponent(key) + "=" + encodeURIComponent(JSON.stringify(data)) + ";expires=" + expire.toGMTString();
        },
        // 保存页面位置信息到本地
        save: function(key, data) {
            // fix bug1：每次保存前都再次获取一下当前页面位置，保证存入本地的位置是 跳转之前的位置
            var scrollTop = (document.body.scrollTop || document.documentElement.scrollTop) || this.scrollTop;
            // 根据不同的参数数量组装局部变量
            if (arguments.length === 0) {
                key = this.tag;
                data = {
                    scrollTop: scrollTop
                }
            }
            if (arguments.length === 1) {
                data = key;
                key = this.tag;
            }
            if (this.type(data) !== 'object') {
                data = {
                    scrollTop: scrollTop
                }
            }
            // console.log(data);
            // 保存到本地
            this.setData(key, data);
        },
        get: function(key) {
            return this.getDate(key);
        },
        loadPoint: function() {
            // 取出本地存储中的历史页面历史位置
            // 跳转到历史位置
            this.toPoint(this.get() ? this.get().scrollTop : 0);
        },
        /*
          callback页面加载时跳转到历史位置之后执行的回调方法 
        */
        toPoint: function(scrollTop,callback) {
            document.body.scrollTop = scrollTop;
            document.documentElement.scrollTop = scrollTop;
            if(callback&&type(callback) ==="function"){
               callback.call(this);
            }
        }
    }
