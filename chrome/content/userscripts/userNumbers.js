function lpr2userscript_userNumbers() {}

lpr2userscript_userNumbers.prototype = {
		
	name: 'userNumbers',
	
	include: new RegExp(":\/\/([a-zA-Z0-9]+\.)?leprosorium\.ru"),
	
	run: function(document, $) {
	    document.addEventListener("DOMNodeInserted", handleComment, false);

	    function makeNumbers() {
	        $('.user_number', document).remove();

	        $('.ddi', document).each(function() {
	            $(this).find('.js-date').before('<span class="user_number"> ' + $(this).find('.c_user').data('user_id') + ', </span>\n');
	        });
	    }
	    
	    function handleComment(event) {
	        var check = $(event.target).find('.ddi');
	        if (check.length > 0) {
	            makeNumbers();
	        }
	    }

	    makeNumbers();
	}
}

lpr2bridge._lpr2Instance._scripts.push(new lpr2userscript_userNumbers());