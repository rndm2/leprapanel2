function lpr2userscript_placeKarmaButtons() {}

lpr2userscript_placeKarmaButtons.prototype = {
		
	name: 'placeKarmaButtons',
	
	include: new RegExp(":\/\/([a-zA-Z0-9]+\.)?leprosorium\.ru\/users\/\\S+"),
	
	run: function(window, document, $) {
		var handleNewHtml = function(e) {
			if ($('.b-user_votes_wrapper').length === 0 || $('.b-user_votes_wrapper').hasClass('karma-processed')) return;

			document.removeEventListener('DOMNodeInserted', handleNewHtml);

			$('.b-user_votes_wrapper').addClass('karma-processed');
			$('.b-karma_controls').css('display', 'block');
			$('.b-karma_value').css('display', 'block');
			$('.b-karma_controls').eq(0).insertAfter($('.b-karma_controls').eq(1));
			$('.b-karma_controls').eq(0).insertBefore($('.b-karma_value'));

			document.addEventListener('DOMNodeInserted', handleNewHtml, false);
		};
	    
	    handleNewHtml();
	    
		document.addEventListener('DOMNodeInserted', handleNewHtml, false);

		var css = 'i.b-karma_button { width: 20px; height: 20px; font-size: 14px; line-height: 18px;}';

		var style = document.createElement('style');
		style.type = 'text/css';
		style.textContent = css;
		document.body.appendChild(style); 
	}
}

lpr2bridge._lpr2Instance._scripts.push(new lpr2userscript_placeKarmaButtons());