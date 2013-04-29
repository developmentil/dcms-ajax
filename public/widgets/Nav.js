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
	
	Widget.prototype.render = function() {
		var self = this;
		this._elm.empty();
		
		$.each(this.options.items || [], function(i, item) {
			var li = $('<li />').appendTo(self._elm),
			a = $('<a href="#" />').appendTo(li);
			
			a.text(item.label || item)
			.click(function(e) {
				e.preventDefault();
				
				if(item.click)
					item.click(e);
			});
		});
		
		return this;
	};
	
	return Widget;
});