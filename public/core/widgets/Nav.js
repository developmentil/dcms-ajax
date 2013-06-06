define(['core/dcms-ajax'], function(DA) {
	
	function Widget() {
		Widget.super_.apply(this, arguments);
	};
	DA.Widget.extend(Widget, {
		items: []
	});
	var proto = Widget.prototype;
	
	Widget.renderItems = function(items, container) {
		// use for..in to ignore undefined items
		for(var i in items) {
			Widget.renderItem(items[i], container);
		}
	};
	
	Widget.renderItem = function(item, ul) {
		var li = Widget._createItem(item, ul);
		
		if(item.items) {
			li.addClass('dropdown');
			
			li.children('a:first')
			.addClass('dropdown-toggle')
			.attr('data-toggle', 'dropdown')
			.append(' <b class="caret" />');

			var ul = $('<ul class="dropdown-menu" />')
					.appendTo(li);

			if(DA.Widget.Dropdown)
				DA.Widget.Dropdown.renderItems(item.items, ul);
			else
				Widget.renderItems(item.items, ul);
		}
		
		return li;
	};
	
	Widget._createItem = function(item, ul) {
		var li = DA.Widget.configElm($('<li />'), item).appendTo(ul);

		var a = $('<a />').appendTo(li)
		.attr('tabindex', item.tabindex || -1)
		.attr('href', item.url || '#')
		.text(item.label || item);

		if(item.toggle)
			a.attr('data-toggle', item.toggle);

		if(item.icon) {
			a.prepend(' ');
			
			$('<i />')
			.prependTo(a)
			.addClass(item.icon.className || item.icon);
		}

		if(item.closeIcon) {
			a.append(' ');
			
			var closeIcon = $('<i class="close" />')
			.appendTo(a)
			.addClass(item.closeIcon.className || 'close')
			.append(item.closeIcon.html || '&times;');
	
			if(item.closeIcon.click) {
				closeIcon.click(function(e) {
					if(!item.closeIcon.useDefault)
						e.preventDefault();
					
					item.closeIcon.click(e);
				});
			}
		}

		if(item.active)
			li.addClass('active');

		if(item.disabled)
			li.addClass('disabled');

		if(item.click) {
			a.click(function(e) {
				if(!item.useDefault)
					e.preventDefault();
				
				item.click(e);
			});
		}

		if(item.dblclick) {
			a.dblclick(function(e) {
				if(!item.useDefault)
					e.preventDefault();
				
				item.dblclick(e);
			});
		}
		
		return li;
	};
	
	proto._create = function(container, parent, elm) {
		if(!elm)
			elm = $('<ul class="nav" />');
		
		return Widget.super_.prototype._create.call(this, container, parent, elm);
	};
	
	proto._render = function(options) {
		this._elm.empty();
		
		Widget.renderItems(options.items, this._elm);
	};
	
	return Widget;
});