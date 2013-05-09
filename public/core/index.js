define([
	'core/dcms-ajax',
	'core/plugins/layout',
	'core/widgets/Nav', 'core/widgets/NavBar', 
	'core/widgets/Tabs', 'core/widgets/Tab', 
	'core/widgets/Table', 'core/widgets/Browser'
], function(DA, layout, Nav, NavBar, Tabs, Tab, Table, Browser) {
	
	DA.registry.set('plugins.layout', {
		_path: false
	});
	DA.plugins.layout = layout;
	
	DA.Widget.Nav = Nav;
	DA.Widget.NavBar = NavBar;
	DA.Widget.Tabs = Tabs;
	DA.Widget.Tab = Tab;
	DA.Widget.Table = Table;
	DA.Widget.Browser = Browser;
	
	return DA;
});
