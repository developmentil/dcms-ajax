define(['core/dcms-ajax', 'core/libs/async', 
	'core/widgets/Container', 'core/widgets/Nav', 'core/widgets/Tab'
], function(DA, async, Container, Nav, Tab) {
	
	function Widget() {
		Widget.super_.apply(this, arguments);
	};
	Container.extend(Widget, {
		navClass: 'nav-tabs',
		labelMaxLength: 30,
		closeIcon: false,
		rememberScroll: false
	});
	var proto = Widget.prototype;
	
	
	proto.refreshTarget = function(target) {
		var tab = Tab.find(target);
		if(tab) {
			tab.reload();
		}
		
		return this;
	};
	
	proto.removeTarget = function(target) {
		var tab = Tab.find(target);
		if(tab) {
			this.remove(tab);
		}
		
		return this;
	};
	
	proto.findByLocation = function(location) {
		location = DA.realLocation(location);
		
		var tabs = [];
		this.eachChild(function(tab) {
			if(DA.realLocation(tab.options.location) === location)
				tabs.push(tab);
		});
		
		return tabs;
	};
	
	proto.refreshByLocation = function(location) {
		var tabs = this.findByLocation(location);
		
		$.each(tabs, function(i, tab) {
			tab.reload();
		});
		
		return tabs;
	};
	
	proto.insert = function(tab) {
		if(!(tab instanceof Tab)) {
			tab = Tab.create(tab);
		}
		
		if(tab.options.active) {
			if(this.options.rememberScroll)
				this.eachChild(function(tab) {
					if(!tab.active()) return;

					tab.options.scrollTop = $(window).scrollTop();
				});
				
			this.setActive(tab);
		}
		
		tab = Widget.super_.prototype.insert.call(this, tab);
		
		this._renderNav();
		return tab;
	};
	
	proto.remove = function(tab) {
		Widget.super_.prototype.remove.apply(this, arguments);
		
		if(this._children.length > 0) {
			this.setActive(this._children[this._children.length-1]);
		} else if(tab.options.location) {
			DA.setLocation('#/');
			this._renderNav();
		}
		
		return this;
	};
	
	proto.setActive = function(tab, skipUi) {
		this.eachChild(function(tab) {
			tab.active(false, skipUi);
		});

		tab.active(true, skipUi);
		
		if(!skipUi)
			this._renderNav();
		
		if(typeof tab.options.scrollTop === 'number')
			$(window).scrollTop(tab.options.scrollTop);
		
		return this;
	};
	
	proto.renderNav = function() {
		this._renderNav();
		return this;
	};
	
	proto._create = function(container, parent, elm) {
		if(!elm)
			elm = $('<div class="tabbable" />');
		
		this.nav = new Nav(this._getNavOptions(this.options));
		var self = this,
		nav = this.nav.create(elm, this);
		
		nav.on('show', 'a[data-toggle="tab"]', function(e) {
			var curr = $(e.relatedTarget).parent().prevAll().length;
			
			if(!self._children[curr])
				return;
			
			if(self.options.rememberScroll)
				self._children[curr].options.scrollTop = $(window).scrollTop();
		});
		
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
		var self = this,
		items = [];
		
		this.eachChild(function(tab) {
			var item = $.extend({}, tab.options),
			maxlen = self.options.labelMaxLength;
			
			item.id = null;
			item.url = '#' + tab.options.id;
			item.toggle = 'tab';
			
			if(self.options.closeIcon && !tab.options.hideCloseIcon) {
				item.middleclick = function() {
					self.remove(tab);
				};
				
				item.closeIcon = {
					click: item.middleclick
				};
			}
			
			if(item.label && item.label.length > maxlen) {
				if(!item.attr)
					item.attr = {};
				item.attr.title = item.label;
				
				item.label = item.label.substr(0, maxlen-1) + '…';
			}
			
			items.push(item);
		});
		
		return $.extend(options.nav || {}, {
			items: items,
			class: options.navClass
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