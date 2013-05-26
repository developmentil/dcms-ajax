define([
	'core/dcms-ajax', 
	'core/widgets/Control', 'core/widgets/MultiControl'
], function(DA, Control, MultiControl) {
	
	function Widget() {
		Widget.super_.apply(this, arguments);
	};
	MultiControl.extend(Widget);
	var proto = Widget.prototype;
	
	Control.types.select = Widget;
	
	proto.defaults = {
		name: null,
		value: null,
		options: [],
		optionGroups: []
	};
	
	proto._create = function(container, parent, elm) {
		if(!elm)
			elm = $('<select />');
		
		elm = Widget.super_.prototype._create.call(this, container, parent, elm);
		
		elm.attr('type', this.options.type);
		
		return elm;
	};
	
	proto._render = function(options) {
		this._elm.empty();
		
		for(var i in options.optionGroups) {
			var group = DA.Widget.configElm(
					$('<optgroup />'), 
					this.options.optionGroups[i]
			)
			.appendTo(this._elm)
			.attr('label', options.optionGroups[i].label || i);
	
			this._renderOptions(
					options.optionGroups[i].options || 
					options.optionGroups[i]
			, group);
		}
		
		this._renderOptions(options.options, this._elm);
	};
	
	proto._renderOptions = function(options, container) {
		for(var i in options) {
			var val = options[i].value || i;
			
			DA.Widget.configElm($('<option />'), options[i])
			.appendTo(container)
			.attr('value', val)
			.prop('selected', this.isVal(val))
			.text(options[i].label || options[i]);
		}
	};
	
	return Widget;
});