define([
	'core/widgets/Control', 'core/nls/index', 
	'core/widgets/Button', 'core/widgets/Input', 'core/widgets/ProgressBar'
], function(Control, i18n, Button, Input, ProgressBar) {
	i18n = i18n.widgets.FileUpload;
	
	function Widget() {
		Widget.super_.apply(this, arguments);
	};
	Control.extend(Widget, {
		btnClass: 'btn-success',
		btnIcon: 'icon-upload icon-white',
		btnLabel: null,
		progressClass: '',
		progressActiveClass: 'progress-striped active',
		barClass: '',
		barFailedClass: 'bar-danger',
		imageMaxWidth: 80,
		imageMaxHeight: 80,
		percentage: 0,
		multiple: false,
		multipleBrackets: '[]',
		api: '/api/files',
		active: false,
		failed: false,
		plugin: {},
		button: {},
		progress: {},
		file: {},
		hidden: {}
	});
	var proto = Widget.prototype;
	
	Control.types.fileupload = Widget;
	
	Widget.setupPlugin = function(element, options, widget) {
		require(['jquery-iframe-transport', 'jquery-fileupload'], function() {
			element.fileupload($.extend({
				dataType: 'json',
				url: options.api,
				start: function() {
					widget.render({
						failed: false,
						active: true
					});
				},
				stop: function() {
					widget.render({
						active: false
					});
				},
				progressall: function(e, data) {
					widget.render({
						percentage: data.loaded / data.total
					});
				},
				done: function(e, data) {
					var value = widget.options.value;
					
					if(options.multiple) {
						if(!Array.isArray(widget.options.value))
							value = data.result;
						else
							value = value.concat(data.result);
					} else {
						if(value)
							Widget.deleteFile(value, widget, $.noop);
						
						value = data.result[0];
					}
					
					widget.render({
						value: value,
						percentage: 0
					});
				},
				fail: function() {
					widget.render({
						failed: true
					});
				}
			}, options.plugin));
		});
	};
	
	Widget.deleteFile = function(file, widget, callback) {
		var value = file.value || file.url || file;
		
		$.ajax({
			type: 'delete',
			dataType: 'json',
			url: widget.options.api + value,
			success: function(data) {
				callback(data === true ? null : -1);
			},
			error: function(err) {
				callback(err || -1);
			}
		});
	};
	
	proto.create = function() {
		var elm = Widget.super_.prototype.create.apply(this, arguments);
		
		Widget.setupPlugin(this.file._elm, this.options, this);
		return elm;
	};
	
	proto._create = function(container, parent, elm) {
		if(!elm)
			elm = $('<div class="widget-fileupload" />');
		
		elm = Widget.super_.prototype._create.call(this, container, parent, elm);
		
		this.button = new Button(this._getButtonOptions(this.options));
		var btn = this.button.create(elm, this);
		
		this.file = new Input(this._getFileOptions(this.options));
		this.file.create(btn, this);
		
		this.progress = new ProgressBar(this._getProgressOptions(this.options));
		this.progress.create(elm, this);
		
		this._files = $('<div class="files" />').appendTo(elm);
		
		return elm;
	};
	
	proto._destroy = function() {
		this.button.destroy();
		this.button = null;
		
		this.file.destroy();
		this.file = null;
		
		Widget.super_.prototype._destroy.apply(this, arguments);
	};
	
	proto._getButtonOptions = function(options) {
		return $.extend(true, {
			type: 'span',
			label: options.btnLabel || (options.multiple ? i18n.selectFiles : i18n.selectFile),
			class: options.btnClass,
			icon: options.btnIcon
		}, options.button);
	};
	
	proto._getFileOptions = function(options) {
		return $.extend(true, {
			type: 'file',
			class: 'file-input',
			prop: {
				multiple: options.multiple
			}
		}, options.file);
	};
	
	proto._getProgressOptions = function(options) {
		return $.extend(true, {
			class: (!options.active ? options.progressClass : options.progressActiveClass),
			barClass: (!options.failed ? options.barClass : options.barFailedClass),
			percentage: options.percentage
		}, options.progress);
	};
	
	proto.getInputName = function() {
		var name = this.options.name;
		if(this.options.multiple && this.options.multipleBrackets) {
			name += this.options.multipleBrackets;
		}
		
		return name;
	};
	
	proto._render = function(options) {	
		var self = this;	
		Widget.renderElm(this._elm, options);
		
		this.button.render(this._getButtonOptions(options));
		this.progress.render(this._getProgressOptions(options));
		this.file.render(this._getFileOptions(options));
		
		this._files.empty();
		
		if(options.multiple) {
			if(Array.isArray(options.value)) {
				for(var i in options.value) {
					self._renderFile(options.value[i], i);
				}
			}
		} else if(options.value) {
			this._renderFile(options.value);
		}
	};
	
	proto._renderFile = function(file, i) {
		var self = this,
				
		url = file.url || file,
		name = file.name || url.match(/[^\/]+$/)[0],
		value = file.value || url,
		isImage = ((file.type && file.type.substr(0, 6) === 'image/') || 
				(url.match(/\.(png|jpe?g|gif)$/i) !== null)),
		
		elm = $('<div class="file" />').appendTo(this._files);
		
		$('<input type="hidden" />').appendTo(elm)
		.attr({name: this.getInputName(), value: value});
		
		if(isImage) {
			$('<a class="file-image" target="_blank" />')
			.attr('href', url)
			.appendTo(elm)
			.append(
				$('<img />')
				.attr({src: url, alt: name})
				.css({
					maxWidth: this.options.imageMaxWidth,
					maxHeight: this.options.imageMaxHeight
				})
			);
			
			elm.css({
				minHeight: this.options.imageMaxHeight
			}).append(' ');
		}
		
		var content = $('<span class="file-content" />').appendTo(elm);
		
		$('<a class="file-name" target="_blank" />')
				.attr('href', url)
				.text(name)
				.appendTo(content);
		
		Button.create({
			class: 'btn-danger btn-mini',
			icon: 'icon-trash icon-white',
			label: i18n.del,
			click: function() {
				elm.slideDown();
				
				Widget.deleteFile(file, self, function(err) {
					if(err) {
						elm.show();
						return;
					}
					
					elm.remove();
					
					if(self.options.value) {
						if(typeof i !== 'undefined')
							delete self.options.value[i];
						else
							self.options.value = null;
					}
				});
			}
		}).appendTo(content);
	};	
	
	return Widget;
});