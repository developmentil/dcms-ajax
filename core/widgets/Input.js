define(['core/widgets/Control'], function(Control) {
	
	function Widget() {
		Widget.super_.apply(this, arguments);
	};
	Control.extend(Widget, {
		type: 'text',
		maxlength: null,
		placeholder: null,
		dir: null,
		spellcheck: null,
		autocomplete: null,
		autofocus: null,
		smartChange: null,
		smartChangeTimeout: 200
	});
	var proto = Widget.prototype;
	
	Control.types.default = 
	Control.types.input = Widget;
	
	proto._create = function(container, parent, elm) {
		if(!elm)
			elm = $('<input />');
		
		elm = Widget.super_.prototype._create.call(this, container, parent, elm);
		
		elm.attr('type', this.options.type);
		
		if(this.options.smartChange) {
			var self = this, timeout = null;
			elm.bind('keypress.smartChange', function(e) {
				 if(e.which <= 32 && e.which !== 8) return;
				 
				 if(timeout)
					 clearTimeout(timeout);
				 
				 timeout = setTimeout(function() {
					 timeout = null;
					 self.options.smartChange.apply(self, e);
				 }, self.options.smartChangeTimeout);
			});
		}
		
		return elm;
	};
	
	proto._render = function(options) {
		Widget.super_.prototype._render.apply(this, arguments);
		
		if(options.dir !== null)
			this._elm.attr('dir', options.dir);
		
		if(options.spellcheck !== null)
			this._elm.prop('spellcheck', options.spellcheck);
		
		if(options.maxlength)
			this._elm.attr('maxlength', options.maxlength);
		
		if(options.placeholder)
			this._elm.attr('placeholder', options.placeholder);
		
		if(options.autocomplete !== null)
			this._elm.prop('autocomplete', options.autocomplete);
		
		if(options.autofocus !== null)
			this._elm.prop('autofocus', options.autofocus);
	};
	
	return Widget;
});