(function($, window, document) {
	var Lpr2Bridge = function() {
		
		this._preferencesService = undefined;
		this._observerService = undefined;
		this._cookieService = undefined;
		this._fileService = undefined;
		
		this._storageData = {};
		
		this._timer = undefined;
		
		this._ready = {
			ui: false,
			uiAuth: false
		}
		
		this.settings = {};
		
		this.user = {
			changed: true,
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
				rating: undefined,
				data: {
					user: undefined,
					attitude: undefined
				}
			}
		};
		
		this.config = {
			id: 'leprapanel2@random.net.ua',
			url: {
				domain: 'leprosorium.ru',
				api: 'https://leprosorium.ru/ajax/api/lepropanel',
				users: 'https://leprosorium.ru/users/'
			},
			pattern: {
				
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
					bar: '#LepraPanel2-Bar',
					greetingBox: '.LepraPanel2-Holder #LepraPanel2-hbox-greeting',
					ratingBox: '.LepraPanel2-Holder #LepraPanel2-hbox-rating',
					stuffBox: '.LepraPanel2-Holder #LepraPanel2-hbox-stuff',
					forLogged: '.LepraPanel2-Holder .for-logged',
					forNotLogged: '.LepraPanel2-Holder .for-not-logged',
					names: '.LepraPanel2-Holder [name="%s"]'
				},
				elements: {
					profile: '.LepraPanel2-Holder #LepraPanel2-NavigateMenu [image$="user.png"]',
					karma: '.LepraPanel2-Holder #LepraPanel2-persist-karma-image',
					karmaText: '#LepraPanel2-persist-karma',
					rating: '.LepraPanel2-Holder #LepraPanel2-persist-rating-image',
					stuff: '.LepraPanel2-Holder #LepraPanel2-persist-stuff-image',
					inbox: '.LepraPanel2-Holder #LepraPanel2-persist-inbox-image'
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
		Components.utils.import("resource://gre/modules/FileUtils.jsm");
		Components.utils.import("resource://gre/modules/NetUtil.jsm");
		Components.utils.import("resource://gre/modules/Services.jsm");

		this._preferencesService = Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefService).getBranch("extensions.leprapanel2.");
		this._observerService = Components.classes["@mozilla.org/observer-service;1"].getService(Components.interfaces.nsIObserverService);
		this._cookieService = Services.cookies;
		this._fileService = FileUtils.getFile("ProfD", ["leprapanel2.json"]);
		
		this._loadPreferences();
		
		this._getSession();
		this._runLevel0();

		this._registerObservers();	
		this._addEventListener();

	}

	Lpr2Bridge.prototype._runLevel0 = function() {
		this._prepareUI();
		if (this.user.logged) {
			this._readFromFile();
			this._getLocalData();
			this._getRemoteData(true);
			this._schedule();
		}
	}
	
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

	Lpr2Bridge.prototype._getSession = function() {
		var cookies = {};
		var hostCookies = this._cookieService.getCookiesFromHost(this.config.url.domain);
		
		while (hostCookies.hasMoreElements()) {
			var currentCookie = hostCookies.getNext().QueryInterface(Components.interfaces.nsICookie);
			cookies[currentCookie.name] = currentCookie.value;
		}
		
		if (cookies && cookies.uid && cookies.sid) {
			if (this.user.uid !== cookies.uid || this.user.sid !== cookies.sid) {
				this._ready.uiAuth = false;
				this.user.logged = true;
				this.user.changed = true;
				this.user.uid = cookies.uid;
				this.user.sid = cookies.sid;
			} else {
				this.user.changed = false;
			}
		} else {
			this._ready.uiAuth = false;
			this.user.logged = false;
			this.user.changed = true;
			this.user.uid = undefined;
			this.user.sid = undefined;
		}
	}
	
	Lpr2Bridge.prototype._prepareUI = function() {
		var barVisible = $(this.config.layout.blocks.bar).length > 0;
		
		if (this._ready.uiAuth !== true && barVisible === true) {
			$(this.config.layout.blocks.forLogged).attr('hidden', !this.user.logged);
			$(this.config.layout.blocks.forNotLogged).attr('hidden', !!this.user.logged);
			this._ready.uiAuth = true;
		}
		
		if (this._ready.ui !== true && barVisible === true && this.user.logged === true) {
			$(this.config.layout.blocks.greetingBox).attr('hidden', !this.settings.greeting);
			$(this.config.layout.blocks.ratingBox).attr('hidden', !this.settings.checkRatings);
			$(this.config.layout.blocks.stuffBox).attr('hidden', !this.settings.checkStuff);
			this._ready.ui = true;
		}
		
		if (this.user.username) {
			var $profile = $(this.config.layout.elements.profile);
			if ($profile.attr('data-href').length === 0) {
				$profile.attr('data-href', this.config.url.users + this.user.username);	
			}
		}
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
					if (typeof attitude !== 'undefined') {
						if (!this.settings.thirdOption) {
							$(this.config.layout.elements[keys[i]]).attr('src', attitude ? this.config.layout.images.minus : this.config.layout.images.plus);	
						}
						var tooltipText = '' + this.user.attitude.data.login + ' ' + (this.user.attitude.data.attitude > 0 ? '+' : '') + this.user.attitude.data.attitude;
						$(this.config.layout.elements.karma).attr('tooltiptext', tooltipText);
						$(this.config.layout.elements.karmaText).attr('tooltiptext', tooltipText);
						this.user.attitude[keys[i]] = undefined;
					} else {
						continue;
					}
				}
				if (keys[i] === 'stuff' || keys[i] === 'inbox') {
					$(this.config.layout.elements[keys[i]]).attr('src', this.user[keys[i]] === '' ? this.config.layout.images[keys[i]] : this.config.layout.images[keys[i] + 'Active']);
					$el.attr('hidden', this.user[keys[i]] === '');
				}
				$el.val(this.user[keys[i]]);
			}
		}
	}

	Lpr2Bridge.prototype._getRemoteData = function(full) {
		var _this = this;

		var makeRequest = function(uri, answerHandler) {
			$.ajax({
				type: 'get',
				url: uri,
				beforeSend: function(xhr) {
					xhr.setRequestHeader('Cookie', 'sid=' + _this.user.sid + ';uid=' + _this.user.uid);
				},
				dataType: 'json',
				success: function(answer) {
					_this._writeData(answer);
					_this._setLocalData();
					_this._prepareUI();
				}
			});
		};
		
		makeRequest(this.config.url.api);
		
		if (full) {
			makeRequest(this.config.url.api + '/' + this.user.uid);	
		};
	}
	
	Lpr2Bridge.prototype._writeData = function(data) {
		if (!data) {
			return false;
		}
		if (data.hasOwnProperty('karma_votes') && data.karma_votes.length > 0) {
			this.user.attitude.data = data.karma_votes[data.karma_votes.length - 1];
			this._storageData = data;			
		}
		if (data.hasOwnProperty('karma') && data.karma !== this.user.karma) {
			this.user.attitude.karma = this.user.karma > data.karma;
			this.user.karma = data.karma;
		}
		if (data.hasOwnProperty('rating') && data.rating !== this.user.rating) {
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
		var _this = this;
		
		clearInterval(this._timer);
		
		if (this.user.logged !== true || (this.settings.checkRatings !== true && this.settings.checkStuff !== true)) {
			return false;
		}
		
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
	
	Lpr2Bridge.prototype._registerObservers = function() {
		var _this = this;
	    this._preferencesService.addObserver('', this, false);
	    this._preferencesService.QueryInterface(Components.interfaces.nsIPrefBranch);
	    this._observerService.addObserver(this, "cookie-changed", null);
	    window.addEventListener("customizationchange", function(e) {
	    	_this._onWindowCustomization(e);
	    }, false);
	}
	
	Lpr2Bridge.prototype._unregisterObservers = function() {
		this._preferencesService.removeObserver("", this);
		this._observerService.removeObserver(this, "cookie-changed");
	}
	
	Lpr2Bridge.prototype._onWindowCustomization = function(e) {
		var palette = e.target.palette;
		var found = false;
		if (palette && palette.children.length > 0) {
			for (var i = 0; i < palette.children.length; i++) { 
				if (palette.children[i].id.search(this.config.layout.blocks.bar.replace('#', '')) !== -1) {
					found = true;
				}
			}
		}
		if (found === false) {
			this._ready.ui = false;
			this._ready.uiAuth = false;
			this._runLevel0();
		}
	}
	
	Lpr2Bridge.prototype.observe = function(aSubject, aTopic, aData) {
		switch(aTopic) {
			case 'cookie-changed':
				this._getSession();
				if (this.user.changed) {
					this._runLevel0();
				}
				break;
		}
	}
	
	Lpr2Bridge.prototype._addEventListener = function() {
		var _this = this;
		document.getElementById("appcontent").addEventListener("DOMContentLoaded", function(e) {
			_this._onPageLoad(e);
		}, true);
	}
	
	Lpr2Bridge.prototype._onPageLoad = function(e) {
		var doc = e.target;
		if (doc instanceof HTMLDocument && !doc.defaultView.frameElement && doc.location.href) {
			if (this.settings.checkLepra) {
				this._getStuffInboxFromHtml(doc);
			}
		}
	}
	
	Lpr2Bridge.prototype._getStuffInboxFromHtml = function(doc) {
		if (doc.location.href.search('//leprosorium.ru') === -1) return false;
		var $stuff = $('#js-header_nav_my_things i', doc);
		var $inbox = $('#js-header_nav_inbox i', doc);
		if ($stuff.length > 0 && $inbox.length > 0) {
			this.user.stuff = $stuff.html().replace(/[\D\s]+/, '');
			this.user.inbox = $inbox.html();
			this._setLocalData();
		}
	}
	
	Lpr2Bridge.prototype.destroy = function() {
		this._writeToFile(this._storageData);
		this._unregisterObservers();	
	}
	
	Lpr2Bridge.prototype._readFromFile = function() {
		var data = '';
		var fstream = Components.classes["@mozilla.org/network/file-input-stream;1"].createInstance(Components.interfaces.nsIFileInputStream);
		var cstream = Components.classes["@mozilla.org/intl/converter-input-stream;1"].createInstance(Components.interfaces.nsIConverterInputStream);

		if (!this._fileService.exists() || !this._fileService.isFile()) return false;
		
		fstream.init(this._fileService, -1, 0, 0);
		cstream.init(fstream, 'UTF-8', 0, 0);

		var str = {};
		var read = 0;
		do { 
			read = cstream.readString(0xffffffff, str);
			data += str.value;
		} while (read !== 0);

		cstream.close();
		
		this._storageData = JSON.parse(data);
	}
	
	Lpr2Bridge.prototype._writeToFile = function(data) {
		var data = JSON.stringify(data);
		
		var ostream = FileUtils.openSafeFileOutputStream(this._fileService);
		var converter = Components.classes["@mozilla.org/intl/scriptableunicodeconverter"].createInstance(Components.interfaces.nsIScriptableUnicodeConverter);
		converter.charset = "UTF-8";
		var istream = converter.convertToInputStream(data);
		NetUtil.asyncCopy(istream, ostream);
	}
	
	window.lpr2bridge = new Lpr2Bridge();

	window.addEventListener('load', function() {
		lpr2bridge.init();
	}, false);

	window.addEventListener('unload', function() {
		lpr2bridge.destroy();
	}, false);

})(Zepto, window, document);