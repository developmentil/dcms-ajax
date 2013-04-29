define(function() {
	
	function Widget() {
		Widget.super_.apply(this, arguments);
	};
	DA.Widget.extend(Widget);
	
	Widget.prototype.create = function(container) {		
		this._elm = $('<ul class="nav" />');
		if(container)
			this._elm.appendTo(container);
		
		return this._elm;
	};
	
	Widget.prototype._render = function(options) {
		var self = this;
		this._elm.empty();
		
		for(var i in options.items) {
			(function(item) {
				
				var li = $('<li />').appendTo(self._elm),
				a = $('<a />').appendTo(li)
				.attr('href', item.url || '#')
				.text(item.label || item);

				if(item.click) {
					a.click(function(e) {
						e.preventDefault();
						item.click(e);
					});
				}
				
			})(options.items[i]);
		}
	};
	
	return Widget;
});