define(['core/dcms-ajax', 'core/widgets/Control', 'core/widgets/Input'], function(DA, Control, Input) {
	
	function Widget() {
		Widget.super_.apply(this, arguments);
	};
	Input.extend(Widget, {
		format: DA.registry.get('locale.date') || 'mm/dd/yy',
		datepicker: {}
	});
	var proto = Widget.prototype;
	
	Control.types.date = Widget;
	
	proto.parseDate = function(valStr) {
		return $.datepicker.parseDate(this.options.format, valStr);
	};
	
	proto.formatDate = function(valStr) {
		return $.datepicker.formatDate(this.options.format, valStr);
	};
	
	proto.isVal = function(val) {
		if(!this.options.value)
			return (this.options.value == val);
		
		if(typeof val === 'string')
			val = new Date(val);
		
		return (new Date(this.options.value) == val);
	};
	
	proto.sendVal = function() {
		if(!this._elm)
			return null;
		
		return this._hidden.val();
	};
	
	proto.val = function(val) {
		if(val === undefined)
			return Widget.super_.prototype.val.apply(this, arguments);
		
		if(typeof val === 'string')
			val = new Date(val);
		
		this._hidden.val(val.toISOString());
		this._elm.val(this.formatDate(val));
		
		return this;
	};
	
	proto._create = function(container, parent, elm) {
		elm = Widget.super_.prototype._create.call(this, container, parent, elm);
		
		if(this.options.datepicker) {
			elm.datepicker(this._getDatePickerOptions(this.options));
		}
		
		this._hidden = $('<input type="hidden" />').appendTo(container);
		
		return elm;
	};
	
	proto._destroy = function() {
		this._hidden.remove();
		this._hidden = null;
	};
	
	proto._getDatePickerOptions = function(options) {
		return $.extend({
			dateFormat: options.format,
			isRTL: DA.registry.get('locale.direction') === 'rtl'
		}, options.datepicker);
	};
	
	proto._change = function(e) {
		var date = this.parseDate(this._elm.val());
		this._hidden.val(date ? date.toISOString() : null);
		
		return Widget.super_.prototype._change.apply(this, arguments);
	};
	
	proto._renderIsSend = function(options) {
		if(this.isSend())
			this._hidden.attr('name', this.getInputName());
		else
			this._hidden.removeAttr('name');
	};
	
	return Widget;
});