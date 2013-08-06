define([
	'core/widgets/Control', 'core/widgets/Input'
], function(Control, Input) {
	
	function Widget() {
		Widget.super_.apply(this, arguments);
	};
	Control.extend(Widget, {
		type: 'checkbox',
		label: null,
		wrapperLabel: false,
		checkedValue: 1,
		uncheckValue: 0
	});
	var proto = Widget.prototype;
	
	Control.types.checkbox = Widget;
	
	proto.isChecked = function() {
		return this.isVal(this.options.checkedValue);
	};
	
	proto.sendVal = function() {
		if(this.input && this.input.prop('checked'))
			return this.options.checkedValue;
		
		if(this.hidden)
			return this.options.uncheckValue;
		
		return null;
	};
	
	proto._create = function(container, parent, elm) {
		if(!elm) {
			elm = $('<label class="checkbox" />')
					.attr('for', this.options.id);
		}
		
		this.hidden = new Input(this._getHiddenOptions(this.options));
		this.hidden.create(elm, this);
		
		this.input = new Input(this._getCheckboxOptions(this.options));
		this.input.create(elm, this);
		
		var self = this;
		this.input._elm.bind('change', function(e) {	
			self.hidden.render({
				disabled: (self.options.required === false || $(this).prop('checked'))
			});
		});
		
		elm.append(' ');
		this._span = $('<span />').appendTo(elm);
		
		return elm;
	};
	
	proto._destroy = function() {
		this.hidden.destroy();
		this.hidden = null;
		
		this.input.destroy();
		this.input = null;
		
		Widget.super_.prototype._destroy.apply(this, arguments);
	};
	
	proto._getHiddenOptions = function(options) {
		return {
			type: 'hidden',
			id: false,
			name: options.name,
			value: options.uncheckValue,
			disabled: (options.required === false || this.isChecked())
		};
	};
	
	proto._getCheckboxOptions = function(options) {
		return $.extend({}, options, {
			value: options.checkedValue
		});
	};
	
	proto._render = function(options) {
		this.hidden.render(this._getHiddenOptions(options));
		
		this.input.render(this._getCheckboxOptions(options));
		this.input._elm.prop('checked', this.isChecked());
		
		this._span.text(options.label || '');
	};
	
	return Widget;
});