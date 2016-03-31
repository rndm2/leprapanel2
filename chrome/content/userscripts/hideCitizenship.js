function lpr2userscript_hideCitizenship() {}

lpr2userscript_hideCitizenship.prototype = {
		
	name: 'hideCitizenship',
	
	include: new RegExp(":\/\/([a-zA-Z0-9]+\.)?leprosorium\.ru\/users\/\\S+"),
	
	run: function(window, document, $) {
		var handleNewHtml = function(e) {
			if ($('.b-user_citizen').length === 0) return;

			$('.b-user_citizen').remove();
		};
	    
	    handleNewHtml();
	    
		document.addEventListener('DOMNodeInserted', handleNewHtml, false);
	
	}
}

lpr2bridge._lpr2Instance._scripts.push(new lpr2userscript_hideCitizenship());