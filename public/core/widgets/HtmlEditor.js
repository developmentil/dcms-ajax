define([
	'core/widgets/Control', 'core/widgets/TextArea'
], function(Control, TextArea) {
	
	function Widget() {
		Widget.super_.apply(this, arguments);
	};
	TextArea.extend(Widget, {
		cols: null,
		rows: null,
		wrap: null,
		plugins: [
			"advlist autolink lists link image charmap print preview anchor",
			"searchreplace visualblocks code fullscreen",
			"insertdatetime media table contextmenu paste directionality"
		],
		toolbar: "insertfile undo redo | styleselect | bold italic | ltr rtl | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image",
		editor: {}
	});
	var proto = Widget.prototype;
	
	Control.types.htmleditor = Widget;
	
	Widget.launchEditor = function(element, options) {
		require(['tinymce', 'jquery-tinymce'], function() {
			tinymce.dom.Event.domLoaded = true;
			element.tinymce(options);
		});
	};
	
	proto._getEditorOptions = function(options) {
		return $.extend({
			language: DA.registry.get('locale'),
			directionality: DA.registry.get('dir')
		}, options, options.editor);
	};
	
	proto._render = function(options) {
		this._elm.val(options.value);
		
		Widget.launchEditor(this._elm, this._getEditorOptions(options));
	};
	
	return Widget;
});