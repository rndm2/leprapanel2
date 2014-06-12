function lpr2userscript_eraseFromStuff() {}

lpr2userscript_eraseFromStuff.prototype = {
		
	name: 'eraseFromStuff',
	
	include: new RegExp(":\/\/([a-zA-Z0-9]+\.)?leprosorium\.ru"),
	
	run: function(window, document, $) {
		var handleNewHtml = function(e) {
			var $targets = $('.b-post_my_post_controls_button_out_interest', e ? e.target : document);
			
			if ($targets.length > 0) {
				$targets.text('стереть из моих вещей');
			}
		};
	    
		handleNewHtml();
		
		document.addEventListener('DOMNodeInserted', handleNewHtml, false);
	}
}

lpr2bridge._lpr2Instance._scripts.push(new lpr2userscript_eraseFromStuff());