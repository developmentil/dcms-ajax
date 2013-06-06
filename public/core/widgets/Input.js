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
		
		if(this.options.dir)
			elm.attr('dir', this.options.dir);
		
		if(this.options.spellcheck !== null)
			elm.prop('spellcheck', this.options.spellcheck);
		
		if(this.options.maxlength)
			elm.attr('maxlength', this.options.maxlength);
		
		if(this.options.placeholder)
			elm.attr('placeholder', this.options.placeholder);
		
		if(this.options.autocomplete !== null)
			elm.prop('autocomplete', this.options.autocomplete);
		
		if(this.options.autofocus !== null)
			elm.prop('autofocus', this.options.autofocus);
		
		return elm;
	};
	
	return Widget;
});