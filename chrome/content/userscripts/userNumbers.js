function lpr2userscript_userNumbers() {}

lpr2userscript_userNumbers.prototype = {
		
	name: 'userNumbers',
	
	include: new RegExp(":\/\/([a-zA-Z0-9]+\.)?leprosorium\.ru"),
	
	run: function(window, document, $) {
		var $wrapper = $('<span />', {'class': 'user-number'});

		var handleNewHtml = function(e) {
			var $html = $(e.target);
			if ($html.find('.ddi').length > 0) {
				makeNumbers(e.target);
			}
		};
		
		var makeNumbers = function(context) {
			context = context || document;

			$('.ddi .user-number', context).remove();

	        $('.ddi .c_user', context).each(function() {
	        	$(this).after($wrapper.clone().text(' [' + this.getAttribute('data-user_id') + ']'));
	        });
		}
	    
	    makeNumbers();
	    
		document.addEventListener('DOMNodeInserted', handleNewHtml, false);
	}
}

lpr2bridge._lpr2Instance._scripts.push(new lpr2userscript_userNumbers());