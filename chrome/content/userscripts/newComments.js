function lpr2userscript_newComments() {}

lpr2userscript_newComments.prototype = {
		
	name: 'newComments',
	
	include: new RegExp(':\/\/([a-zA-Z0-9]+\.)?leprosorium\.ru\/(comments\/\\d+|my\/inbox\/\\d+)'),
	
	run: function(window, document, $) {
		var currentPostNew = -1;
		var currentPostMine = -1;
		
		var navLinkNext;
		var navLinkPrev;
		
	    var css = 	'.lp-nc-block { position: fixed; top: 90px; right: 0px; z-index: 100; }' + 
	      			'.lp-nc-block input { display: block; width: 28px; height: 28px; color: #000; background-color: #fff; border: 1px solid #000; padding: 0pt; margin: 0pt; margin-bottom: 1px; cursor: pointer; opacity: 0.25; }' +
	      			'.lp-nc-block input:hover { opacity: 1; }';
	    
	    var hostFunction = function(e, targetEl) {
	    	var lpMode = e.shiftKey || e.ctrlKey ? 'mine' : 'new';
	    	var event = document.createEvent('HTMLEvents');
	    	event.initEvent('handleNewComments', true, false);
	    	targetEl.setAttribute('lpMode', lpMode);
			targetEl.dispatchEvent(event);
        	targetEl.blur();
        	
        	if (lpMode == 'new') {
        		var postId = window.__lpPostNewId;
            	var offset = parseInt(window.__lpPostNewOffset);	
        	} else {
        		var postId = window.__lpPostMineId;
            	var offset = parseInt(window.__lpPostMineOffset);
        	}
        	
        	var p = $(postId);
        	var f = new Fx.Scroll(window, {duration: 'short'});
        	if (!p || !offset || !f) return;
        	f.start(0, offset);
        	(function(){
    			p.childNodes[1].highlight('#f4fbac');
    		}).delay(250);
	    }
	    var code = 'function LP_scrollTo' + hostFunction.toString().substring(8);
	    
	    var $newComments = $('.comment.new', document);
	    var $mineComments = $('.comment.mine', document);
	    
	    if ($newComments.length > 0 || $mineComments.length > 0) {
	    	var style = document.createElement('style');
	    	style.type = 'text/css';
	    	style.innerHTML = css;
	    	document.body.appendChild(style);
	    	
	    	var script = document.createElement('script');
	    	script.type = "text/javascript";
	    	script.innerHTML = code;
	    	document.getElementsByTagName('head')[0].appendChild(script);
	    	
	    	var navBlock = $('<div />', {'class': 'lp-nc-block'})[0];

	    	navLinkNext = $('<input />', {type: 'button', value: '↓', onclick: 'LP_scrollTo(event, this);'})[0];
	    	navLinkNext.addEventListener('handleNewComments', function(e) { navigate(1, e.target.getAttribute('lpMode')); });
	    	
	    	navLinkPrev = $('<input />', {type: 'button', value: '↑', onclick: 'LP_scrollTo(event, this);'})[0];
	    	navLinkPrev.addEventListener('handleNewComments', function(e) { navigate(-1, e.target.getAttribute('lpMode')); });

	    	navBlock.appendChild(navLinkPrev);
	    	navBlock.appendChild(navLinkNext);
	    	document.body.appendChild(navBlock);
	    }
	    
	    if ($newComments.length > 0) {
	    	unsafeWindow.__lpPostNewId = $newComments[0].id;
	    	setOffset($newComments[currentPostNew], 'new');
	    }
	    
	    if ($mineComments.length > 0) {
	    	unsafeWindow.__lpPostMineId = $mineComments[0].id;
	    	setOffset($mineComments[currentPostMine], 'mine');
	    }

	    function navigate(dir, mode) {
	    	var currentCounter = (mode == 'new' ? currentPostNew : currentPostMine);
	    	var $targetComments = (mode == 'new' ? $newComments : $mineComments);
	    	var commentsLength = $targetComments.length;
	    	
	    	if (commentsLength == 0) return;
	    	
	    	if (dir > 0) {
	    		currentCounter++;
	    		if (currentCounter >= commentsLength) {
	    			currentCounter = commentsLength - 1;
	    		}
	    	} else {
	    		currentCounter--;
	    		if (currentCounter < 0) {
	    			currentCounter = 0;
	    		}
	    	}

	    	if (mode == 'new') {
	    		currentPostNew = currentCounter;
	    		unsafeWindow.__lpPostNewId = $newComments[currentPostNew].id;
	    	} else {
	    		currentPostMine = currentCounter;
	    		unsafeWindow.__lpPostMineId = $mineComments[currentPostMine].id;
	    	}
	    	
	    	setOffset($targetComments[currentCounter], mode);
	    }
	
	    function setOffset(element, mode) {
	    	if (!element) return;
    	
	    	var getOffsetTop = function(el) {
		    	var offsetTop = el.offsetTop;
		    	while (el.offsetParent && el.offsetParent.offsetTop) {
		    		el = el.offsetParent;
		    		offsetTop += el.offsetTop;
		    	}
		    	return offsetTop;
		    }
		    
	    	var elTop = getOffsetTop(element);
	    	
	    	var html = document.documentElement;
	    	var maxHtmlTop = html.scrollHeight - html.clientHeight;
	    	var htmlTopOld = html.scrollTop;
	    	var htmlTopNew;
	    	
	    	if (element.offsetHeight > html.clientHeight) {
	    		htmlTopNew = elTop;
	    	} else {
	    		htmlTopNew = elTop - (Math.round(html.clientHeight / 2)) + Math.round(element.offsetHeight / 2);
	    	}
	    	
	    	if (htmlTopNew > maxHtmlTop) {
	    		htmlTopNew = maxHtmlTop;
	    	}
	    	
	    	if (mode == 'new') {
	    		unsafeWindow.__lpPostNewOffset = htmlTopNew;
	    	} else {
	    		unsafeWindow.__lpPostMineOffset = htmlTopNew;
	    	}
    	}
	}
}

lpr2bridge._lpr2Instance._scripts.push(new lpr2userscript_newComments());