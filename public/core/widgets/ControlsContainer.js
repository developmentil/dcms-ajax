define(['core/dcms-ajax', 
	'core/widgets/Container', 'core/widgets/Control'
], function(DA, Container, Control) {
	
	function Widget() {
		Widget.super_.apply(this, arguments);
		
		this._controls = {};
	};
	Container.extend(Widget);
	var proto = Widget.prototype;
	
	proto.defaults = {
		wrapper: null,
		controls: []
	};
	
	proto.create = function(container) {
		this._elm = this._create();
		if(container)
			this._elm.appendTo(container);
		if(!this._container)
			this._container = this._elm;
		
		if(this.options.id)
			this._elm.attr('id', this.options.id);
		
		if(this.options.className)
			this._elm.addClass(this.options.className);
		
		for(var i in this.options.controls) {
			this.insert(this.options.controls[i]);
		}
		this.options.controls = [];
		
		return this._elm;
	};
	
	proto.insert = function(control) {
		if(!(control instanceof DA.Widget)) {
			control = Control.create(control);
		}
		
		if(control instanceof Control) {
			if(control.options.name)
				this._controls[control.options.name] = control;

			if(this.options.wrapper) {
				control = new this.options.wrapper(control);
			}
		}
		
		return Widget.super_.prototype.insert.call(this, control);
	};
	
	proto.remove = function(control) {
		if(!Widget.super_.prototype.remove.apply(this, arguments))
			return false;
		
		if(control.options.name)
			delete this._controls[control.options.name];
		
		return this;
	};
	
	proto._create = function() {
		return $('<div />');
	};
	
	return Widget;
});