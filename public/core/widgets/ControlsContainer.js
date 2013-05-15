define(['core/widgets/Container', 'core/widgets/Control'], function(Container, Control) {
	
	function Widget() {
		Widget.super_.apply(this, arguments);
	};
	Container.extend(Widget);
	var proto = Widget.prototype;
	
	proto.defaults = {
		controls: []
	};
	
	proto.create = function(container) {		
		this._elm = this._create();
		if(container)
			this._elm.appendTo(container);
		
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
		if(!(control instanceof Control || control instanceof Widget)) {
			control = Control.create(control);
		}
		
		return Widget.super_.prototype.insert.call(this, control);
	};
	
	proto._create = function() {
		return $('<div />');
	};
	
	return Widget;
});