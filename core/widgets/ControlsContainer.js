define(['core/dcms-ajax', 
	'core/widgets/Container', 'core/widgets/Control'
], function(DA, Container, Control) {
	
	function Widget() {
		Widget.super_.apply(this, arguments);
		
		this._controls = {};
	};
	Container.extend(Widget, {
		wrapper: null,
		controls: [],
		entity: {}
	});
	var proto = Widget.prototype;
	
	proto.data = function(key, value) {
		switch(typeof key) {
			case 'undefined':
				return this.options.entity;
		
			case 'object':
				$.extend(this.options.entity, key);
				break;
				
			case 'boolean':
				$.extend(key, this.options.entity, value);
				break;
				
			default:
				if(typeof value === 'undefined')
					return this.options.entity[key];
				
				this.options.entity[key] = value;
		}
		
		return this;
	};
	
	proto.create = function() {
		var elm = Widget.super_.prototype.create.apply(this, arguments);
		
		for(var i in this.options.controls) {
			this.insert(this.options.controls[i]);
		}
		this.options.controls = [];
		
		return elm;
	};
	
	proto.insert = function(control) {
		if(!(control instanceof DA.Widget)) {
			if(control.wrapper === true && this.options.wrapper) {
				control.wrapper = this.options.wrapper;
			}
			control = Control.create(control);
		}
		
		var widget = control;
		if(this.options.wrapper && widget.options.wrap !== false) {
			if(widget instanceof Control || widget.options.wrappable) {
				widget = new this.options.wrapper({
					controls: [widget]
				});
			}
		}
		
		widget = Widget.super_.prototype.insert.call(this, widget);
		this._insertControl(control);
		
		return widget;
	};
	
	proto.control = function(name) {
		return this._controls[name];
	};
	
	proto.remove = function(control) {
		if(!Widget.super_.prototype.remove.apply(this, arguments))
			return false;
		
		if(control.options.name)
			delete this._controls[control.options.name];
		
		return this;
	};
	
	proto._create = function(container, parent, elm) {
		if(!elm)
			elm = $('<div />');
		
		return Widget.super_.prototype._create.call(this, container, parent, elm);
	};
	
	proto._insertControl = function(control) {
		var self = this;
		
		if(control instanceof Control) {
			if(control.options.name)
				this._controls[control.options.name] = control;
		} else if(control instanceof Container) {
			control.eachChild(function(widget) {
				self._insertControl(widget);
			});
		}
		
		return control;
	};
	
	proto._load = function() {
		if(this._parent && this._parent.options.entity)
			this.options.entity = this._parent.options.entity;
		
		return Widget.super_.prototype._load.apply(this, arguments);
	};
	
	return Widget;
});