define(['libs/crossroads'], function(crossroad) {
	function Router() {
		this._router = crossroad.create();
		this._patterns = {};
	}
	
	Router.prototype.add = function(pattern, handler, priority) {
		if(typeof this._patterns[pattern] === 'undefined')
			this._patterns[pattern] = [];
		
		var patt = pattern.replace(/:(\w+)/g, '{$1}'),
		route = this._router.addRoute(patt, handler, priority);
		
		this._patterns[pattern].push(route);
		return route;
	};
	
	Router.prototype.remove = function(pattern) {
		if(typeof pattern !== 'string') {
			this._router.removeRoute(pattern);
			return this;
		}
		
		if(typeof this._patterns[pattern] !== 'object')
			return this;
		
		var routes = this._patterns[pattern];
		while(routes.length) {
			this._router.removeRoute(routes.pop());
		}
		
		return this;
	};
	
	Router.prototype.removeAll = function() {
		this._router.removeAllRoutes();
		
		return this;
	};
	
	Router.prototype.route = function(request, event) {		
		this._router.parse(request, [event || {}]);
		
		return this;
	};
	
	return Router;
});