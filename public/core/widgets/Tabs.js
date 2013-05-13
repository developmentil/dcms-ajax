define(['core/dcms-ajax', 'core/libs/async', 
	'core/widgets/Nav', 'core/widgets/Tab'
], function(DA, async, Nav, Tab) {
	
	function Widget() {
		Widget.super_.apply(this, arguments);
		
		this._tabs = [];
	};
	DA.Widget.extend(Widget);
	var proto = Widget.prototype;
	
	proto.defaults = {
		id: 'tabs',
		navClass: 'nav-tabs'
	};
	
	proto.createTab = function(tab) {
		if(!(tab instanceof Tab)) {
			if(typeof tab !== 'object')
				tab = {label: tab};

			tab = $.extend({
				label: 'Tab',
				active: true,
				id: this.options.id + '-tab' + Math.floor(Math.random() * 1000)
			}, tab);

			tab = new Tab(tab);
		}
		
		tab.create(this._content);
		this._tabs.push(tab);
		this._markAsLoaded = false;
		
		if(tab.options.active)
			this.setActive(tab);
		
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
		
		this.nav = new Nav(this._getNavOptions(this.options));
		this.nav.create(this._elm);
		
		this._content = $('<div class="tab-content" />')
				.appendTo(this._elm);
		
		return this._elm;
	};
	
	proto.setActive = function(tab) {
		for(var i in this._tabs)
			this._tabs[i].options.active = false;

		tab.options.active = true;
		return this;
	};
	
	proto._getNavOptions = function(options) {
		var items = [];
		
		for(var i in this._tabs) {
			var item = this._tabs[i].options;
			
			item.url = '#' + item.id;
			item.toggle = 'tab';
			
			items.push(item);
		}
		
		return $.extend(options.nav || {}, {
			items: items,
			className: options.navClass
		});
	};
	
	proto._load = function(callback) {
		var tasks = [];
		for(var i in this._tabs) {
			(function(tab) {
				tasks.push(function(callback) {
					tab.load(callback);
				});
			})(this._tabs[i]);
		}
		
		async.parallel(tasks, callback);
	};
	
	proto._render = function(options) {		
		for(var i in this._tabs)
			this._tabs[i].render();
		
		this.nav.render(this._getNavOptions(options));
	};
	
	return Widget;
});