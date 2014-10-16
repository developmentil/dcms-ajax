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
		sharedApi: 60000,
		quietMillis: 300,
		emptyLabel: i18n.emptyLabel,
		result: function(data) {			
			if(!data.id)
				data.id = data._id;
			
			if(!data.text)
				data.text = data.name || data.label;
			
			return data;
		},
		select2: {}
	});
	var proto = Widget.prototype;
	
	Control.types.select2 = Widget;
	
	Widget.launchSelect2 = function(element, options) {
		require(['select2'], function() {
			element.select2(options);
		});
	};
	
	Widget.destroySelect2 = function(element) {
		element.select2('destroy');
	};
	
	proto._getSelect2Options = function(options) {
		var opts = {
			placeholder: options.emptyLabel,
			allowClear: (options.required === false),
			multiple: options.multiple,
			initSelection: options.initSelection,
			ajax: options.ajax
		};
		
		if(options.api) {
			var api = options.api;
			if(typeof api === 'string')
				api = {url: api};
			
			opts.initSelection = function (element, callback) {
				var aops = $.extend(true, {
					data: {
						id: element.val()
					}
				}, api);
				
				DA.api(aops, function(err, data) {
					if(err || !data) return callback(null);
					
					callback(options.result(data));
				});
			};
			
			opts.ajax = $.extend({
				transport: function(ajax) {
					return DA.sharedApi(options.sharedApi, ajax);
				},
				data: function(term, page) {
					return {q: term, p: page};
				},
				quietMillis: options.quietMillis,
				results: function(data) {
					var results = [];
					$.each(data, function(i, val) {
						if(typeof val === 'object')
							results.push(options.result(val, i));
						else
							results.push({id: i, text: val});
					});
					
					return {
						results: results
					};
				}
			}, api);
		}
		
		return $.extend(opts, options.select2);
	};
	
	proto._create = function(container, parent, elm) {
		if(!elm)
			elm = $('<input type="hidden" />');
		
		return Widget.super_.prototype._create.call(this, container, parent, elm);
	};
	
	proto._destroy = function() {
		Widget.destroySelect2(this._elm);
		
		Widget.super_.prototype._destroy.apply(this, arguments);
	};
	
	proto._render = function(options) {
		Widget.super_.prototype._render.apply(this, arguments);
		
		Widget.launchSelect2(this._elm, this._getSelect2Options(options));
	};
	
	return Widget;
});