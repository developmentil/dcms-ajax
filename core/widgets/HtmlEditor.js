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
		editor: 'CKEditor',
		options: {}
	});
	var proto = Widget.prototype;
	
	Control.types.htmleditor = Widget;
	
	Widget.editors = {
		TinyMCE: {
			defaults: function() {
				return {
					language: DA.registry.get('locale.locale'),
					directionality: DA.registry.get('locale.direction'),
					plugins: [
						"advlist autolink lists link image charmap print preview anchor",
						"searchreplace visualblocks code fullscreen",
						"insertdatetime media table contextmenu paste directionality"
					],
					toolbar: "insertfile undo redo | styleselect | bold italic | ltr rtl | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image",
					relative_urls: false,
					remove_script_host: true
				};
			},
	
			launch: function(element, options, callback) {
				require(['jquery-tinymce'], function() {
					tinymce.dom.Event.domLoaded = true;
					element.tinymce(options);
					callback();
				});
			},
	
			destroy: function(element) {
				element.tinymce().destroy();
			}
		},
		
		CKEditor: {
			defaults: function() {
				return {
					language: DA.registry.get('locale.locale')
				};
			},
	
			launch: function(element, options, callback) {
				require(['jquery-ckeditor'], function() {
					element.ckeditor(callback, options);
				});
			},
	
			destroy: function(element) {
				element.ckeditor().editor.destroy();
			}
		}
	};
	
	proto.editorProxy = function(method, args) {
		var editor = Widget.editors[this.options.editor];
		return editor[method].apply(this, args || []);
	};
	
	proto._getEditorOptions = function(options) {
		var defaults = this.editorProxy('defaults');
		
		for(var i in defaults) {
			if(options[i] !== undefined)
				defaults[i] = options[i];
		}
		
		return $.extend(defaults, options.options);
	};
	
	proto._destroy = function() {
		this.editorProxy('destroy', [this._elm]);
		
		Widget.super_.prototype._destroy.apply(this, arguments);
	};
	
	proto._render = function(options) {
		Widget.super_.prototype._render.apply(this, arguments);
		
		this.editorProxy('launch', [this._elm, this._getEditorOptions(options), $.noop]);
	};
	
	return Widget;
});