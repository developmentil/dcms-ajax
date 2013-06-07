define(['core/dcms-ajax', 'core/widgets/Container'], function(DA, Container) {
	
	var inverval = 0;
	
	function Widget() {
		Widget.super_.apply(this, arguments);
		
		if(!this.options.id)
			this.options.id = 'tab-' + (++inverval);
		
		if(this.options.location === true)
			this.options.location = DA.getLocation();
	};
	Container.extend(Widget, {
		label: 'Tab',
		active: true,
		hideCloseIcon: false,
		location: null
	});
	var proto = Widget.prototype;
	
	Widget.create = function(options) {
		if(typeof options === 'string')
			options = {label: options, location: true};
		else if(options.location === undefined)
			options.location = true;

		return new Widget(options);
	};
	
	Widget.find = function(target) {
		if(!target)
			return null;
		
		var tab = $(target).closest('.tab-pane');
		if(!tab.length)
			return null;
		
		var widget = tab.data('widget');
		if(!widget || !(widget instanceof Widget))
			return null;
				
		return widget;
	};
	
	proto.label = function(label) {
		if(typeof label === 'undefined')
			return this.options.label;
		
		this.options.label = label;
		if(this._parent)
			this._parent.renderNav();
		
		return this;
	};
	
	proto.active = function(flag, skipUi) {
		if(typeof flag === 'undefined')
			return (this.options.active || false);
		
		this.options.active = flag;
		
		if(!this._elm || skipUi)
			return this;
		
		if(flag) {
			this._elm.addClass('active');
			
			if(this.options.location)
				DA.setLocation(this.options.location);
		} else {
			this._elm.removeClass('active');
		}
		
		return this;
	};
	
	proto._create = function(container, parent, elm) {
		if(!elm)
			elm = $('<div class="tab-pane" />');
		
		return Widget.super_.prototype._create.call(this, container, parent, elm);
	};
	
	proto._render = function(options) {
		this.active(options.active);
		
		Widget.super_.prototype._render.apply(this, arguments);
	};
	
	return Widget;
});