function lpr2userscript_commaToColon() {}

lpr2userscript_commaToColon.prototype = {
		
	name: 'commaToColon',
	
	include: new RegExp(":\/\/([a-zA-Z0-9]+\.)?leprosorium\.ru"),
	
	run: function(window, document, $) {

		var handleNewHtml = function(e) {
			$('.c_answer', e ? e.target : document).each(function() {
				var handler = function(e) {
					var $textarea = $(this).closest('.comment').find('.b-comments_add_textarea textarea');
					
					if ($textarea.length === 0 || $textarea.attr('data-processed')) {
						return;
					}
					
					var text = $textarea.val();
					
					if (text && text.search(/[\wа-яА-Я]+,/) === 0) {
						var splitted = text.split(/,\s$/);
						if (splitted.length > 0) {
							$textarea.val(splitted[0] + ': ').attr('data-processed', true);	
						}
					}
		    	};
				
				this.addEventListener('click', handler);
				this.addEventListener('mousemove', handler);
				this.addEventListener('mouseout', handler);
			});	
		};
		
		handleNewHtml();
		
		document.addEventListener('DOMNodeInserted', handleNewHtml, false);
	}
}

lpr2bridge._lpr2Instance._scripts.push(new lpr2userscript_commaToColon());