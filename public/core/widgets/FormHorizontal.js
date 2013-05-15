define(['core/widgets/Form', 'core/widgets/ControlGroup'], function(Form, ControlGroup) {
	
	function Widget() {
		Widget.super_.apply(this, arguments);
	};
	Form.extend(Widget);
	var proto = Widget.prototype;
	
	proto.defaults = $.extend({}, proto.defaults, {
		className: 'form-horizontal',
		wrapper: ControlGroup
	});
	
	return Widget;
});