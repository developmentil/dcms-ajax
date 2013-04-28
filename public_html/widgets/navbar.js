define(['nav'], function(Nav) {
	function widget() {
		widget.super_.apply(this, arguments);
		
		this.nav = new Nav(this.options);
	};
	DA.inherits(widget, DA.Widget);
	
	widget.prototype.render = function() {
		var self = this,
		
		navbar = $('<div class="navbar" />'),
		inner = $('<div class="navbar-inner" />').appendTo(navbar);
		
		if(this.options.brand) {
			$('<a class="brand" href="#" />')
			.appendTo(inner)
			.text(this.options.brand)
			.click(function(e) {
				e.preventDefault();
				self.emit('brand', e);
			});
		}
		
		inner.append(this.nav.render());
		
		return navbar;
	};
	
	return widget;
});