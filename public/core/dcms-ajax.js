/** @license
 * DCMS-Ajax <http://www.dcms.co.il/>
 * Copyright (C) Development IL - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Author: Moshe Simantov
 * Version: 0.1.0 - Build: 1
 */

define([
	'jquery', 'core/libs/sammy',
	'core/SignalsEmitter', 'core/Registry', 'core/Widget'
], function($, Sammy, SignalsEmitter, Registry, Widget) {
	
	var DA = 
	window.DA = new SignalsEmitter();
	
	
	/*** INIT ***/
	
	DA.Widget = Widget;
	
	DA.app = Sammy();
	DA.registry = new Registry();
	
	DA.plugins = {};
	DA.registry.set('plugins', {});
	DA.registry.set('modules', []);
	
	
	
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