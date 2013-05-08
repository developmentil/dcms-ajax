define(['widgets/NavBar', 'widgets/Tabs'], function(NavBar, Tabs) {
	DA.registry.set('layout.menus.main', []);
		
	DA.layout = {
		navbar: new NavBar()
	};
	DA.tabs = new Tabs({
		navClass: 'nav-pills'
	});
	
	DA.layout.navbar.create('body');
	DA.tabs.create('body');
		
	DA.when('runned', function(callback) {
		DA.on('render', function() {
			DA.layout.navbar.render({
				brand: DA.registry.get('layout.brand'),
				items: DA.registry.get('layout.menus.main')
			});

			DA.tabs.render();
		});

		callback();
	});
});