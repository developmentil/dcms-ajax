define(['widgets/NavBar'], function(NavBar) {
	DA.registry.set('layout.menus.main', []);
		
	var navbar = new NavBar();
	navbar.create('body');
		
	DA.tabs = {
		create: function() {}
	};
		
	DA.on('runned', function(callback) {
		navbar.render({
			brand: DA.registry.get('layout.brand'),
			items: DA.registry.get('layout.menus.main')
		});

		callback();
	});
});