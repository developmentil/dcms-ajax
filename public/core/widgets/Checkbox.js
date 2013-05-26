define([
	'core/widgets/Control', 'core/widgets/Input'
], function(Control, Input) {
	
	function Widget() {
		Widget.super_.apply(this, arguments);
	};
	Input.extend(Widget);
	var proto = Widget.prototype;
	
	Control.types.checkbox = Widget;
	
	proto.defaults = {
		type: 'text',
		name: null,
		value: null,
		checkedValue: 1,
		uncheckValue: 0
	};
	
	proto._create = function(container, parent, elm) {
		this.hidden = new Input(this._getHiddenOptions());
		this.hidden.create(container, this);
		
		return Widget.super_.prototype._create.call(this, container, parent, elm);
	};
	
	proto._destroy = function() {
		Widget.super_.prototype._destroy.apply(this, arguments);
		
		this.hidden.destroy();
		this.hidden = null;
	};
	
	proto._getHiddenOptions = function(options) {
		return {
			type: 'hidden',
			name: options.name,
			value: options.uncheckValue
		};
	};
	
	proto._render = function(options) {
		this.hidden.render(this._getHiddenOptions());
				
		this._elm
		.attr('value', options.checkedValue)
		.prop('checked', options.value == options.checkedValue);
	};
	
	return Widget;
});