define(['core/dcms-ajax'], function(DA) {
	
	function Widget() {
		Widget.super_.apply(this, arguments);
	};
	DA.Widget.extend(Widget, {
		tag: 'div',
		content: null,
		html: null
	});
	var proto = Widget.prototype;
	
	proto._create = function(container, parent, elm) {
		if(!elm)
			elm = $('<' + this.options.tag + ' />');
		
		return Widget.super_.prototype._create.call(this, container, parent, elm);
	};
	
	
	proto._render = function(options) {
		Widget.super_.prototype._render.apply(this, arguments);
		
		if(!options.html)
			this._elm.text(options.content);
		else
			this._elm.append(options.content);
	};
	
	return Widget;
});