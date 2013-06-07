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
		
		this.input = new Input(this.options);
		this.input.create(elm, this);
		
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
			disabled: (options.required === false)
		};
	};
	
	proto._render = function(options) {
		this.hidden.render(this._getHiddenOptions(options));
		
		this.input.render(options);
		this.input._elm.prop('checked', this.isVal(options.checkedValue));
		
		this._span.text(options.label || '');
	};
	
	return Widget;
});