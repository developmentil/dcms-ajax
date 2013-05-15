define(['core/widgets/Control'], function(Control) {
	
	function Widget() {
		Widget.super_.apply(this, arguments);
	};
	Control.extend(Widget);
	var proto = Widget.prototype;
	
	Control.types.default = 
	Control.types.input = Widget;
	
	proto.defaults = {
		type: 'text',
		name: null,
		value: null
	};
	
	proto._create = function() {
		return $('<input />')
				.attr('type', this.options.type);
	};
	
	return Widget;
});