define(['core/dcms-ajax', 'core/widgets/Container'
], function(DA, Container) {
	
	function Widget() {
		Widget.super_.apply(this, arguments);
		
		this._controls = {};
	};
	Container.extend(Widget);
	var proto = Widget.prototype;
	
	proto._create = function(container, parent, elm) {
		if(!elm)
			elm = $('<div class="btn-toolbar" />');
		
		return Widget.super_.prototype._create.call(this, container, parent, elm);
	};
	
	return Widget;
});