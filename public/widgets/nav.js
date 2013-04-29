define(function() {
	function widget() {
		widget.super_.apply(this, arguments);
	};
	DA.inherits(widget, DA.Widget);
	
	widget.prototype.render = function() {
		var nav = $('<ul class="nav" />');
		
		$.each(this.options.items, function(i, item) {
			var li = $('<li />').appendTo(nav),
			a = $('<a href="#" />').appendTo(li);
			
			a.text(item.label || item)
			.click(function(e) {
				e.preventDefault();
				
				if(item.click)
					item.click(e);
			});
		});
		
		return nav;
	};
	
	return widget;
});