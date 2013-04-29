define(['PlugIn'], function(PlugIn) {
	
	function Module(name) {
		this._routes = [];
		
		Module.super_.call(this, name);
	};
	PlugIn.extend(Module);
	
	
	/*** Public Methods ***/
	
	Module.prototype.route = function(pattern, handler, priority) {
		this._routes.push({
			args: arguments,
			route: null
		});
		
		if(this._loaded) {
			this._routes[this._routes.length-1].route 
					= DA.router.add.apply(DA.router, arguments);
		}
		
		return (this._routes.length - 1);
	};
	
	Module.prototype.unroute = function(id) {
		if(this._routes[id]) {
			if(this._loaded)
				DA.router.remove(this._routes[id].route);
			
			delete this._routes[id];
		}
		
		return this;
	};
	
	
	/*** Protected Methods ***/
	
	Module.prototype._load = function(callback) {
		this._loadRoutes();
		
		callback(null);
	};
	
	Module.prototype._unload = function(callback) {
		this._unloadRoutes();
		
		callback(null);
	};
	
	Module.prototype._loadRoutes = function() {
		for(var i in this._routes) {
			this._routes[i].route = DA.router.add.apply(DA.router, this._routes[i].args);
		}
	};
	
	Module.prototype._unloadRoutes = function() {
		for(var i in this._routes) {
			if(!this._routes[i].route)
				continue;
			
			DA.router.remove(this._routes[i].route);
			this._routes[i].route = null;
		}
	};
	
	return Module;
});

