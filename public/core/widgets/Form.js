define(['core/widgets/ControlsContainer', 'core/widgets/Fieldset'], function(ControlsContainer, Fieldset) {
	
	function Widget() {
		Widget.super_.apply(this, arguments);
	};
	ControlsContainer.extend(Widget);
	var proto = Widget.prototype;
	
	proto.defaults = $.extend({
		action: '',
		method: 'post',
		fieldsets: [],
		fieldset: Fieldset
	}, proto.defaults);
	
	proto.create = function() {
		var elm = Widget.super_.prototype.create.apply(this, arguments);
		
		for(var i in this.options.fieldsets) {
			this.insertFieldset(this.options.fieldsets[i]);
		}
		this.options.fieldsets = [];
		
		return elm;
	};
	
	proto.insertFieldset = function(fieldset) {
		if(!(fieldset instanceof Fieldset)) {
			if(typeof fieldset.wrapper === 'undefined')
				fieldset.wrapper = this.options.wrapper;
				
			fieldset = new this.options.fieldset(fieldset);
		}
			
		return this.insert(fieldset);
	};
	
	proto._create = function() {		
		return $('<form />')
				.attr('action', this.options.action)
				.attr('method', this.options.method);
	};
	
	return Widget;
});