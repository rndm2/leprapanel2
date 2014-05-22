function lpr2userscript_newComments() {}

lpr2userscript_newComments.prototype = {
		
	name: 'newComments',
	
	include: new RegExp(':\/\/([a-zA-Z0-9]+\.)?leprosorium\.ru\/(comments\/\\d+|my\/inbox\/\\d+)'),
	
	run: function(doc, $) {
		var navLinkNext;
		var navLinkPrev;
		var pp = doc.getElementsByTagName("DIV");
		var newpp = [];
		var currentPost = -1;
	    var css = 	'.lp-nc-block { position: fixed; top: 90px; right: 0px; z-index: 100; }' + 
	      			'.lp-nc-block input { display: block; width: 28px; height: 28px; color: #000; background-color: #fff; border: 1px solid #000; padding: 0pt; margin: 0pt; margin-bottom: 1px; cursor: pointer; opacity: 0.25; }' +
	      			'.lp-nc-block input:hover { opacity: 1; }';
	    var script = "\
	    	function LP_scrollTo(aThis) { \
	        	aThis.blur(); \
	        	var pId = aThis.getAttribute('postid'); \
	        	var offset = parseInt(aThis.getAttribute('offset')); \
	        	var p = $(pId); \
	        	var f = new Fx.Scroll(window, {duration: 'short'}); \
	        	if(!p || !offset || !f) return; \
	        	f.start(0, offset); \
	        	(function(){p.childNodes[1].highlight('#f4fbac');p.childNodes[3].highlight('#f4fbac');}).delay(250); \
	    	}";
	
	    var ppLength = pp.length;
	    for (var i = 0; i < ppLength; i++) {
	    	if (/comment/.test(pp[i].className) && /new/.test(pp[i].className)) {
	    		newpp.push(pp[i]);
	    	}
	    }
	
	    if (newpp.length > 0) {
	    	var style = doc.createElement("STYLE");
	    	style.type = "text/css";
	    	style.innerHTML = css;
	    	doc.body.appendChild(style);
	    	var scriptBlock = doc.createElement("SCRIPT");
	    	scriptBlock.type = "text/javascript";
	    	scriptBlock.innerHTML = script;
	    	doc.body.appendChild(scriptBlock);
	    	initializeNavLink();
	    }
	
	    function initializeNavLink() {
	    	var navBlock = doc.createElement("DIV");
	    	navBlock.className = "lp-nc-block";

	    	navLinkNext = doc.createElement("INPUT");
	    	navLinkNext.addEventListener("click", function() { navigate(1); }, false);
	    	navLinkNext.setAttribute("type", "button");
	    	navLinkNext.setAttribute("value", "↓");
	    	navLinkNext.setAttribute("postid", newpp[0].id);
	    	navLinkNext.setAttribute("onclick", "LP_scrollTo(this);");

	    	navLinkPrev = doc.createElement("INPUT");
	    	navLinkPrev.addEventListener("click", function() { navigate(-1); }, false);
	    	navLinkPrev.setAttribute("type", "button");
	    	navLinkPrev.setAttribute("value", "↑");
	    	navLinkPrev.setAttribute("postid", newpp[0].id);
	    	navLinkPrev.setAttribute("onclick", "LP_scrollTo(this);");

	    	navBlock.appendChild(navLinkPrev);
	    	navBlock.appendChild(navLinkNext);
	    	doc.body.appendChild(navBlock);
	    }
	

	    function navigate(aDirection) {
	    	if (aDirection > 0) {
	    		currentPost++;
	    		if (currentPost >= newpp.length) {
	    			currentPost = newpp.length - 1;
	    		}
	    	} else {
	    		currentPost--;
	    		if (currentPost < 0) {
	    			currentPost = 0;
	    		}
	    	}
	    	navLinkNext.setAttribute("postid", newpp[currentPost].id);
	    	navLinkPrev.setAttribute("postid", newpp[currentPost].id);
	    	setOffset(newpp[currentPost]);
	    }
	
	    function setOffset(aElement) {
	    	var elTop = getOffsetTop(aElement);
	    	var html = doc.documentElement;
	    	var maxHtmlTop = html.scrollHeight - html.clientHeight;
	    	var htmlTopOld = html.scrollTop;
	    	var htmlTopNew;
	    	if (aElement.offsetHeight > html.clientHeight) {
	    		htmlTopNew = elTop;
	    	} else {
	    		var htmlHalfHeight = Math.round(html.clientHeight / 2);
	    		htmlTopNew = elTop - htmlHalfHeight + Math.round(aElement.offsetHeight / 2);
	    	}
	    	if(htmlTopNew > maxHtmlTop) {
	    		htmlTopNew = maxHtmlTop;
	    	}
	    	navLinkNext.setAttribute("offset", htmlTopNew);
	    	navLinkPrev.setAttribute("offset", htmlTopNew);
    	}
	
	    function getOffsetTop(aElement) {
	    	var offsetTop = aElement.offsetTop;
	    	while(aElement.offsetParent && aElement.offsetParent.offsetTop) {
	    		aElement = aElement.offsetParent;
	    		offsetTop += aElement.offsetTop;
	    	}
	    	return offsetTop;
	    }
	}
}

lpr2bridge._lpr2Instance._scripts.push(new lpr2userscript_newComments());