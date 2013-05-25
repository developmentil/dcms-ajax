define(['core/dcms-ajax', 'core/widgets/Nav'], function(DA, Nav) {
	
	function Widget() {
		Widget.super_.apply(this, arguments);
	};
	Nav.extend(Widget);
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
			li.addClass('dropdown-submenu');
			
			var submenu = $('<ul class="dropdown-menu" />')
					.appendTo(li);
			
			Widget.renderItems(item.items, submenu);
		}
		
		return li;
	};
	
	Widget._createItem = function(item, ul) {
		if(item.divider) {
			var li = DA.Widget.configElm($('<li />'), item).appendTo(ul);

			if(item.divider) {
				li.addClass('divider');
				return li;
			}
		}
		
		return Widget.super_._createItem.apply(Widget.super_, arguments);
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