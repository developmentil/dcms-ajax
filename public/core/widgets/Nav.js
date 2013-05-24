define(['core/dcms-ajax'], function(DA) {
	
	function Widget() {
		Widget.super_.apply(this, arguments);
	};
	DA.Widget.extend(Widget);
	var proto = Widget.prototype;
	
	proto.defaults = {
		items: []
	};
	
	proto._create = function(container, parent, elm) {
		if(!elm)
			elm = $('<ul class="nav" />');
		
		return Widget.super_.prototype._create.call(this, container, parent, elm);
	};
	
	proto._render = function(options) {
		var self = this;
		this._elm.empty();
		
		// use for..in insead of $.each to ignore undefined items
		for(var i in options.items) {
			(function(item) {
				var li = $('<li />').appendTo(self._elm),
				a = $('<a />').appendTo(li)
				.attr('href', item.url || '#')
				.text(item.label || item);

				if(item.active)
					li.addClass('active');

				if(item.className)
					li.addClass(item.className);

				if(item.toggle)
					a.attr('data-toggle', item.toggle);

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