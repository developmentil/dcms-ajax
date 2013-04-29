define([
	'libs/util', 'libs/EventEmitter', 'libs/async',
	'Registry', 'Router', 'PlugIn', 'Module', 'Widget'
], function(util, EventEmitter, async, Registry, Router, PlugIn, Module, Widget) {
	
	var DA = 
	window.DA = new EventEmitter();
	
	
	/*** INIT ***/
	
	DA.registry = new Registry();
	DA.router = new Router();
	DA.plugins = {};
	
	DA.PlugIn = PlugIn;
	DA.Module = Module;
	DA.Widget = Widget;
	
	
    /*** APP ***/
	
	DA.registry.set('plugins', {});
	
	DA.app = function() {
		var plugins = DA.registry.get('plugins'),
		tasks = [];
		
		$.each(plugins, function(name, options) {
			tasks.push(function(callback) {
				DA.loadPlugin(name, options, callback);
			});
		});
		
		async.parallel(tasks, function(err) {
			if(err) throw err;
			
			DA.emit('init');
			
			$(function() {
				var tasks = [];
				
				$.each(DA.plugins, function(name, plugin) {
					tasks.push(function(callback) {
						plugin.load(callback);
					});
				});
				
				async.parallel(tasks, function(err) {
					if(err) throw err;
					
					DA.emit('load');
				});
			});
		});
	};
	
	DA.loadPlugin = function(name, options, callback) {
		requirejs(['plugins/' + name], function(plugin) {
			DA.plugins[name] = new plugin(name, options);
			
			callback(null);
		}, callback);
	};
	
	return DA;
});