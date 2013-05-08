define(['core/dcms-ajax', 'core/widgets/Nav'], function(DA, Nav) {
	
	function Widget() {
		Widget.super_.apply(this, arguments);
	};
	DA.Widget.extend(Widget);
	var proto = Widget.prototype;
	
	proto.defaults = {
		id: 'tabs',
		items: [],
		navClass: 'nav-tabs'
	};
	
	proto.createTab = function(tab) {
		if(typeof tab !== 'object')
			tab = {label: tab};
		
		tab = $.extend({
			active: true
		}, tab);
		
		this.options.items.push(tab);
		if(tab.active) {
			for(var i in this.options.items)
				this.options.items[i].active = false;
			
			tab.active = true;
		}
		
		return tab;
	};
	
	proto.create = function(container) {
		this._elm = $('<div class="tabbable" />');
		if(container)
			this._elm.appendTo(container);
		
		if(this.options.id)
			this._elm.attr('id', this.options.id);
		
		if(this.options.className)
			this._elm.addClass(this.options.className);
		
		this.nav = new Nav($.extend(this.options.nav || {}, {
			items: this.options.items,
			className: this.options.navClass
		}));
		this.nav.create(this._elm);
		
		this._content = $('<div class="tab-content" />')
				.appendTo(this._elm);
		
		return this._elm;
	};
	
	proto._render = function(options) {
		var self = this;
		
		this._content.empty();
		$.each(options.items, function(i, item) {
			var id = item.id || (options.id + '-tab-' + i),
			
			pane = $('<div class="tab-pane" />')
			.attr('id', id)
					.appendTo(self._content);
			
			item.url = '#' + id;
			item.toggle = 'tab';
	
			if(item.active)
				pane.addClass('active');
	
			if(item.className)
				pane.addClass(item.className);
			
			if(item.content)
				pane.append(item.content);
		});
		
		this.nav.render(options);
	};
	
	return Widget;
});