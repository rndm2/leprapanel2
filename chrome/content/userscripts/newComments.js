function lpr2userscript_newComments() {}

lpr2userscript_newComments.prototype = {
		
	name: 'newComments',
	
	include: new RegExp(':\/\/([a-zA-Z0-9]+\.)?leprosorium\.ru\/(comments\/\\d+|my\/inbox\/\\d+)'),
	
	run: function(window, document, $) {
		var currentPost = -1;
		var navLinkNext;
		var navLinkPrev;
		
	    var css = 	'.lp-nc-block { position: fixed; top: 90px; right: 0px; z-index: 100; }' + 
	      			'.lp-nc-block input { display: block; width: 28px; height: 28px; color: #000; background-color: #fff; border: 1px solid #000; padding: 0pt; margin: 0pt; margin-bottom: 1px; cursor: pointer; opacity: 0.25; }' +
	      			'.lp-nc-block input:hover { opacity: 1; }';
	    var hostFunction = function(_this) {
	    	var event = document.createEvent('HTMLEvents');
			event.initEvent('handledNewComments', true, true);
			_this.dispatchEvent(event);
        	_this.blur();
        	var postId = _this.getAttribute('data-post-id');
        	var offset = parseInt(_this.getAttribute('data-offset'));
        	var p = $(postId);
        	var f = new Fx.Scroll(window, {duration: 'short'});
        	if (!p || !offset || !f) return;
        	f.start(0, offset);
        	(function(){
    			p.childNodes[1].highlight('#f4fbac');
    		}).delay(250);
	    }
	    var code = 'function LP_scrollTo' + hostFunction.toString().substring(8);
	    
	    var $comments = $('.comment.new', document);
	    
	    if ($comments.length > 0) {
	    	var style = document.createElement('style');
	    	style.type = 'text/css';
	    	style.innerHTML = css;
	    	document.body.appendChild(style);
	    	
	    	var script = document.createElement('script');
	    	script.type = "text/javascript";
	    	script.innerHTML = code;
	    	document.getElementsByTagName('head')[0].appendChild(script); 
	    	
	    	var navBlock = $(document.createElement('div')).addClass('lp-nc-block')[0];

	    	navLinkNext = $('<input />').attr({
	    		type: 'button',
	    		value: '↓',
	    		onclick: 'LP_scrollTo(this);',
	    		'data-post-id': $comments[0].id
	    	})[0];
	    	navLinkNext.addEventListener('handledNewComments', function() {
	    		navigate(1);
	    	}, false);
	    	
	    	navLinkPrev = $('<input />').attr({
	    		type: 'button',
	    		value: '↑',
	    		onclick: 'LP_scrollTo(this);',
	    		'data-post-id': $comments[0].id
	    	})[0];
	    	navLinkPrev.addEventListener('handledNewComments', function() {
	    		navigate(-1);
	    	}, false);

	    	navBlock.appendChild(navLinkPrev);
	    	navBlock.appendChild(navLinkNext);
	    	document.body.appendChild(navBlock);
	    	
	    	setOffset($comments[currentPost]);
	    }

	    function navigate(dir) {
	    	if (dir > 0) {
	    		currentPost++;
	    		if (currentPost >= $comments.length) {
	    			currentPost = $comments.length - 1;
	    		}
	    	} else {
	    		currentPost--;
	    		if (currentPost < 0) {
	    			currentPost = 0;
	    		}
	    	}
	    	navLinkNext.setAttribute("data-post-id", $comments[currentPost].id);
	    	navLinkPrev.setAttribute("data-post-id", $comments[currentPost].id);
	    	setOffset($comments[currentPost]);
	    }
	
	    function setOffset(element) {
	    	if (!element) return;
	    	var elTop = getOffsetTop(element);
	    	var html = document.documentElement;
	    	var maxHtmlTop = html.scrollHeight - html.clientHeight;
	    	var htmlTopOld = html.scrollTop;
	    	var htmlTopNew;
	    	if (element.offsetHeight > html.clientHeight) {
	    		htmlTopNew = elTop;
	    	} else {
	    		var htmlHalfHeight = Math.round(html.clientHeight / 2);
	    		htmlTopNew = elTop - htmlHalfHeight + Math.round(element.offsetHeight / 2);
	    	}
	    	if (htmlTopNew > maxHtmlTop) {
	    		htmlTopNew = maxHtmlTop;
	    	}
	    	navLinkNext.setAttribute('data-offset', htmlTopNew);
	    	navLinkPrev.setAttribute('data-offset', htmlTopNew);
    	}
	
	    function getOffsetTop(element) {
	    	var offsetTop = element.offsetTop;
	    	while (element.offsetParent && element.offsetParent.offsetTop) {
	    		element = element.offsetParent;
	    		offsetTop += element.offsetTop;
	    	}
	    	return offsetTop;
	    }
	}
}

lpr2bridge._lpr2Instance._scripts.push(new lpr2userscript_newComments());