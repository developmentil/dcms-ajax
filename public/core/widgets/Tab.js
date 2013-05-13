define(['core/dcms-ajax'], function(DA) {
	
	function Widget(options, tabs) {
		Widget.super_.apply(this, arguments);
		
		this._tabs = tabs;
	};
	DA.Widget.extend(Widget);
	var proto = Widget.prototype;
	
	proto.defaults = {
		active: false
	};
	
	proto.create = function(container) {
		this._elm = $('<div class="tab-pane" />');
		if(container)
			this._elm.appendTo(container);
		
		if(this.options.id)
			this._elm.attr('id', this.options.id);
		
		if(this.options.className)
			this._elm.addClass(this.options.className);
		
		return this._elm;
	};
	
	proto._load = function(callback) {
		callback(null);
	};
	
	proto._render = function(options) {
		if(options.active)
			this._elm.addClass('active');
		else
			this._elm.removeClass('active');
	};
	
	return Widget;
});