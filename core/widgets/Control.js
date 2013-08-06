define(['core/dcms-ajax'], function(DA) {
	
	var idSequence = 0;
	
	function Widget() {
		Widget.super_.apply(this, arguments);
		
		if(this.options.id === null)
			this.options.id = this.options.name + '-' + (++idSequence);
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
	
	proto.getInputName = function() {
		var name = this.options.name;
		if(!name) return name;
		
		name = name.replace(/\[\d+\]/g, '[]');
		return name;
	};
	
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
	
	proto.entityVal = function() {
		var name = this.options.name,
		entity = this._parent && this._parent.options.entity;

		if(!name)
			return entity;
		
		name = name.replace(/\[([\w\.]+)\]/g, '.$1');
		var keys = name.split('.');
		
		for(var i = 0; i < keys.length; i++) {
			if(!entity)
				return null;
			
			entity = entity[keys[i]];
		}

		return entity;
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
		elm.bind('change.control', function(e) {	
			self._change(e);
		});
		
		return elm;
	};
	
	proto._load = function(callback) {
		var value = this.entityVal();
		if(value !== undefined)
			this.options.value = value;
		
		setTimeout(callback, 1);
	};
	
	proto._change = function(e) {
//		this.options.value = this.sendVal();
		
		this.emit('change', e);
			
		this._renderIsSend(this.options);
		if(typeof this.options.change === 'function') {
			this.options.change.apply(this, arguments);
		}
		return this;
	};
	
	proto._render = function(options) {
		Widget.renderElm(this._elm, options);
		
		this.val(options.value);
		this._elm.trigger('change.isSend');
		
		this._renderIsSend(options);
	};
	
	proto._renderIsSend = function(options) {
		if(this.isSend())
			this._elm.attr('name', this.getInputName());
		else
			this._elm.removeAttr('name');
	};
	
	return Widget;
});