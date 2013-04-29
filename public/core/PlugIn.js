define(['libs/util', 'libs/EventEmitter'], function(util, EventEmitter) {
	
	function PlugIn(name, options) {
		PlugIn.super_.call(this);
		
		this.name = name;
		this.options = options || null;
		this._binds = {};
		
		this._loaded = false;
		this._supportUnload = true;
		
		this._init();
	};
	util.inherits(PlugIn, EventEmitter);
	
	function classExtend(ctor, superCtor) {
		util.inherits(ctor, superCtor);
		
		ctor.extend = function(c) {
			classExtend(c, ctor);
		};
	};
	
	PlugIn.extend = function(ctor) {
		classExtend(ctor, PlugIn);
	};
	
	
	/*** Public Methods ***/
	
	PlugIn.prototype.load = function(callback) {
		var self = this;
		this.emit('load.pre');
		
		try {		
			this._load(function(err) {
				if(err) return callback(err);

				self._loadBinds();
				self.emit('load');

				self._loaded = true;
				self.emit('load.post');

				callback(null);
			});
		} catch(err) {
			return callback(err);
		}
		
		return this;
	};
	
	PlugIn.prototype.unload = function(callback) {
		var self = this;
		this.emit('unload.pre');
		
		try {	
			this._unload(function(err) {
				if(err) return callback(err);

				self._unloadBinds();
				self.emit('unload');

				self._loaded = false;
				self.emit('unload.post');

				callback(null);
			});
		} catch(err) {
			return callback(err);
		}
		
		return this;
	};
	
	PlugIn.prototype.bind = function(event, listener) {
		if(typeof this._binds[event] === 'undefined')
			this._binds[event] = [];
		
		this._binds[event].push(listener);
		
		if(this._loaded) {
			DA.on(event, listener);
		}
		
		return this;
	};
	
	PlugIn.prototype.unbind = function(event, listener) {
		if(typeof this._binds[event] === 'undefined')
			return this;
		
		var index = this._binds[event].indexOf(listener);
		if(~index) {
			delete this._binds[event][index];
			
			if(this._loaded)
				DA.off(event, listener);
		}
		
		return this;
	};
	
	
	/*** Protected Methods ***/
	
	PlugIn.prototype._init = function() {
	};
	
	PlugIn.prototype._load = function(callback) {
		callback(null);
	};
	
	PlugIn.prototype._unload = function(callback) {
		callback(null);
	};
	
	PlugIn.prototype._loadBinds = function() {
		for(var event in this._binds) {
			for(var i in this._binds[event]) {
				DA.on(event, this._binds[event][i]);
			}
		}
	};
	
	PlugIn.prototype._unloadBinds = function() {
		for(var event in this._binds) {
			for(var i in this._binds[event]) {
				DA.off(event, this._binds[event][i]);
			}
		}
	};
	
	return PlugIn;
});

