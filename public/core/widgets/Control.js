define(['core/dcms-ajax'], function(DA) {
	
	function Widget() {
		Widget.super_.apply(this, arguments);
		
		if(this.options.id === null)
			this.options.id = this.options.name;
	};
	DA.Widget.extend(Widget, {
		name: null,
		value: null,
		disabled: null,
		required: null,
		emptyValue: '',
		change: null
	});
	var proto = Widget.prototype;
	
	Widget.types = {};
	
	Widget.create = function(options) {
		return DA.Widget.create(options, Widget.types[options.type] || Widget.types.default);
	};
	
	Widget.escape = function(text) {
		return $('<span />').text(text).html();
	};
	
	Widget.renderElm = function(elm, options) {
		elm = Widget.super_.renderElm.apply(this, arguments);
		
		if(options.disabled !== null)
			elm.prop('disabled', options.disabled);
		
		if(options.required !== null)
			elm.prop('required', options.required);
		
		return elm;
	};
	
	proto.isVal = function(val) {
		return (this.options.value == val);
	};
	
	proto.sendVal = function() {
		if(!this._elm)
			return null;
		
		return this._elm.val();
	};
	
	proto.val = function(val) {
		if(val === undefined)
			return this.isSend() ? this.sendVal() : null;
		
		this._elm.val(val);
		return this;
	};
	
	proto.isSend = function() {
		return (this.options.name && this._elm && 
					(this.options.required !== false || this.sendVal() != this.options.emptyValue));
	};
	
	proto._create = function(container, parent, elm) {
		if(!elm)
			elm = $('<input />');
		
		elm = Widget.super_.prototype._create.call(this, container, parent, elm);
		
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
		Widget.renderElm(this._elm, options);
		
		this._elm.val(options.value)
				.trigger('change.isSend');
		
		this._renderChange(options);
	};
	
	proto._renderChange = function(options) {
		var self = this;
		if(typeof options.change === 'function') {
			this._elm.bind('change.control', function(e) {
				options.change.call(self, e);
			});
		} else {
			this._elm.unbind('change.control');
		}
	};
	
	return Widget;
});