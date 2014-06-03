function lpr2userscript_up() {}

lpr2userscript_up.prototype = {
		
	name: 'up',
	
	include: new RegExp(":\/\/([a-zA-Z0-9]+\.)?leprosorium\.ru"),
	
	run: function(window, document, $) {
		var css = '.lp-up-block { position: fixed; bottom: 10px; right: 0px; z-index: 100; }' + 
 					'.lp-up-block input { display: block; width: 28px; height: 28px; color: #000; background-color: #fff; border: 1px solid #000; padding: 0pt; margin: 0pt; margin-bottom: 1px; cursor: pointer; opacity: 0.25; }' +
 					'.lp-up-block input:hover { opacity: 1; }'; 
		
		var style = document.createElement('style');
		style.type = 'text/css';
		style.innerHTML = css;
		document.body.appendChild(style);

    	var upBlock = $(document.createElement('div')).addClass('lp-up-block')[0];

    	var upLink = $('<input />').attr({
    		type: 'button',
    		value: '↑',
    		onclick: 'new Fx.Scroll(window, {duration: \'short\'}).start(0, 0); this.blur();'
    	})[0];
    	
    	upBlock.appendChild(upLink);
    	document.body.appendChild(upBlock);
    	
		var hostFunction = function() {
	    	window.__lpUpTimeout = false;
	    	
	    	window.addEventListener('scroll', function() {
	    		clearTimeout(window.__lpUpTimeout);
	    		window.__lpUpTimeout = setTimeout(function() {
		    		var $block = $$('.lp-up-block'); 
		    		$block.get('tween')[0].cancel();
	    			$block.fade(document.documentElement.scrollTop > 100 ? 'in' : 'out');
	    		}, 100);	
	    	}, false);
		}
		var code = 'function LP_upInit' + hostFunction.toString().substring(8);
		code += '; LP_upInit();';
		
		var script = document.createElement('script');
    	script.type = "text/javascript";
    	script.innerHTML = code;
    	document.getElementsByTagName('head')[0].appendChild(script);
	}
}

lpr2bridge._lpr2Instance._scripts.push(new lpr2userscript_up());