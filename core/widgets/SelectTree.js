define([
	'core/dcms-ajax', 
	'core/widgets/Control', 'core/widgets/MultiControl'
], function(DA, Control, MultiControl) {
	
	function Widget() {
		Widget.super_.apply(this, arguments);
	};
	MultiControl.extend(Widget, {
		api: null,
		sharedApi: 60000,
		options: null,
		selectMode: 2,
		fancytree: {}
	});
	var proto = Widget.prototype;
	
	Control.types.selectTree = Widget;
	
	Widget.launchFancyTree = function(element, options) {
		require(['fancytree'], function() {
			element.fancytree(options);
		});
	};
	
	Widget.destroyFancyTree = function(element) {
		element.fancytree('destroy');
	};
	
	proto._getFancyTreeOptions = function(options) {
		var opts = {
			multiple: options.multiple || false,
			checkbox: true,
			selectMode: options.selectMode,
			cookieId: options.id + '-',
			idPrefix: options.id + '-'
		};
		
		if(options.api) {
			opts.source = {
				url: options.api,
				cache: options.cache || false
			};
		} else if(options.options) {
			opts.source = options.options;
		}
		
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
		
		return $.extend(opts, options.fancytree);
	};
	
	proto._create = function(container, parent, elm) {
		if(!elm)
			elm = $('<input type="hidden" />');
		
		return Widget.super_.prototype._create.call(this, container, parent, elm);
	};
	
	proto._destroy = function() {
		Widget.destroyFancyTree(this._elm);
		
		Widget.super_.prototype._destroy.apply(this, arguments);
	};
	
	proto._render = function(options) {
		Widget.super_.prototype._render.apply(this, arguments);
		
		Widget.launchFancyTree(this._elm, this._getFancyTreeOptions(options));
	};
	
	return Widget;
});