function lpr2userscript_commentAndRatingFont() {}

lpr2userscript_commentAndRatingFont.prototype = {
		
	name: 'commentAndRatingFont',
	
	include: new RegExp(":\/\/([a-zA-Z0-9]+\.)?leprosorium\.ru\/comments\/\\d+"),
	
	run: function(doc, $) {
		var divs = doc.getElementsByTagName("div");
	    var divslen = divs.length;
	    var comment;
	    var rating;
	    var notPost = false;

	    for(var i = 0; i < divslen; i++) {
	    	comment = divs[i];

	    	if(comment.className.indexOf("comment") != -1 && comment.getAttribute('data-post_id') != null) {
	    		if (notPost) {
	    			rating = getRating(comment);

	    			if (rating > 99 && rating <= 999) {
	    				//comment.childNodes[1].childNodes[5].childNodes[3].style.width = "40px";
	    				//comment.childNodes[1].childNodes[5].childNodes[3].style.height = "18px";
	    				//comment.childNodes[1].childNodes[5].childNodes[3].childNodes[3].style.textAlign = "right";
	    			}
	    			if (rating > 999) {
	    				//comment.childNodes[1].childNodes[5].childNodes[3].style.width = "45px";
	    				//comment.childNodes[1].childNodes[5].childNodes[3].style.height = "18px";
	    				//comment.childNodes[1].childNodes[5].childNodes[3].childNodes[3].style.textAlign = "right";
	    				comment.childNodes[1].childNodes[5].childNodes[3].childNodes[3].style.color = "#ff0000";
	    			}
	    			if (rating>512 && rating<=999)
	    				comment.childNodes[1].childNodes[5].childNodes[3].childNodes[3].style.color = "#cc0000";
	    			if (rating>255 && rating<=512)
	    				comment.childNodes[1].childNodes[5].childNodes[3].childNodes[3].style.color = "#990000";
	    			if (rating>156 && rating<=255)
	    				comment.childNodes[1].childNodes[5].childNodes[3].childNodes[3].style.color = "#000000";
	    			if (rating>64 && rating<=156)
	    				comment.childNodes[1].childNodes[5].childNodes[3].childNodes[3].style.color = "#666666";
	    			if (rating>0)
	    				comment.childNodes[1].childNodes[5].childNodes[3].childNodes[3].style.fontSize = Math.min(16,9+Math.round(0.3*Math.sqrt(Math.abs(rating*4)))) + "px";
	    			if (rating<=-5 && rating>-42)
	    				comment.childNodes[1].childNodes[5].childNodes[3].childNodes[3].style.color = "#aaaa33";
	    			if (rating<=-42 && rating>-100)
	    				comment.childNodes[1].childNodes[5].childNodes[3].childNodes[3].style.color = "#bb8833";
	    			if (rating<=-100 && rating>-150)
	    				comment.childNodes[1].childNodes[5].childNodes[3].childNodes[3].style.color = "#aa7733";
	    			if (rating<=-150 && rating>-250)
	    				comment.childNodes[1].childNodes[5].childNodes[3].childNodes[3].style.color = "#aa5533";
	    			if (rating<=-250)
	    				comment.childNodes[1].childNodes[5].childNodes[3].childNodes[3].style.color = "#993333";
	    		} else {
	    			notPost = true;
	    		}
	    	}
	    }

	    function getRating(div) {
	    	var r = div.childNodes[1].childNodes[5].childNodes[3].childNodes[3].innerHTML;
	    	return parseInt(r, 10);
	    }
	}
}

lpr2bridge._lpr2Instance._scripts.push(new lpr2userscript_commentAndRatingFont());