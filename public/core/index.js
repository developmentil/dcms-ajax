define([
	'core/dcms-ajax',
	
	'core/plugins/layout',
	
	'core/widgets/Nav', 'core/widgets/NavBar', 
	
	'core/widgets/Tabs', 'core/widgets/Tab', 
	
	'core/widgets/Table', 'core/widgets/Browser',
	'core/widgets/Pagination',
	
	'core/widgets/Container', 'core/widgets/Control',
	'core/widgets/Fieldset', 'core/widgets/Form', 
	'core/widgets/FormHorizontal', 'core/widgets/ControlGroup',
	
	'core/widgets/Input'
], function(DA, layout, Nav, NavBar, Tabs, Tab, Table, Browser, Pagination, 
			Container, Control, Fieldset, Form, FormHorizontal, ControlGroup, Input) {
	
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
	DA.Widget.Pagination = Pagination;
	
	DA.Widget.Container = Container;
	DA.Widget.Control = Control;
	DA.Widget.Fieldset = Fieldset;
	DA.Widget.Form = Form;
	DA.Widget.FormHorizontal = FormHorizontal;
	DA.Widget.ControlGroup = ControlGroup;
	
	DA.Widget.Input = Input;
	
	return DA;
});
