define(['core/dcms-ajax'], function(DA) {
	
	function Widget() {
		Widget.super_.apply(this, arguments);
		
		if(typeof this.options.id === 'undefined')
			this.options.id = this.options.name;
	};
	DA.Widget.extend(Widget, {
		name: null,
		value: null,
		required: null,
		emptyValue: ''
	});
	var proto = Widget.prototype;
	
	Widget.types = {};
	
	Widget.create = function(options) {
		return DA.Widget.create(options, Widget.types[options.type] || Widget.types.default);
	};
	
	Widget.escape = function(text) {
		return $('<span />').text(text).html();
	};
	
	proto.isVal = function(val) {
		return (this.options.value == val);
	};
	
	proto.isSend = function() {
		return (this.options.name && this._elm && 
					(this.options.required !== false || this._elm.val() != this.options.emptyValue));
	};
	
	proto._create = function(container, parent, elm) {
		if(!elm)
			elm = $('<input />');
		
		elm = Widget.super_.prototype._create.call(this, container, parent, elm);
		
		if(this.options.required !== null)
			elm.prop('required', this.options.required);
		
		var self = this;
		elm.bind('change.isSend', function() {			
			if(self.isSend())
				elm.attr('name', self.options.name);
			else
				elm.removeAttr('name');
		});
		
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
		this._elm.val(options.value)
				.trigger('change.isSend');
	};
	
	return Widget;
});