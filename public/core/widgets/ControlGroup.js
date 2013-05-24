define(['core/widgets/ControlsContainer'], function(ControlsContainer) {
	
	function Widget(controls) {
		if(!Array.isArray(controls))
			controls = [controls];
		
		Widget.super_.call(this, $.extend({
			controls: controls
		}, controls[0].options));
	};
	ControlsContainer.extend(Widget);
	var proto = Widget.prototype;
	
	proto.defaults = $.extend({
		label: null
	}, proto.defaults);
	
	proto._create = function(container, parent, elm) {
		if(!elm)
			elm = $('<div class="control-group" />');
		
		this._container = $('<div class="controls" />')
				.appendTo(elm);
		
		if(this.options.wrapperId)
			elm.attr('id', this.options.wrapperId);
		
		if(this.options.wrapperClass)
			elm.addClass(this.options.wrapperClass);
		
		return elm;
	};
	
	proto._render = function(options) {
		var label = this._elm.children('label');
		if(options.label) {
			if(!label.length)
				label = $('<label class="control-label" />').prependTo(this._elm);
			
			label.text(options.label);
		} else if(label.length)
			label.remove();
		
		Widget.super_.prototype._render.call(this, options);
	};
	
	return Widget;
});