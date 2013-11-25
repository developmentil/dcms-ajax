define([
	'core/dcms-ajax',
	
	'core/plugins/layout',
	'core/plugins/auth',
	'core/plugins/ui',
	
	'core/widgets/Tag', 
	'core/widgets/Toolbar', 
	'core/widgets/Button', 'core/widgets/ButtonGroup',
	'core/widgets/Modal', 
	
	'core/widgets/Nav', 
	'core/widgets/Dropdown', 'core/widgets/NavBar',
	
	'core/widgets/ProgressBar', 
	
	'core/widgets/Tabs', 'core/widgets/Tab', 
	
	'core/widgets/Table', 'core/widgets/Browser',
	'core/widgets/Pagination',
	
	'core/widgets/Container', 'core/widgets/Fieldset', 
	'core/widgets/Form', 'core/widgets/FormHorizontal' , 'core/widgets/FormInline', 
	'core/widgets/Controls', 'core/widgets/ControlGroup', 'core/widgets/FormActions',
	
	'core/widgets/Control', 'core/widgets/MultiControl',
	'core/widgets/Input', 'core/widgets/Checkbox', 'core/widgets/Select',
	'core/widgets/TextArea', 'core/widgets/HtmlEditor', 
	'core/widgets/Typeahead', 'core/widgets/Tags', 
	'core/widgets/FileUpload', 'core/widgets/DateInput',
	'core/widgets/Select2'
], function(
		DA, layout, auth, ui,
		Tag, Toolbar, 
		Button, ButtonGroup, 
		Modal,
		Nav, 
		Dropdown, NavBar, 
		ProgressBar, 
		Tabs, Tab, 
		Table, Browser, Pagination, 
		Container, Fieldset, Form, FormHorizontal, FormInline,
		Controls, ControlGroup, FormActions, 
		Control, MultiControl, Input, Checkbox, Select, 
		TextArea, HtmlEditor,
		Typeahead, Tags, FileUpload, DateInput, Select2) {
	
	
	// Plugins
	DA.registry.set('plugins.layout', {});
	DA.registry.set('plugins.ui', {});
	
	$.extend(DA.plugins, {
		layout: layout,
		auth: auth,
		ui: ui
	});
	
	
	// Widgets
	$.extend(DA.Widget, {
		Tag: Tag,
				
		Toolbar: Toolbar,
		Button: Button,
		ButtonGroup: ButtonGroup,
		Modal: Modal,
		
		Nav: Nav,
		Dropdown: Dropdown,
		NavBar: NavBar,
		
		ProgressBar: ProgressBar,
		
		Tabs: Tabs,
		Tab: Tab,
		
		Table: Table,
		Browser: Browser,
		Pagination: Pagination,
		
		Container: Container,
		Fieldset: Fieldset,
		Form: Form,
		FormHorizontal: FormHorizontal,
		FormInline: FormInline,
		Controls: Controls,
		ControlGroup: ControlGroup,
		FormActions: FormActions,
		
		Control: Control,
		MultiControl: MultiControl,
		Input: Input,
		Checkbox: Checkbox,
		Select: Select,
		TextArea: TextArea, Textarea: TextArea,
		HtmlEditor: HtmlEditor,
		Typeahead: Typeahead,
		Tags: Tags,
		FileUpload: FileUpload,
		DateInput: DateInput,
		Select2: Select2
	});
	
	return DA;
});
