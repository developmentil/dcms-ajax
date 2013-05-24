define(['core/dcms-ajax'], function(DA) {
	
	var inverval = 0;
	
	function Widget(options, tabs) {
		Widget.super_.apply(this, arguments);
		
		this._tabs = tabs;
	};
	DA.Widget.extend(Widget);
	var proto = Widget.prototype;
	
	Widget.create = function(options) {
		if(typeof options !== 'object')
			options = {label: options};

		options = $.extend({
			label: 'Tab',
			active: true,
			id: 'tab-' + (++inverval)
		}, options);

		return new Widget(options);
	};
	
	proto.defaults = {
		active: false
	};
	
	proto.active = function(flag) {
		if(typeof flag === 'undefined')
			return (this.options.active || false);
		
		this.options.active = flag;
		
		if(!this._elm)
			return this;
		
		if(flag)
			this._elm.addClass('active');
		else
			this._elm.removeClass('active');
		
		return this;
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
		this.active(options.active);
	};
	
	return Widget;
});