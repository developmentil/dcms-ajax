define(['core/dcms-ajax', 'core/libs/async', 
	'core/widgets/Container', 'core/widgets/Nav', 'core/widgets/Tab'
], function(DA, async, Container, Nav, Tab) {
	
	function Widget() {
		Widget.super_.apply(this, arguments);
	};
	Container.extend(Widget);
	var proto = Widget.prototype;
	
	proto.defaults = {
		id: 'tabs',
		navClass: 'nav-tabs'
	};
	
	proto.insert = function(tab) {
		if(!(tab instanceof Tab)) {
			tab = Tab.create(tab);
		}
		
		if(tab.options.active)
			this.setActive(tab);
		
		tab = Widget.super_.prototype.insert.call(this, tab);
		
		this._renderNav();
		return tab;
	};
	
	proto.remove = function() {
		Widget.super_.prototype.remove.apply(this, arguments);
		
		if(this._children.length > 0)
			this.setActive(this._children[0]);

		this._renderNav();
		return this;
	};
	
	proto.setActive = function(tab, skipUi) {
		this.eachChild(function(tab) {
			tab.active(false, skipUi);
		});

		tab.active(true, skipUi);
		return this;
	};
	
	proto._create = function(container, parent, elm) {
		if(!elm)
			elm = $('<div class="tabbable" />');
		
		this.nav = new Nav(this._getNavOptions(this.options));
		var self = this,
		nav = this.nav.create(elm, this);
		
		nav.on('shown', 'a[data-toggle="tab"]', function(e) {
			var curr = $(e.target).parent().prevAll().length;
			
			if(!self._children[curr])
				return;
			
			self.setActive(self._children[curr], true);
		});
		
		this._container = $('<div class="tab-content" />')
				.appendTo(elm);
		
		elm = Widget.super_.prototype._create.call(this, container, parent, elm);
		
		return elm;
	};
	
	proto._destroy = function() {
		this.nav.destroy();
		this.nav = null;
		
		Widget.super_.prototype._destroy.apply(this, arguments);
	};
	
	proto._getNavOptions = function(options) {
		var items = [];
		
		this.eachChild(function(tab) {
			var item = tab.options;
			
			item.url = '#' + item.id;
			item.toggle = 'tab';
			
			items.push(item);
		});
		
		return $.extend(options.nav || {}, {
			items: items,
			className: options.navClass
		});
	};
	
	proto._load = function(callback) {
		var tasks = [];
		
		this.eachChild(function(tab) {
			tasks.push(function(callback) {
				tab.load(true, callback);
			});
		});
		
		async.parallel(tasks, callback);
	};
	
	proto._render = function(options) {		
		Widget.super_.prototype._render.apply(this, arguments);
		
		this._renderNav(options);
	};
	
	proto._renderNav = function(options) {
		this.nav.render(this._getNavOptions(options || this.options));
	};
	
	return Widget;
});