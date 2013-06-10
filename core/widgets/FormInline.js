define(['core/widgets/Form'], function(Form) {
	
	function Widget() {
		Widget.super_.apply(this, arguments);
	};
	Form.extend(Widget, {
		class: 'form-inline',
		glue: ' '
	});
//	var proto = Widget.prototype;
	
	return Widget;
});