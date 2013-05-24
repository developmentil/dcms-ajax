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
	
	proto._create = function(container, parent, elm) {
		if(!elm)
			elm = $('<div class="tab-pane" />');
		
		return Widget.super_.prototype._create.call(this, container, parent, elm);
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