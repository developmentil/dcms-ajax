define(['core/dcms-ajax', 'core/widgets/Dropdown'], function(DA, Dropdown) {
	
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
		
		// use for..in to ignore undefined items
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
						if(!item.useDefault)
							e.preventDefault();
						
						item.click(e);
					});
				}
				
				if(item.items) {
					li.addClass('dropdown');
					
					a.addClass('dropdown-toggle')
					.attr('data-toggle', 'dropdown')
					.append(' <b class="caret" />');
			
					var ul = $('<ul class="dropdown-menu" />')
							.appendTo(li);
					
					Dropdown.renderItems(item.items, ul);
				}
			})(options.items[i]);
		}
	};
	
	return Widget;
});