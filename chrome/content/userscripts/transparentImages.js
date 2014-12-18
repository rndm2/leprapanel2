function lpr2userscript_transparentImages() {}

lpr2userscript_transparentImages.prototype = {
		
	name: 'transparentImages',
	
	include: new RegExp(":\/\/([a-zA-Z0-9]+\.)?leprosorium\.ru"),
	
	run: function(window, document, $) {
		 var css = 'div.post .dt img, #js-comments .comment_inner .c_body img { opacity: 0.25; } div.post .dt img:hover, #js-comments .comment_inner .c_body img:hover { opacity: 1; }';

		 var style = document.createElement('style');
		 style.type = 'text/css';
		 style.textContent = css;
		 document.body.appendChild(style);
	}
}

lpr2bridge._lpr2Instance._scripts.push(new lpr2userscript_transparentImages());