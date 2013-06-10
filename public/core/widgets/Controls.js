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
		wrappable: true,
		glue: ' '
	});
//	var proto = Widget.prototype;
	
	Control.types.container = Widget;
	
	return Widget;
});