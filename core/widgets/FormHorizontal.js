define(['core/widgets/Form', 'core/widgets/ControlGroup'], function(Form, ControlGroup) {
	
	function Widget() {
		Widget.super_.apply(this, arguments);
	};
	Form.extend(Widget, {
		class: 'form-horizontal',
		wrapper: ControlGroup
	});
//	var proto = Widget.prototype;
	
	return Widget;
});