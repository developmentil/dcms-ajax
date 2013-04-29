define(['widgets/Nav'], function(Nav) {
	
	function Widget() {
		Widget.super_.apply(this, arguments);
		
		this.nav = new Nav(this.options);
	};
	DA.Widget.extend(Widget);
	
	
	
	Widget.prototype.create = function(container) {
		this._elm = $('<div class="navbar" />');
		if(container)
			this._elm.appendTo(container);
		
		this._inner = $('<div class="navbar-inner" />')
				.appendTo(this._elm);
		this.nav.create(this._inner);
		
		return this._elm;
	}
	
	Widget.prototype.render = function() {
		var self = this;
		
		this._inner.children('a.brand').remove();
		
		if(this.options.brand) {
			var brand = $('<a class="brand" />')
			.href(this.options.brand.url || '#!/')
			.appendTo(this._inner)
			.text(this.options.brand);
	
			if(this.options.brand.click) {
				brand.click(function(e) {
					e.preventDefault();
					self.options.brand.click(e);
				});
			}
		}
		
		this.nav.render();
		return this;
	};
	
	return Widget;
});