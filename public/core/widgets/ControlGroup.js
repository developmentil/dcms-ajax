define(['core/dcms-ajax', 
	'core/widgets/ControlsContainer', 'core/widgets/Control'
], function(DA, ControlsContainer, Control) {
	
	function Widget(options) {
		var controls = options.controls;
		if(!Array.isArray(controls))
			controls = [controls];
		
		var defOpts = (controls[0] instanceof DA.Widget) ? controls[0].options : controls[0];		
		for(var i in defOpts) {
			if(options[i] === undefined)
				options[i] = defOpts[i];
		}
		
		Widget.super_.call(this, options);
	};
	ControlsContainer.extend(Widget, {
		wrapperLabel: null,
		label: null,
		glue: ' '
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