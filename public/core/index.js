define([
	'core/dcms-ajax',
	
	'core/plugins/layout',
	
	'core/widgets/Toolbar', 
	'core/widgets/Button', 'core/widgets/ButtonGroup',
	
	'core/widgets/Nav', 
	'core/widgets/Dropdown', 'core/widgets/NavBar', 
	
	'core/widgets/Tabs', 'core/widgets/Tab', 
	
	'core/widgets/Table', 'core/widgets/Browser',
	'core/widgets/Pagination',
	
	'core/widgets/Container', 'core/widgets/Fieldset', 
	'core/widgets/Form', 'core/widgets/FormHorizontal', 
	'core/widgets/ControlGroup', 'core/widgets/FormActions',
	
	'core/widgets/Control', 'core/widgets/MultiControl',
	'core/widgets/Input', 'core/widgets/Checkbox', 'core/widgets/Select'
], function(
		DA, layout, 
		Toolbar, Button, ButtonGroup, 
		Nav, Dropdown, NavBar, Tabs, Tab, 
		Table, Browser, Pagination, 
		Container, Fieldset, Form, FormHorizontal, ControlGroup, FormActions, 
		Control, MultiControl, Input, Checkbox, Select) {
	
	DA.registry.set('plugins.layout', {
		_path: false
	});
	DA.plugins.layout = layout;
	
	DA.Widget.Toolbar = Toolbar;
	DA.Widget.Button = Button;
	DA.Widget.ButtonGroup = ButtonGroup;
	
	DA.Widget.Nav = Nav;
	DA.Widget.Dropdown = Dropdown;
	DA.Widget.NavBar = NavBar;
	
	DA.Widget.Tabs = Tabs;
	DA.Widget.Tab = Tab;
	
	DA.Widget.Table = Table;
	DA.Widget.Browser = Browser;
	DA.Widget.Pagination = Pagination;
	
	DA.Widget.Container = Container;
	DA.Widget.Fieldset = Fieldset;
	DA.Widget.Form = Form;
	DA.Widget.FormHorizontal = FormHorizontal;
	DA.Widget.ControlGroup = ControlGroup;
	DA.Widget.FormActions = FormActions;
	
	DA.Widget.Control = Control;
	DA.Widget.MultiControl = MultiControl;
	DA.Widget.Input = Input;
	DA.Widget.Checkbox = Checkbox;
	DA.Widget.Select = Select;
	
	return DA;
});
