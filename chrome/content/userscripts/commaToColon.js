function lpr2userscript_commaToColon() {}

lpr2userscript_commaToColon.prototype = {
		
	name: 'commaToColon',
	
	include: new RegExp(":\/\/([a-zA-Z0-9]+\.)?leprosorium\.ru"),
	
	run: function(document, $) {
		var comma_to_colon = function() {
	        var source = window.commentForm.prototype.show.toString().replace("this.container.getElement('textarea').value = this.options.comment_user_name ? this.options.comment_user_name + ', ' : '';","this.container.getElement('textarea').value = this.options.comment_user_name ? this.options.comment_user_name + ': ' : '';");
	        eval('window.commentForm.prototype.show = ' + source);
	    };

	    var script = document.createElement('script'); 
	    script.type = "text/javascript"; 
	    script.innerHTML = "("+comma_to_colon.toString()+")()";
	    document.getElementsByTagName('head')[0].appendChild(script);
	}
}

lpr2bridge._lpr2Instance._scripts.push(new lpr2userscript_commaToColon());