define([
	'jquery', 'libs/async', 'libs/sammy',
	'SignalsEmitter', 'Registry', 'Widget'
], function($, async, Sammy, SignalsEmitter, Registry, Widget) {
	
	var DA = 
	window.DA = new SignalsEmitter();
	
	
	/*** INIT ***/
	
	DA.Widget = Widget;
	
	DA.app = Sammy();
	DA.registry = new Registry();
	
	DA.registry.set('plugins', {});
	DA.registry.set('modules', []);
	
	
    /*** Bootstrap ***/
	
	DA.bootstrap = function() {
		_requireAll(function(err) {
			if(err) throw err;
			
			DA.trigger('initiated', function(err) {
				if(err) throw err;
				
				$(function() {
					DA.app.after(function() {
						DA.emit('render');			
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
		var paths = [];
		
		$.each(DA.registry.get('plugins'), function(name) {
			paths.push('plugins/' + name);
		});
		
		$.each(DA.registry.get('modules'), function(i, name) {
			paths.push('modules/' + name);
		});
		
		requirejs(paths, function() {
			callback(null);
		}, callback);
	}
	
	return DA;
});