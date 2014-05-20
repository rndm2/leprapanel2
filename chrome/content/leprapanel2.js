(function($) {
	
	var Lpr2Bridge = function() {
		
		this._preferencesService = undefined;
		this._observerService = undefined;
		this._cookieService = undefined;
		this._ioService = undefined;
		
		this._timer = undefined;
		
		this.settings = {};
		
		this.user = {
			logged: false,
			uid: undefined,
			sid: undefined,
			username: '',
			karma: '',
			rating: '',
			stuff: '',
			inbox: '',
			attitude: {
				karma: undefined,
				rating: undefined
			}
		};
		
		this.config = {
			id: 'leprapanel2@random.net.ua',
			url: {
				home: "http://leprosorium.ru/",
				api: "http://leprosorium.ru/api/lepropanel"
			},
			dataKeys: [
			    'username',
			    'karma',
			    'rating',
			    'stuff',
			    'inbox'
			],
			layout: {
				blocks: {
					statusBar: '#LepraPanel2-Statusbar',
					greetingBox: '#LepraPanel2-Statusbar #LepraPanel2-hbox-greeting',
					ratingBox: '#LepraPanel2-Statusbar #LepraPanel2-hbox-rating',
					stuffBox: '#LepraPanel2-Statusbar #LepraPanel2-hbox-stuff',
					forLogged: '.LepraPanel2-Holder .for-logged',
					forNotLogged: '.LepraPanel2-Holder .for-not-logged',
					names: '.LepraPanel2-Holder [name="%s"]'
				},
				elements: {
					karma: '#LepraPanel2-Statusbar #LepraPanel2-persist-karma-image',
					rating: '#LepraPanel2-Statusbar #LepraPanel2-persist-rating-image',
					stuff: '#LepraPanel2-Statusbar #LepraPanel2-persist-stuff-image',
					inbox: '#LepraPanel2-Statusbar #LepraPanel2-persist-inbox-image'
				},
				images: {
					minus: "chrome://leprapanel2/skin/bullet-minus.png",
					plus: "chrome://leprapanel2/skin/bullet-plus.png",
					stuff: "chrome://leprapanel2/skin/stuff.png",
					inbox: "chrome://leprapanel2/skin/inbox.png",
					stuffActive: "chrome://leprapanel2/skin/stuff-active.png",
					inboxActive: "chrome://leprapanel2/skin/inbox-active.png"				
				}
			}
		}
	}

	Lpr2Bridge.prototype.init = function() {
		this._preferencesService = Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefService).getBranch("extensions.leprapanel2.");
		this._observerService = Components.classes["@mozilla.org/observer-service;1"].getService(Components.interfaces.nsIObserverService);
		this._cookieService = Components.classes["@mozilla.org/cookieService;1"].getService(Components.interfaces.nsICookieService);
		this._ioService = Components.classes["@mozilla.org/network/io-service;1"].getService(Components.interfaces.nsIIOService);

		this._runLevel0();
		this._runLevel1();
		this._runLevel2();
	}
	
	Lpr2Bridge.prototype._runLevel0 = function() {
		this._loadPreferences();
		this._prepareUI();
	}
	
	Lpr2Bridge.prototype._runLevel1 = function() {
		this._getSession();
		this._checkSession();
		if (this.user.logged) {
			this._getLocalData();
			this._getRemoteData(true);
			this._schedule();
		}
	}
	
	Lpr2Bridge.prototype._runLevel2 = function() {
		this._registerObservers();	
	}

	Lpr2Bridge.prototype._registerObservers = function() {
	    this._preferencesService.QueryInterface(Components.interfaces.nsIPrefBranch2);
	    this._preferencesService.addObserver('', this, false);
	    this._preferencesService.QueryInterface(Components.interfaces.nsIPrefBranch);
	    this._observerService.addObserver(this, "cookie-changed", null);
	},
	
	Lpr2Bridge.prototype._unregisterObservers = function() {
		this._preferencesService.removeObserver("", this);
		this._observerService.removeObserver(this, "cookie-changed");
	},
	
	Lpr2Bridge.prototype.observe = function(aSubject, aTopic, aData) {
		switch(aTopic) {
			case 'cookie-changed':
				this._runLevel0();
				this._runLevel1();
				break;
			case 'nsPref:changed':
				this._runLevel0();
				break;
		}
	},
	  
	Lpr2Bridge.prototype._loadPreferences = function() {
		var list = this._preferencesService.getChildList("");
		for (var i = 0; i < list.length; i++) {
			var type = this._preferencesService.getPrefType(list[i]);
			var value;
			switch(type) {
				case 64:
					value = this._preferencesService.getIntPref(list[i]); 
					break;
				case 128:
					value = this._preferencesService.getBoolPref(list[i]);
					break;
			}
			this.settings[list[i]] = value;
		}
		if (this.settings.checkPeriod <= 0) this.settings.checkPeriod = 5;
	}

	Lpr2Bridge.prototype._prepareUI = function() {
		$(this.config.layout.blocks.greetingBox)[0].hidden = !this.settings.greeting;
		$(this.config.layout.blocks.ratingBox)[0].hidden = !this.settings.checkRatings;
		$(this.config.layout.blocks.stuffBox)[0].hidden = !this.settings.checkStuff;
	}

	Lpr2Bridge.prototype._getSession = function() {
		var uri = this._ioService.newURI(this.config.url.home, null, null);
		var cookie = this._cookieService.getCookieString(uri, null);
		var uid;
		var sid;
		if (cookie) {
			uid = cookie.match(/uid=([0-9]+)/);
			sid = cookie.match(/sid=([A-Za-z0-9]+)/);
		}
		if (uid && sid && uid[1] && sid[1]) {
			this.user.logged = true;
			this.user.uid = uid[1];
			this.user.sid = sid[1];
		} else {
			this.user.logged = false;
		}
	}

	Lpr2Bridge.prototype._checkSession = function() {
		$(this.config.layout.blocks.forLogged).attr('hidden', !this.user.logged);
		$(this.config.layout.blocks.forNotLogged).attr('hidden', !!this.user.logged);
	}
	
	Lpr2Bridge.prototype._getLocalData = function() {
		var keys = this.config.dataKeys;
		var $el;
		for (var i = 0; i < keys.length; i++) {
			$el = $(this.config.layout.blocks.names.replace('%s', keys[i]));
			if ($el.length > 0) {
				this.user[keys[i]] = $el.val();
			}
		}
	}
	
	Lpr2Bridge.prototype._setLocalData = function(set) {
		var keys = this.config.dataKeys;
		var $el;
		var attitude;
		for (var i = 0; i < keys.length; i++) {
			$el = $(this.config.layout.blocks.names.replace('%s', keys[i]));
			if ($el.length > 0) {
				if (this.user.attitude.hasOwnProperty(keys[i])) {
					attitude = this.user.attitude[keys[i]];
					if (typeof attitude != 'undefined') {
						if (!this.settings.thirdOption) {
							$(this.config.layout.elements[keys[i]]).attr('src', attitude ? this.config.layout.images.minus : this.config.layout.images.plus);	
						}						
						this.user.attitude[keys[i]] = undefined;
					} else {
						continue;
					}
				}
				if (keys[i] == 'stuff' || keys[i] == 'inbox') {
					$(this.config.layout.elements[keys[i]]).attr('src', this.user[keys[i]] == '' ? this.config.layout.images[keys[i]] : this.config.layout.images[keys[i] + 'Active']);
				}
				$el.attr('hidden', this.user[keys[i]] == '').val(this.user[keys[i]]);
			}
		}
	}

	Lpr2Bridge.prototype._getRemoteData = function(full) {
		var _this = this;
		console.log('Called');
		$.getJSON(this.config.url.api, function(answer) {
			_this._writeData(answer);
			_this._setLocalData();
		});
		if (full) {
			$.getJSON(this.config.url.api + '/' + this.user.uid, function(answer) {
				_this._writeData(answer);
				_this._setLocalData();
			});	
		}
	}
	
	Lpr2Bridge.prototype._writeData = function(data) {
		if (!data) {
			return false;
		}
		if (data.hasOwnProperty('karma') && data.karma != this.user.karma) {
			this.user.attitude.karma = this.user.karma > data.karma;
			this.user.karma = data.karma;
		}
		if (data.hasOwnProperty('rating') && data.rating != this.user.rating) {
			this.user.attitude.rating = this.user.rating > data.rating;
			this.user.rating = data.rating;
		}
		if (data.hasOwnProperty('myunreadposts')) {
			this.user.stuff = data.myunreadposts > 0 ? (data.myunreadposts + '/' + data.myunreadcomms) : (data.myunreadcomms > 0 ? data.myunreadcomms : '');
		}
		if (data.hasOwnProperty('inboxunreadposts')) {
			this.user.inbox = data.inboxunreadposts > 0 ? (data.inboxunreadposts + '/' + data.inboxunreadcomms) : (data.inboxunreadcomms > 0 ? data.inboxunreadcomms : '');
		}
		if (data.hasOwnProperty('login')) {
			this.user.username = data.login;
		}
	}
	
	Lpr2Bridge.prototype._schedule = function(e) {
		if (this.user.logged != true || (this.settings.checkRatings != true && this.settings.checkStuff)) return false;
		var _this = this;
		clearInterval(this._timer);
		this._timer = setInterval(function() {
			_this._getRemoteData();
		}, this.settings.checkPeriod * 60 * 1000);
	}
	
	Lpr2Bridge.prototype.navigate = function(e) {
		var url = e.target.getAttribute('data-href');
		if (url.length > 0) {
			openUILink(url, e, false, true);
		}
	}
	
	Lpr2Bridge.prototype.showSettings = function() {
		BrowserOpenAddonsMgr("addons://detail/" + encodeURIComponent(this.config.id));
	}
	
	Lpr2Bridge.prototype.reloadData = function() {
		this._getRemoteData(true);
	}
	
	Lpr2Bridge.prototype.destroy = function() {
		this._unregisterObservers();	
	}
	
	window.lpr2bridge = new Lpr2Bridge();

	window.addEventListener('load', function() {
		lpr2bridge.init();
	}, false);

	window.addEventListener('unload', function() {
		lpr2bridge.destroy();
	}, false);

})(Zepto);