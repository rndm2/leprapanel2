function lpr2userscript_goodLatvia() {}

lpr2userscript_goodLatvia.prototype = {
		
	name: 'goodLatvia',
	
	include: new RegExp(":\/\/([a-zA-Z0-9]+\.)?leprosorium\.ru\/users\/\\S+"),
	
	run: function(window, document, $) {
		var $latvia = $('#js-profile_latvian');
		
		if ($latvia.length == 0) return;
		
		$latvia.css({opacity: 0, visibility: 'hidden'});
		
		$showLink = $('<a />', {
			href: 'javascript:void(0);',
			onclick: "$(\'js-profile_latvian\').setStyle(\'visibility\', \'visible\').tween(\'opacity\', 0, 100);return false;",
			text: 'Латыш'
		});
	
		$('.b-user_name-table .b-table-cell').not('.b-table-cell__notes').append($showLink);
	}
}

lpr2bridge._lpr2Instance._scripts.push(new lpr2userscript_goodLatvia());