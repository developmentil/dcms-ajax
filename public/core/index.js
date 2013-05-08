define([
	'core/dcms-ajax',
	'core/plugins/layout',
	'core/widgets/Nav', 'core/widgets/NavBar', 'core/widgets/Tabs', 'core/widgets/Table'
], function(DA, layout, Nav, NavBar, Tabs, Table) {
	
	DA.registry.set('plugins.layout', {
		_path: false
	});
	DA.plugins.layout = layout;
	
	DA.Widget.Nav = Nav;
	DA.Widget.NavBar = NavBar;
	DA.Widget.Tabs = Tabs;
	DA.Widget.Table = Table;
	
	return DA;
});
