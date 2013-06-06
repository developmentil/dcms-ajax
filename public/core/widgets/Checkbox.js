define([
	'core/widgets/Control', 'core/widgets/Input'
], function(Control, Input) {
	
	function Widget() {
		Widget.super_.apply(this, arguments);
	};
	Control.extend(Widget, {
		type: 'checkbox',
		name: null,
		value: null,
		wrapperLabel: null,
		checkedValue: 1,
		uncheckValue: 0
	});
	var proto = Widget.prototype;
	
	Control.types.checkbox = Widget;
	
	proto._create = function(container, parent, elm) {
		var label = $('<label class="checkbox" />')
				.attr('for', this.options.id);
		
		this.hidden = new Input(this._getHiddenOptions(this.options));
		this.hidden.create(label, this);
		
		this.input = new Input(this.options);
		this.input.create(label, this);
		
		if(this.options.label) {
			label.append(' ' + Widget.escape(this.options.label));
		}
		
		return label;
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
			id: null,
			name: options.name,
			value: options.uncheckValue
		};
	};
	
	proto._render = function(options) {
		this.hidden.render(this._getHiddenOptions(options));
		this.input.render(options);
	};
	
	return Widget;
});