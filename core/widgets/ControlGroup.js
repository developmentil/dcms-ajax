define([
	'core/widgets/Controls', 'core/widgets/Control'
], function(Controls, Control) {
	
	function Widget() {
		Widget.super_.apply(this, arguments);
	};
	Controls.extend(Widget, {
		wrappable: false,
		wrapperLabel: null,
		label: null
	});
	var proto = Widget.prototype;
	
	Control.types.group = Widget;
	
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
		if(options.wrapperLabel || (options.label && options.wrapperLabel !== false)) {
			if(!label.length)
				label = $('<label class="control-label" />').prependTo(this._elm);
			
			label
			.attr('for', options.id || options.name)
			.text(options.wrapperLabel || options.label);
				
		} else if(label.length)
			label.remove();
		
		this.eachChild(function(widget) {
			widget.render();
		});
	};
	
	return Widget;
});