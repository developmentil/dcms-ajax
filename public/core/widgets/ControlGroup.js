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
	
	proto.create = function(container) {
		this._elm = $('<div class="control-group" />');
		if(container)
			this._elm.appendTo(container);
		
		this._container = $('<div class="controls" />')
				.appendTo(this._elm);
		
		if(this.options.wrapperId)
			this._elm.attr('id', this.options.wrapperId);
		
		if(this.options.wrapperClass)
			this._elm.addClass(this.options.wrapperClass);
		
		for(var i in this.options.controls) {
			this.insert(this.options.controls[i]);
		}
		this.options.controls = [];
		
		return this._elm;
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