define([
	'core/dcms-ajax', 
	'core/widgets/Control', 'core/widgets/MultiControl', 'core/nls/index'
], function(DA, Control, MultiControl, i18n) {
	i18n = i18n.widgets.Select;
	
	function Widget() {
		Widget.super_.apply(this, arguments);
	};
	MultiControl.extend(Widget);
	var proto = Widget.prototype;
	
	Control.types.select = Widget;
	
	proto.defaults = {
		name: null,
		value: null,
		api: null,
		options: [],
		optionGroups: [],
		required: null,
		defaultValue: '',
		defaultLabel: i18n.defaultLabel,
		defaultOption: {}
	};
	
	proto._create = function(container, parent, elm) {
		if(!elm)
			elm = $('<select />');
		
		elm = Widget.super_.prototype._create.call(this, container, parent, elm);
		
		if(this.options.required !== null)
			elm.prop('required', this.options.required);
		
		return elm;
	};
	
	proto._load = function(callback) {
		var self = this;
		
		Widget.super_.prototype._load.call(this, function(err) {
			if(!self.options.api || err)
				return callback(err);
			
			DA.api(self.options.api, function(err, data) {
				if(err) return callback(err);
				
				$.extend(self.options, data);console.log(self.options, data);
				callback(null);
			});
		});
	};
	
	proto._render = function(options) {
		this._elm.empty();
		
		for(var i in options.optionGroups) {
			var group = DA.Widget.configElm(
					$('<optgroup />'), 
					this.options.optionGroups[i]
			)
			.appendTo(this._elm)
			.attr('label', options.optionGroups[i].label || i);
	
			this._renderOptions(
					options.optionGroups[i].options || 
					options.optionGroups[i]
			, group);
		}
		
		if(options.required === false) {
			var opt = $.extend({
				label: options.defaultLabel,
				value: options.defaultValue
			}, options.defaultOption);
			
			DA.Widget.configElm($('<option />'), opt)
			.appendTo(this._elm)
			.attr('value', opt.value)
			.text(opt.label);
		}
			
		
		this._renderOptions(options.options, this._elm);
	};
	
	proto._renderOptions = function(options, container) {
		for(var i in options) {
			var opt = options[i].label ? options[i] : {label: options[i]},
			val = opt.value || i;
			
			DA.Widget.configElm($('<option />'), opt)
			.appendTo(container)
			.attr('value', val)
			.prop('selected', this.isVal(val))
			.text(opt.label);
		}
	};
	
	return Widget;
});