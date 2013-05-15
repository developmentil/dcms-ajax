define(['core/dcms-ajax'], function(DA) {
	
	function Widget() {
		Widget.super_.apply(this, arguments);
	};
	DA.Widget.extend(Widget);
	var proto = Widget.prototype;
	
	Widget.types = {};
	
	Widget.create = function(options) {
		var Control = Widget.types[options.type] || Widget.types.default;
		return new Control(options);
	};
	
	proto.defaults = {
		name: null,
		value: null
	};
	
	proto.create = function(container) {
		this._elm = this._create();
		if(container)
			this._elm.appendTo(container);
		
		if(this.options.id)
			this._elm.attr('id', this.options.id);
		
		if(this.options.name)
			this._elm.attr('name', this.options.name);
		
		if(this.options.className)
			this._elm.addClass(this.options.className);
		
		return this._elm;
	};
	
	proto._create = function() {
		return $('<input />');
	};
	
	proto._load = function(callback) {
		callback(null);
	};
	
	proto._render = function(options) {
		this._elm.val(options.value);
	};
	
	return Widget;
});