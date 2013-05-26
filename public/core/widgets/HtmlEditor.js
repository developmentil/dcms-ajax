define([
	'core/widgets/Control', 'core/widgets/TextArea'
], function(Control, TextArea) {
	
	function Widget() {
		Widget.super_.apply(this, arguments);
	};
	TextArea.extend(Widget);
	var proto = Widget.prototype;
	
	Control.types.htmleditor = Widget;
	
	proto.defaults = {
		cols: null,
		rows: null,
		wrap: null,
		plugins: [
			"advlist autolink lists link image charmap print preview anchor",
			"searchreplace visualblocks code fullscreen",
			"insertdatetime media table contextmenu paste"
		],
		toolbar: "insertfile undo redo | styleselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image",
		editor: {}
	};
	
	proto._getEditorOptions = function(options) {
		return $.extend({}, options, options.editor);
	};
	
	proto._render = function(options) {
		var self = this;
		
		this._elm.val(options.value);
		
		require(['tinymce', 'jquery-tinymce'], function() {
			tinymce.dom.Event.domLoaded = true;
			self._elm.tinymce(self._getEditorOptions(options));
		});
	};
	
	return Widget;
});