define(['widgets/NavBar'], function(NavBar) {
	
	function PlugIn() {
		PlugIn.super_.apply(this, arguments);
	};
	DA.PlugIn.extend(PlugIn);
	
	PlugIn.prototype._load = function(callback) {
		var self = this;
		DA.registry.set('layout.menus.main', []);
		
		this.navbar = new NavBar();
		this.navbar.create('body');
		
		DA.tabs = {
			create: function() {}
		};
		
		this.bind('loaded', function() {
			self.navbar.render();
		});
		
		callback(null);
	};
	
	return PlugIn;
});