function lpr2userscript_commentAndRatingFont() {}

lpr2userscript_commentAndRatingFont.prototype = {
		
	name: 'commentAndRatingFont',
	
	include: new RegExp(":\/\/([a-zA-Z0-9]+\.)?leprosorium\.ru\/comments\/\\d+"),
	
	run: function(window, document, $) {
		var css = '.c_vote .vote_result { width: auto; min-width: 24px; padding: 0 4px; }' +
				  '.vote-big-38 .vote_button { right: 2px; }' + 
				  '.vote-big-48 .vote_button { right: 7px; }';
		
		var style = document.createElement('style');
		style.type = 'text/css';
		style.innerHTML = css;
		document.body.appendChild(style);
		 
		var $votes = $('.comment .vote_result', document);
		
		$votes.each(function() {
			var rating = parseInt(this.innerHTML);
			
			if (rating > 0) {
				var fontSize = Math.min(16, 9 + Math.round(0.3 * Math.sqrt(Math.abs(rating * 4))));
				this.style.fontSize = fontSize + 'px';
				
				if (fontSize == 16) {
					if (rating > 999) {
						this.parentNode.className += ' vote-big-48';
					} else {
						this.parentNode.className += ' vote-big-38';
					}
				}

				if (rating > 999) this.style.color = '#ff0000';
    			if (rating > 512 && rating <= 999) this.style.color = '#cc0000';
    			if (rating > 255 && rating <= 512) this.style.color = '#990000';
    			if (rating > 156 && rating <= 255) this.style.color = '#000000';
    			if (rating > 64 && rating <= 156) this.style.color = '#666666';
			} else {
				if (rating <= -5 && rating > -42) this.style.color = '#aaaa33';
    			if (rating <= -42 && rating > -100) this.style.color = '#bb8833';
    			if (rating <= -100 && rating > -150) this.style.color = '#aa7733';
    			if (rating <= -150 && rating > -250) this.style.color = '#aa5533';
    			if (rating <= -250) this.style.color = '#993333';	
			}
		});
	}
}

lpr2bridge._lpr2Instance._scripts.push(new lpr2userscript_commentAndRatingFont());