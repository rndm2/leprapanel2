function lpr2userscript_transparentImages() {}

lpr2userscript_transparentImages.prototype = {
		
	name: 'transparentImages',
	
	include: new RegExp(":\/\/([a-zA-Z0-9]+\.)?leprosorium\.ru"),
	
	run: function(doc, $) {
		 var css = 'div.post .dt img { opacity: 0.25; } \
		      		div.post .dt img:hover { opacity: 1; }';

		 var style = doc.createElement("STYLE");
		 style.type = "text/css";
		 style.innerHTML = css;
		 doc.body.appendChild(style);
	}
}

lpr2bridge._lpr2Instance._scripts.push(new lpr2userscript_transparentImages());


