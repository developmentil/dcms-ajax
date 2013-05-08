define(['core/dcms-ajax'], function(DA) {
	
	function Widget() {
		Widget.super_.apply(this, arguments);
	};
	DA.Widget.extend(Widget);
	var proto = Widget.prototype;
	
	proto.defaults = {
		items: []
	};
	
	proto.create = function(container) {		
		this._elm = $('<ul class="nav" />');
		if(container)
			this._elm.appendTo(container);
		
		if(this.options.id)
			this._elm.attr('id', this.options.id);
		
		if(this.options.className)
			this._elm.addClass(this.options.className);
		
		return this._elm;
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