/** @license
 * DCMS-Ajax <http://www.dcms.co.il/>
 * Copyright (C) Development IL - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * @Author Moshe Simantov
 * @Version 0.1.0
 */

define([
	'jquery', 'core/libs/sammy',
	'core/SignalsEmitter', 'core/Registry', 'core/Widget'
], function($, Sammy, SignalsEmitter, Registry, Widget) {
	
	var DA = 
	window.DA = new SignalsEmitter();
	
	
	/*** INIT ***/
	
	DA.Widget = Widget;
	
	DA.plugins = {};
	
	DA.registry = new Registry();
	DA.registry.set('locale', requirejs.s.contexts._.config.locale);
	DA.registry.set('dir', 'ltr');
	
	DA.registry.set('plugins', {});
	DA.registry.set('modules', []);
	
	
	/*** App ***/
	
	DA.app = Sammy();
	DA.setLocation = function(location, bind) {
		if(!bind) {
			DA.app.trigger('redirect', {to: location});
			DA.app.last_location = ['get', location];
		}
		
		DA.app.setLocation(location);		
		return this;
	};
	
	
	/*** Api ***/
	
	 DA.api = function(options, callback) {
		if(typeof options === 'string')
			options = {url: options};
		 
		options = $.extend({
			type: 'GET',
			dataType: 'json',
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
			if(options._path === false)
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