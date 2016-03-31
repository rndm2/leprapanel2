function lpr2userscript_goodLatvia() {}

lpr2userscript_goodLatvia.prototype = {
		
	name: 'goodLatvia',
	
	include: new RegExp(":\/\/([a-zA-Z0-9]+\.)?leprosorium\.ru\/users\/\\S+"),
	
	run: function(window, document, $) {
		var $latvia = $('#js-profile_latvian');
		
		if ($latvia.length === 0) return;
		
		$latvia.css({opacity: 0, visibility: 'hidden'});
		
		var handleNewHtml = function(e) {
			var $target = $('.b-user_stat').eq(0);

			if ($target.not('.with-latvia').length > 0) {
				$showLink = $('<a />', {
					'class': 'latvian-link',
					href: 'javascript:void(0);',
					onclick: "$(\'js-profile_latvian\').setStyle(\'visibility\', \'visible\').removeClass('hidden').tween(\'opacity\', 0, 100);return false;",
					text: 'Пользователь — Латыш (нажмите чтобы показать чёрную конину)',
					style: 'color: red'
				});
			
				$target.addClass('with-latvia');
				$target.prepend('<br />');
				$target.append('<br />');
				$target.append('<br />');
				$target.append($showLink);
			}
		};
	    
		handleNewHtml();
		
		document.addEventListener('DOMNodeInserted', handleNewHtml, false);
	}
}

lpr2bridge._lpr2Instance._scripts.push(new lpr2userscript_goodLatvia());