define([
	'core/dcms-ajax', 
	'core/widgets/Control', 'core/widgets/MultiControl', 'core/nls/index'
], function(DA, Control, MultiControl, i18n) {
	i18n = i18n.widgets.Select;
	
	function Widget() {
		Widget.super_.apply(this, arguments);
	};
	MultiControl.extend(Widget, {
		api: null,
		options: [],
		optionGroups: [],
		emptyLabel: i18n.emptyLabel,
		emptyOption: {}
	});
	var proto = Widget.prototype;
	
	Control.types.select = Widget;
	
	proto._create = function(container, parent, elm) {
		if(!elm)
			elm = $('<select />');
		
		return Widget.super_.prototype._create.call(this, container, parent, elm);
	};
	
	proto._load = function(callback) {
		var self = this;
		
		Widget.super_.prototype._load.call(this, function(err) {
			if(!self.options.api || err)
				return callback(err);
			
			DA.api(self.options.api, function(err, data) {
				if(err) return callback(err);
				
				$.extend(self.options, data);
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
				label: options.emptyLabel,
				value: options.emptyValue
			}, options.emptyOption);
			
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