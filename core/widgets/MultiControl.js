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
		
		for(var i in this.options.value) {
			if(this.options.value[i] == val)
				return true;
		}
		return false;
	};
	
	proto._renderIsSend = function(options) {
		if(options.multiple || this.isSend())
			this._elm.attr('name', this.getInputName());
		else
			this._elm.removeAttr('name');
	};
	
	return Widget;
});