define(['core/dcms-ajax', 'core/widgets/Nav'], function(DA, Nav) {
	
	function Widget() {
		Widget.super_.apply(this, arguments);
	};
	DA.Widget.extend(Widget);
	var proto = Widget.prototype;
	
	
	proto._create = function(container, parent, elm) {
		if(!elm)
			elm = $('<div class="navbar" />');
		
		this._inner = $('<div class="navbar-inner" />')
				.appendTo(elm);
		
		this.nav = new Nav(this.options);
		this.nav.create(this._inner, this);
		
		return elm;
	};
	
	proto._render = function(options) {
		var self = this;
		
		this._inner.children('a.brand').remove();
		
		if(options.brand) {
			var brand = $('<a class="brand" />')
			.attr('href', options.brand.url || '#/')
			.prependTo(this._inner)
			.text(options.brand);
	
			if(options.brand.click) {
				brand.click(function(e) {
					e.preventDefault();
					self.options.brand.click(e);
				});
			}
		}
		
		this.nav.render(options);
	};
	
	return Widget;
});