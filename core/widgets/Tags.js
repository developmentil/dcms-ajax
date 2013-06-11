define([
	'core/dcms-ajax', 
	'core/widgets/Control', 'core/widgets/MultiControl', 'core/widgets/Typeahead'
], function(DA, Control, MultiControl, Typeahead) {
	
	function Widget() {
		Widget.super_.apply(this, arguments);
	};
	MultiControl.extend(Widget, {
		api: null,
		options: [],
		inputClass: 'input-small',
		placeholder: null,
		typeahead: {}
	});
	var proto = Widget.prototype;
	
	Control.types.tags = Widget;
	
	proto._create = function(container, parent, elm) {
		if(!elm)
			elm = $('<span class="widget-tags" />');
		
		elm = Widget.super_.prototype._create.call(this, container, parent, elm);
		
		this.typeahead = new Typeahead(this._getTypeaheadOptions(this.options));
		this.typeahead.create(elm, this);
		
		return elm;
	};
	
	proto._destroy = function() {
		this.typeahead.destroy();
		this.typeahead = null;
	};
	
	proto._getTypeaheadOptions = function(options) {
		return $.extend({
			api: options.api,
			class: options.inputClass,
			placeholder: options.placeholder
		}, options.typeahead);
	};
	
	proto._load = function(callback) {
		this.typeahead.load(callback);
	};
	
	proto._render = function(options) {
		Widget.super_.prototype._render.apply(this, arguments);
		
		this.typeahead.render(this._getTypeaheadOptions(options));
	};
	
	return Widget;
});