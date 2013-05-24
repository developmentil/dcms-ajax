define(['core/dcms-ajax'], function(DA) {
	
	function Widget() {
		Widget.super_.apply(this, arguments);
	};
	DA.Widget.extend(Widget);
	var proto = Widget.prototype;
	
	Widget.renderItems = function(items, container) {
		// use for..in to ignore undefined items
		for(var i in items) {
			Widget.renderItem(items[i], container);
		}
	};
	
	Widget.renderItem = function(item, ul) {
		var li = $('<li />').appendTo(ul);

		if(item.className)
			li.addClass(item.className);

		if(item.divider) {
			li.addClass('divider');
			return li;
		}
				
		var a = $('<a />').appendTo(li)
		.attr('tabindex', item.tabindex || -1)
		.attr('href', item.url || '#')
		.text(item.label || item);

		if(item.disabled)
			li.addClass('disabled');

		if(item.click) {
			a.click(function(e) {
				if(!item.useDefault)
					e.preventDefault();
				
				item.click(e);
			});
		}
		
		if(item.items) {
			li.addClass('dropdown-submenu');
			
			var submenu = $('<ul class="dropdown-menu" />')
					.appendTo(li);
			
			Widget.renderItems(item.items, submenu);
		}
	};
	
	proto.defaults = {
		items: []
	};
	
	
	proto._create = function(container, parent, elm) {
		if(!elm)
			elm = $('<ul class="dropdown-menu" role="menu" aria-labelledby="dLabel" />');
		
		return Widget.super_.prototype._create.call(this, container, parent, elm);
	};
	
	proto._render = function(options) {
		this._elm.empty();
		
		Widget.renderItems(options.items, this._elm);
	};
	
	return Widget;
});