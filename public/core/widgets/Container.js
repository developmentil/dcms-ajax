define(['core/dcms-ajax', 'core/libs/async'], function(DA, async) {
	
	function Widget() {
		Widget.super_.apply(this, arguments);
		
		this._children = [];
	};
	DA.Widget.extend(Widget);
	var proto = Widget.prototype;
	
	proto.defaults = {
		children: []
	};
	
	proto.create = function() {
		var elm = Widget.super_.prototype.create.apply(this, arguments);
		
		if(!this._container)
			this._container = elm;
		
		for(var i in this.options.children) {
			this.insert(this.options.children[i]);
		}
		this.options.children = [];
		
		return elm;
	};
	
	proto.insert = function(widget) {
		if(!(widget instanceof DA.Widget)) {
			widget = DA.Widget.create(widget);
		}
		
		widget.create(this._container, this);
		this._children.push(widget);
		
		this.emit('inserted', widget);
		return widget;
	};
	
	proto.eachChild = function(fn) {
		for(var i in this._children) {
			fn(this._children[i], i);
		}
		
		return this;
	};
	
	proto.remove = function(widget, keepLive) {
		var i = this._children.indexOf(widget);
		if(i === -1)
			return false;
		
		this._children.splice(i, 1);
		if(!keepLive)
			widget.destroy();
		
		this.emit('removed', widget, keepLive);
		return this;
	};
	
	proto._load = function(callback) {
		var tasks = [];
		
		this.eachChild(function(widget) {
			tasks.push(function(callback) {
				widget.load(true, callback);
			});
		});
		
		async.series(tasks, callback);
	};
	
	proto._render = function(options) {
		this.eachChild(function(widget) {
			widget.render();
		});
	};
	
	proto._destroy = function() {
		this.eachChild(function(widget) {
			widget.destroy();
		});
	};
	
	return Widget;
});