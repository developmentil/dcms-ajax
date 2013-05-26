define(['core/widgets/Control', 'core/widgets/Input'], function(Control, Input) {
	
	function Widget() {
		Widget.super_.apply(this, arguments);
	};
	Input.extend(Widget);
	var proto = Widget.prototype;
	
	Control.types.textarea = Widget;
	
	proto.defaults = {
		name: null,
		value: null,
		cols: null,
		rows: null,
		wrap: null
	};
	
	proto._create = function(container, parent, elm) {
		if(!elm)
			elm = $('<textarea />');
		
		elm = Widget.super_.prototype._create.call(this, container, parent, elm);
		
		elm.attr('type', this.options.type);
		
		if(this.options.cols)
			elm.attr('cols', this.options.cols);
		
		if(this.options.rows)
			elm.attr('rows', this.options.rows);
		
		if(this.options.wrap)
			elm.attr('wrap', this.options.wrap);
		
		return elm;
	};
	
	return Widget;
});