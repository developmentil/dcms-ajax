define(['widgets/navbar'], function(Navbar) {
	var plugin = function() {
		plugin.super_.apply(this, arguments);
		
		this.navbar = new Navbar(this.options);
		
		var self = this;
		DA.on('load', function() {
			self.navbar.rander().appendTo('body');
		});
	};
	DA.inherits(plugin, DA.Plugin);
	
	return plugin;
});