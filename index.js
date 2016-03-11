'use strict';

module.exports = function (ret, conf, settings, opt) {
    //var performance = require('./fis-conf-performance');
    

    var fStr = (function() {
            if (!jr || !jr.performance) return false;
            
            var p = jr.performance;
            
            p.headTime = p.headEnd - p.headStart;
            p.docTime = (p.jsStart || p.jsEnd) - p.headStart;
            p.jsTime = (p.jsEnd - p.jsStart) || 0;
            p.headSize = document.head.innerHTML.length;
            p.docSize = document.documentElement.innerHTML.length;
            
            var src = '{{{urlPrefix}}}&page=' + encodeURIComponent(location.pathname) +
                      '&headTime=' + p.headTime + 
                      '&docTime=' + p.docTime + 
                      '&jsTime=' + p.jsTime +
                      '&headSize=' + p.headSize + 
                      '&docSize=' + p.docSize;
            
            (function(src) {
                var p_script,
                    
                    sendTimer = setTimeout(function(){
                        clearTimeout(sendTimer);
                        sendTimer = null;
                        
                        p_script = document.createElement('SCRIPT');
                        p_script.src = src;
                        document.body.appendChild(p_script);
                    },0),
                    
                    timeoutTimer = setTimeout( function(){
                        clearTimeout(timeoutTimer);
                        timeoutTimer = null;
                        
                        p_script.onreadystatechange = p_script.onload = p_script.onerror = p_script.readyState = null;
                        document.body.removeChild(p_script);
                    }, 3000 );
            })(src)

        })
        .toString()
        .replace( '{{{urlPrefix}}}', settings.urlPrefix );



    var performance = {
        headStart:    '<script> var jr=jr||{}; jr.performance=jr.performance||{}; jr.performance.headStart = new Date().getTime(); </script>',
        headEnd:      '<script> jr.performance.headEnd=new Date().getTime(); </script>',
        jsStart:      '<script> jr.performance.jsStart=new Date().getTime(); </script>',
        jsEnd:        '<script> jr.performance.jsEnd=new Date().getTime(); </script>',
        docReadyHandler: "#[[<script> document.addEventListener( 'DOMContentLoaded', " + fStr + " )</script>]]#"
    }
    
    
    
    
    
    
    fis.util.map(ret.src, function(subpath, file) {
        
        if (file.isHtmlLike && file.isViews) {
            
            var content = file.getContent();
            
            // <head>开始 --- 开始记录
            content = content.replace(/(\<\s*head\s*\>)/ig, function() {
                return RegExp.$1 + performance.headStart;
            });
            
            // </head>结束 --- 白屏时间
            content = content.replace(/(\<\s*\/\s*head\s*\>)/ig, function() {
                return RegExp.$1 + performance.headEnd;
            });
            
            // __FRAMEWORK_CONFIG__钩子前 --- document渲染时间，以及js开始加载时间
            content = content.replace(/(\b__FRAMEWORK_CONFIG__\b)/g, function() {
                return performance.jsStart + RegExp.$1;
            });
            
            // </body>结束 --- js执行完毕时间；发送统计数据
            content = content.replace(/(\<\s*\/\s*body\s*\>)/ig, function() {
                return performance.jsEnd + performance.docReadyHandler + RegExp.$1;
            });
            
            file.setContent(content);
        }
    })
};