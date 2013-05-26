define(['core/dcms-ajax'], function(DA) {
	
	function Widget() {
		Widget.super_.apply(this, arguments);
		
		if(typeof this.options.id === 'undefined')
			this.options.id = this.options.name;
	};
	DA.Widget.extend(Widget);
	var proto = Widget.prototype;
	
	Widget.types = {};
	
	Widget.create = function(options) {
		return DA.Widget.create(options, Widget.types[options.type] || Widget.types.default);
	};
	
	Widget.escape = function(text) {
		return $('<span />').text(text).html();
	};
	
	proto.defaults = {
		name: null,
		value: null
	};
	
	proto.isVal = function(val) {
		return (this.options.value == val);
	};
	
	proto._create = function(container, parent, elm) {
		if(!elm)
			elm = $('<input />');
		
		elm = Widget.super_.prototype._create.call(this, container, parent, elm);
		
		if(this.options.name)
			elm.attr('name', this.options.name);
		
		return elm;
	};
	
	proto._load = function(callback) {
		var name = this.options.name,
		entity = this._parent && this._parent.options.entity;

		if(entity && typeof entity[name] !== 'undefined')
			this.options.value = entity[name];
		
		callback(null);
	};
	
	proto._render = function(options) {
		this._elm.val(options.value);
	};
	
	return Widget;
});