define(['core/widgets/Control'], function(Control) {
	
	function Widget() {
		Widget.super_.apply(this, arguments);
	};
	Control.extend(Widget, {
		multiple: false,
		multipleBrackets: '[]'
	});
	var proto = Widget.prototype;
	
	proto.getInputName = function() {
		var name = this.options.name;
		if(this.options.multiple && this.options.multipleBrackets) {
			name += this.options.multipleBrackets;
		}
		
		return name;
	};
	
	proto.isVal = function(val) {
		if(!this.options.multiple)
			return Widget.super_.prototype.isVal.apply(this, arguments);
		
		return (~this.options.value.indexOf(val));
	};
	
	return Widget;
});