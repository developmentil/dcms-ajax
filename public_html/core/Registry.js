define(function() {
	function Registry() {
		this._data = {};
	}
	
	var _get = function(obj, path) {
		var levels = path.split('.'),
		key = null,
		last = null;
		
		for(var i = 0; i < levels.length; i++) {
			last = obj;
			key = levels[i];
			
			if(typeof obj[key] === 'undefined')
				obj[key] = {};
			
			obj = obj[key];
			
			if(!obj)
				break;
		}
		
		return [obj, last, key];
	};
	
	Registry.prototype.get = function(path) {
		return $.extend({}, _get(this._data, path)[0]);
	};
	
	Registry.prototype.set = function(path, value) {
		if(typeof value === 'undefined')
			value = {};
		
		var obj = _get(this._data, path);
		
		obj[1][obj[2]] = value;
		return this;
	};
	
	Registry.prototype.unset = function(path) {
		var obj = _get(this._data, path);
		
		delete obj[1][obj[2]];
		return this;
	};
	
	Registry.prototype.push = function(path, pos, value) {
		if(arguments.length < 3) {
			value = pos;
			pos = null;
		}
		
		var obj = _get(this._data, path);
		if(!Array.isArray(obj[0])) {
			obj[0] = [];
			obj[1][obj[2]] = obj[0];
		}
		
		if(pos === null)
			obj[0].push(value);
		else
			obj[0][pos] = value;
		
		return this;
	};
	
	return Registry;
});
