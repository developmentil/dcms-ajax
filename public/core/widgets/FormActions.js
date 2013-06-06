define(['core/dcms-ajax', 'core/nls/index', 'core/widgets/Button'], function(DA, i18n, Button) {
	i18n = i18n.widgets.FormActions;
	
	function Widget() {
		Widget.super_.apply(this, arguments);
	};
	DA.Widget.extend(Widget, {
		save: {},
		saveLabel: i18n.Save,
		cancel: {},
		cancelLabel: i18n.Cancel,
		cancelClick: null,
		actions: null
	});
	var proto = Widget.prototype;
	
	proto._create = function(container, parent, elm) {
		if(!elm)
			elm = $('<div class="form-actions" />');
		
		return Widget.super_.prototype._create.call(this, container, parent, elm);
	};
	
	proto._load = function(callback) {
		callback(null);
	};
	
	proto._render = function(options) {
		this._elm.empty();
		
		var actions = options.actions;
		if(!actions) {
			actions = [];
			
			if(options.save) {
				actions.push($.extend({
					type: 'submit',
					className: 'btn-primary',
					label: options.saveLabel
				}, options.save));
			}
			
			if(options.cancel) {
				actions.push($.extend({
					label: options.cancelLabel,
					click: options.cancelClick
				}, options.cancel));
			}
		}
		
		// use for..in to ignore undefined items
		for(var i in actions) {
			this._elm
			.append(Button.create(actions[i]))
			.append(' ');
		}
	};
	
	return Widget;
});