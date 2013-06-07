define(['core/widgets/NavBar', 'core/widgets/Tabs'], function(NavBar, Tabs) {
	return function(DA) {
		DA.registry.set('layout.menus.main', []);

		DA.layout = {
			navbar: new NavBar({
				id: 'navbar',
				className: 'navbar-fixed-top'
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
				items: DA.registry.get('layout.menus.main')
			});
			navbar.slideDown();

			DA.tabs.load();

			callback();
		});
	};
});