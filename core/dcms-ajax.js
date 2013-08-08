/** @license
 * DCMS-Ajax <http://www.dcms.co.il/>
 * Copyright (C) Development IL - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * @Author Moshe Simantov
 * @Version 0.1.0
 */

define([
	'jquery', 'core/libs/sammy', 'i18n!core/nls/core',
	'core/SignalsEmitter', 'core/Registry', 'core/Widget'
], function($, Sammy, i18n, SignalsEmitter, Registry, Widget) {
	
	var DA = 
	window.DA = new SignalsEmitter();
	
	
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
			callback(alert('Error: ' + options));
		},
		alert: function(options, callback) {
			callback(alert(options));
		},
		confirm: function(options, callback) {
			callback(confirm(options));
		},
		prompt: function(options, callback) {
			if(typeof options === 'string')
				options = {content: options, defaultValue: ''};
			else
				options = $({content: 'DEFAULT CONTENT', defaultValue: ''}, options);
				
			callback(prompt(options.content, options.defaultValue));
		}
	};
	
	
	/*** Api ***/
	
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
			error: $.noop //function(statusCode, textStatus, jqXHR, errorThrown) {},
		}, options);

		if(callback) {
			var success = options.success, error = options.error;

			options.success = function(data, statusCode, textStatus, jqXHR) {
				success.apply(this, arguments);
				callback.call(this, null, data, statusCode, textStatus, jqXHR);
			};

			options.error = function(statusCode, textStatus, jqXHR, errorThrown) {
				error.apply(this, arguments);
				callback.call(this, new Error(textStatus || statusCode), statusCode, textStatus, jqXHR, errorThrown);
			};
		}

		return $.ajax($.extend({}, options, {
			success: function(data, textStatus, jqXHR) {
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
				return options.error(textStatus || -1, null, {
					jqXHR: jqXHR,
					errorThrown: errorThrown
				});
			}
		}));
    };
	
	
	
    /*** Bootstrap ***/
	
	DA.bootstrap = function() {
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
		var plugins = DA.registry.get('plugins'),
		paths = [], names = [];
		
		$.each(plugins, function(name, options) {
			if(options._path === false || DA.plugins[name])
				return;
			
			paths.push(options._path || 'plugins/' + name);
			names.push(name);
		});
		
		requirejs(paths, function() {
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
		}, callback);
	}
	
	function _requireModules(callback) {
		var paths = [];
		
		$.each(DA.registry.get('modules'), function(i, name) {
			paths.push('modules/' + name);
		});
		
		requirejs(paths, function() {
			callback(null);
		}, callback);
	}
	
	return DA;
});