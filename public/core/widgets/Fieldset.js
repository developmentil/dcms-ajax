define(['core/widgets/ControlsContainer'], function(ControlsContainer) {
	
	function Widget() {
		Widget.super_.apply(this, arguments);
	};
	ControlsContainer.extend(Widget);
	var proto = Widget.prototype;
	
	proto.defaults = $.extend({
		legend: null
	}, proto.defaults);
	
	proto._create = function(container, parent, elm) {
		if(!elm)
			elm = $('<fieldset />');
		
		return Widget.super_.prototype._create.call(this, container, parent, elm);
	};
	
	proto._render = function(options) {
		var legend = this._elm.children('legend');
		if(options.legend) {
			if(!legend.length)
				legend = $('<legend />').prependTo(this._elm);
			
			legend.text(options.legend);
		} else if(legend.length)
			legend.remove();
		
		Widget.super_.prototype._render.call(this, options);
	};
	
	return Widget;
});