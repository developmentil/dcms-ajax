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
		autofocus: null
	});
	var proto = Widget.prototype;
	
	Control.types.default = 
	Control.types.input = Widget;
	
	proto._create = function(container, parent, elm) {
		if(!elm)
			elm = $('<input />');
		
		elm = Widget.super_.prototype._create.call(this, container, parent, elm);
		
		elm.attr('type', this.options.type);
		
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