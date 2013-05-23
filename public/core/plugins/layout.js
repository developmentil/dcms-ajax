define(['core/widgets/NavBar', 'core/widgets/Tabs'], function(NavBar, Tabs) {
	return function(DA) {
		DA.registry.set('layout.menus.main', []);

		DA.layout = {
			navbar: new NavBar()
		};
		DA.tabs = new Tabs();

		DA.layout.navbar.create('body');
		DA.tabs.create('body');

		DA.when('runned', function(callback) {
			DA.on('app.after', function() {
				DA.layout.navbar.render({
					brand: DA.registry.get('layout.brand'),
					items: DA.registry.get('layout.menus.main')
				});

				DA.tabs.load();
			});

			callback();
		});
	};
});