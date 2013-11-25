define(['core/dcms-ajax', 'core/libs/async'], function(DA, async) {
	
	function Widget() {
		Widget.super_.apply(this, arguments);
		
		this._children = [];
	};
	DA.Widget.extend(Widget, {
		tag: 'div',
		children: [],
		glue: null
	});
	var proto = Widget.prototype;
	
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
		
		if(this.options.glue && this._children.length)
			this._container.append(this.options.glue);
			
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
			throw new Error('The given widget isn\'t child of this widget');
		
		this._children.splice(i, 1);
		if(!keepLive)
			widget.destroy();
		
		this.emit('removed', widget, keepLive);
		return this;
	};
	
	proto._load = function(callback) {
		var self = this, tasks = [];
		
		this.eachChild(function(widget) {
			tasks.push(function(callback) {
				if(self._markAsLoaded === null)
					widget.reload(true, callback);
				else
					widget.load(true, callback);
			});
		});
		
		async.series(tasks, callback);
	};
	
	proto._create = function(container, parent, elm) {
		if(!elm)
			elm = $('<' + this.options.tag + ' />');
		
		return Widget.super_.prototype._create.call(this, container, parent, elm);
	};
	
	proto._render = function(options) {
		Widget.super_.prototype._render.apply(this, arguments);
		
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