define(['core/widgets/Container'], function(Container) {
	
	function Widget(controls) {
		Widget.super_.call(this, !Array.isArray(controls) ? controls.options : controls[0].options);
	};
	Container.extend(Widget);
	var proto = Widget.prototype;
	
	proto.defaults = {
		label: null
	};
	
	proto.create = function(container) {
		this._elm = $('<div class="control-group" />');
		if(container)
			this._elm.appendTo(container);
		
		this._container = $('<div class="controls" />').appendTo(this._elm);
		
		if(this.options.wrapperId)
			this._elm.attr('id', this.options.wrapperId);
		
		if(this.options.wrapperClass)
			this._elm.addClass(this.options.wrapperClass);
		
		return this._elm;
	};
	
	proto._render = function(options) {
		var label = this._elm.children('label');
		if(options.label) {
			if(!label.length)
				label = $('<label />').prependTo(this._elm);
			
			label.text(options.label);
		} else if(label.length)
			label.remove();
		
		Widget.super_.prototype._render.call(this, options);
	};
	
	return Widget;
});