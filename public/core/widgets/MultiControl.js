define(['core/widgets/Control'], function(Control) {
	
	function Widget() {
		Widget.super_.apply(this, arguments);
	};
	Control.extend(Widget);
	var proto = Widget.prototype;
	
	proto.isVal = function(val) {
		if(!Array.isArray(this.options.value))
			return Widget.super_.prototype.isVal.apply(this, arguments);
		
		return (~this.options.value.indexOf(val));
	};
	
	proto._render = function() {
		throw new Error('Unimplement method');
	};
	
	return Widget;
});