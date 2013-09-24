define(['core/nls/index', 
	'core/widgets/NavBar', 'core/widgets/Tabs'
], function(i18n, NavBar, Tabs) {
	i18n = i18n.plugins.layout;
	
	var contentMenu = {
		label: i18n.ContentManagement,
		items: []
	};
	
	return function(DA, options) {
		DA.registry.set('layout.menus.main', []);
		DA.registry.set('layout.menus.auth', []);
		
		options = $.extend({
			defaultMenus: true
		}, options);
		
		if(options.defaultMenus) {
			DA.registry.set('layout.menus.content', contentMenu.items);
			DA.registry.push('layout.menus.main', 1000, contentMenu);
		}

		DA.layout = {
			navbar: new NavBar({
				id: 'navbar',
				class: 'navbar-fixed-top'
			})
		};
		DA.tabs = new Tabs({
			id: 'tabs',
			closeIcon: true
		});

		var navbar = DA.layout.navbar.create('body').hide();
		DA.tabs.create('body');
		
		DA.when('setLocation', function(options, callback) {
			if(options.bind === 'tabs') {
				var tabs = DA.tabs.refreshByLocation(options.location);
				if(tabs.length) {
					options.bind = false;
					DA.tabs.setActive(tabs[tabs.length-1]);
				}
			}
			
			callback(null);
		});

		DA.when('runned', function(callback) {
			DA.layout.navbar.render({
				brand: DA.registry.get('layout.brand'),
				items: DA.registry.get('layout.menus.main'),
				sideItems: DA.registry.get('layout.menus.auth')
			});
			navbar.slideDown();

			DA.tabs.load();

			callback();
		});
	};
});