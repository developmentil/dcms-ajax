define(['core/widgets/ControlsContainer'], function(ControlsContainer) {
	
	function Widget() {
		Widget.super_.apply(this, arguments);
	};
	ControlsContainer.extend(Widget);
	var proto = Widget.prototype;
	
	proto.defaults = $.extend({
		action: '',
		method: 'post',
		fieldsets: []
	}, proto.defaults);
	
	proto.create = function() {
		var elm = Widget.super_.prototype.create.apply(this, arguments);
		
		for(var i in this.options.fieldsets) {
			this.insert(this.options.fieldsets[i]);
		}
		this.options.fieldsets = [];
		
		return elm;
	};
	
	proto._create = function() {		
		return $('<form />')
				.attr('action', this.options.action)
				.attr('method', this.options.method);
	};
	
	return Widget;
});