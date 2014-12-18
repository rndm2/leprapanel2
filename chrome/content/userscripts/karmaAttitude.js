function lpr2userscript_karmaAttitude() {}

lpr2userscript_karmaAttitude.prototype = {
		
	name: 'karmaAttitude',
	
	include: new RegExp(":\/\/([a-zA-Z0-9]+\.)?leprosorium\.ru\/users\/\\S+"),
	
	run: function(window, document, $) {
		if (!lpr2data) return;

		var $userIdHolder = $('.b-user_name-table script');
		var $userGenderHolder = $('.b-user_stat');
		
		if ($userIdHolder.length === 0 || $userGenderHolder.length === 0) return;
		
		var strings = {
			male: ['Не покушался на вашу карму (0)', 'Насрал вам в карму (%s)', 'Присунул вам в карму (+%s)'],
			female: ['Не покушалась на вашу карму (0)', 'Насрала вам в карму (%s)', 'Присунула вам в карму (+%s)']
		};
		
		var $stat = $('<div />', {'class': 'b-user_stat', css: {width: '100%', clear: 'both'}});
		var $icon = $('<i />', {'class': 'b-icon b-icon__arrow_point'});
		
		var userId = $userIdHolder[0].textContent.match(/[0-9]+/)[0];
		var userGender = $userGenderHolder[0].textContent.search('Написала') === -1 ? 'male' : 'female';
		var text = strings[userGender][0];
		
		if (userId === lpr2data.uid) return;
			
		for (var i = 0; i < lpr2data.karma_votes.length; i++) {
			if (lpr2data.karma_votes[i].uid === userId) {
				text = strings[userGender][lpr2data.karma_votes[i].attitude > 0 ? 2 : 1].replace('%s', lpr2data.karma_votes[i].attitude);
				break;
			}
		}
		
		$stat.append($icon);
		$stat.append($.escapeHTML(text));
		$('.b-info_block').after($stat);
	}
}

lpr2bridge._lpr2Instance._scripts.push(new lpr2userscript_karmaAttitude());