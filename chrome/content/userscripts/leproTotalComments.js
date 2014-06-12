function lpr2userscript_leproTotalComments() {}

lpr2userscript_leproTotalComments.prototype = {
		
	name: 'leproTotalComments',
	
	include: new RegExp(":\/\/([a-zA-Z0-9]+\.)?leprosorium\.ru"),
	
	run: function(window, document, $) {

	}
}

lpr2bridge._lpr2Instance._scripts.push(new lpr2userscript_leproTotalComments());