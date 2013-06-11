define(['core/widgets/Control', 'core/widgets/Input'], function(Control, Input) {
	
	function Widget() {
		Widget.super_.apply(this, arguments);
		
		this.options.type = 'text';
	};
	Input.extend(Widget, {
		source: null,
		itemLabel: function(item) {
			if(typeof item !== 'string')
				item = item.label || item.name || item.title;

			return item;
		},
		typeahead: {}
	});
	var proto = Widget.prototype;
	
	Control.types.typeahead = Widget;
	
	proto._create = function(container, parent, elm) {
		elm = Widget.super_.prototype._create.call(this, container, parent, elm);
		
		elm.typeahead(this._getTypeaheadOptions(this.options));
		
		return elm;
	};
	
	proto._getTypeaheadOptions = function(options) {		
		var self = this,
		
		opts = {
			updater: function(label) {
				self.emit('select', self._loadedSource && self._loadedSource[label], label);
				
				return options.updater ? options.updater.call(this, label) : label;
			}
		};
		
		if(!Array.isArray(options.source) && typeof options.source !== 'function') {
			opts.source = function(query, callback) {
				DA.api(options.source, {query: query}, function(err, data) {
					if(err) return callback([]);
					
					self._loadedSource = {};
					var data = data.options || data, items = [];
					for(var i in data) {
						var label = options.itemLabel(data[i]);
						items.push(label);
						self._loadedSource[label] = data[i];
					}
					
					callback(items);
				});
			};
		} else {
			opts.source = options.source;
		}
		
		return $.extend(opts, options, options.typeahead);
	};
	
	return Widget;
});