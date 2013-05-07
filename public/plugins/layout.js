define(['widgets/NavBar'], function(NavBar) {
	DA.registry.set('layout.menus.main', []);
		
	var navbar = new NavBar();
	navbar.create('body');
		
	DA.tabs = {
		create: function() {}
	};
		
	DA.when('runned', function(callback) {
		navbar.render({
			brand: DA.registry.get('layout.brand'),
			items: DA.registry.get('layout.menus.main')
		});

		callback();
	});
});