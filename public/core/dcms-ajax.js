define([
	'libs/util', 'libs/async',
	'SignalsEmitter', 'Registry', 'Router', 'PlugIn', 'Module', 'Widget'
], function(util, async, SignalsEmitter, Registry, Router, PlugIn, Module, Widget) {
	
	var DA = 
	window.DA = new SignalsEmitter();
	
	
	/*** INIT ***/
	
	DA.PlugIn = PlugIn;
	DA.Module = Module;
	DA.Widget = Widget;
	
	DA.registry = new Registry();
	DA.router = new Router();
	
	DA.registry.set('plugins', {});
	DA.plugins = {};
	
	
    /*** Bootstrap ***/
	
	DA.bootstrap = function() {
		_requirePlugIns(function(err) {
			if(err) throw err;
			
			DA.emitAsync('initiated', function(err) {
				if(err) throw err;
				
				$(function() {
					_loadPlugIns(function(err) {
						if(err) throw err;

						DA.emitAsync('loaded', function(err) {
							if(err) throw err;
						});
					});
				});
			});
		});
	};
	
	DA.requirePlugIn = function(name, options, callback) {
		requirejs(['plugins/' + name], function(plugin) {
			DA.plugins[name] = new plugin(name, options);
			
			callback(null);
		}, callback);
	};
	
	function _requirePlugIns(callback) {
		var plugins = DA.registry.get('plugins'),
		tasks = [];
		
		$.each(plugins, function(name, options) {
			tasks.push(function(callback) {
				DA.requirePlugIn(name, options, callback);
			});
		});
		
		async.parallel(tasks, callback);
	}
	
	function _loadPlugIns(callback) {
		var tasks = [];
				
		$.each(DA.plugins, function(name, plugin) {
			tasks.push(function(callback) {
				plugin.load(callback);
			});
		});

		async.parallel(tasks, callback);
	}
	
	return DA;
});