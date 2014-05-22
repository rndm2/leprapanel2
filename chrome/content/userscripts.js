var lpr2userscripts = {
		
	about: function() {
		var selected = document.getElementById("LepraPanel2-UserScript-List").selectedItem;
		if (selected) {
			console.log(selected.children[0]);
			var name = selected.children[0].id.replace(/[\S]+[\-]/, '');
			if (name) {
				console.log(name);
				openDialog('chrome://leprapanel2/content/userscripts/' + name + '.xul', '', 'chrome,titlebar,toolbar,centerscreen,modal');
			}
		}
	},
	
	open: function(aUrl) {
		var windowMediator = Components.classes["@mozilla.org/appshell/window-mediator;1"].getService(Components.interfaces.nsIWindowMediator);
		var currentWindow = windowMediator.getMostRecentWindow("navigator:browser") || windowMediator.getMostRecentWindow("emusic:window");
		if (currentWindow) {
			try {
				currentWindow.delayedOpenTab(aUrl);
			} catch(e) {
				currentWindow.loadURI(aUrl);
			}
		} else {
			var protocolService = Components.classes["@mozilla.org/uriloader/external-protocol-service;1"].getService(Components.interfaces.nsIExternalProtocolService);
			var uri = Components.classes["@mozilla.org/network/io-service;1"].getService(Components.interfaces.nsIIOService).newURI(aUrl, null, null);
			protocolService.loadURI(uri, null);
		}

	}
	
};