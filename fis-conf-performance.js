/** decraped, 2016-03-09, jiajianrong, replaced with jello-postpackager-performance-framework index.js **/

//  var p_xhr = new XMLHttpRequest();
//  p_xhr.open('GET', src);
//  p_xhr.send(null);
    
    

function docReadyHandler() {
    var p = jr.performance;
    
    p.headTime = p.headEnd - p.headStart;
    p.docTime = (p.jsStart || p.jsEnd) - p.headStart;
    p.jsTime = (p.jsEnd - p.jsStart) || 0;
    p.headSize = document.head.innerHTML.length;
    p.docSize = document.documentElement.innerHTML.length;
    
    var src = 'http://ip:port/saveTime?project=cfq-crm&page=' + encodeURIComponent(location.pathname) +
              '&headTime=' + p.headTime + 
              '&docTime=' + p.docTime + 
              '&jsTime=' + p.jsTime +
              '&headSize=' + p.headSize + 
              '&docSize=' + p.docSize;
    
    var p_script=document.createElement('SCRIPT');
    p_script.src=src;
    document.body.appendChild(p_script);
}



exports.placeholder = {
	headStart:    '<script> var jr=jr||{}; jr.performance=jr.performance||{}; jr.performance.headStart = new Date().getTime(); </script>',
	
	headEnd:      '<script> jr.performance.headEnd=new Date().getTime(); </script>',
	
	jsStart:      '<script> jr.performance.jsStart=new Date().getTime(); </script>',
	
	jsEnd:        '<script> jr.performance.jsEnd=new Date().getTime(); </script>',
	
	docReadyHandler: "<script> document.addEventListener( 'DOMContentLoaded', " + docReadyHandler.toString() + " )</script>"
}