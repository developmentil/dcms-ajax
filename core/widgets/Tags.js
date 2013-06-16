define([
	'core/widgets/MultiControl', 'core/widgets/Control', 'core/widgets/Typeahead'
], function(MultiControl, Control, Typeahead) {
	
	function Widget() {
		Widget.super_.apply(this, arguments);
		
		if(!this.options.value)
			this.options.value = [];
	};
	MultiControl.extend(Widget, {
		api: null,
		options: [],
		value: null,
		inputClass: 'input-small',
		tagClass: 'label-info',
		placeholder: null,
		valueProp: '_id',
		labelProp: 'name',
		allowDuplicate: false,
		closedList: false,
		multiple: true,
		typeahead: {}
	});
	var proto = Widget.prototype;
	
	Control.types.tags = Widget;
	
	proto.isVal = function(val) {
		if(!this.options.multiple)
			return Widget.super_.prototype.isVal.apply(this, arguments);
		
		var entity, i, value;
		for(i in this.options.value) {
			entity = this.options.value[i];
			value = (entity[this.options.valueProp] !== undefined) ? 
						entity[this.options.valueProp] : entity;
						
			if(value == val)
				return true;
		};
		
		return false;
	};
	
	proto.addTag = function(entity) {
		if(!this.options.allowDuplicate) {
			var value = (entity[this.options.valueProp] !== undefined) ? 
						entity[this.options.valueProp] : entity;
						
			if(this.isVal(value)) {
				if($.fn.effect) {
					this._tags.find('input[value="' + value + '"]')
							.parent().effect('highlight');
				}
				return this;
			}
		}
		
		this.options.value.push(entity);
		this.render();
		
		return this;
	};
	
	proto.removeTag = function(val, i) {
		if(i !== undefined) {
			delete this.options.value[i];
			this.render();
			return this;
		}
		
		var entity, i, value;
		for(i in this.options.value) {
			entity = this.options.value[i];
			value = (entity[this.options.valueProp] !== undefined) ? 
						entity[this.options.valueProp] : entity;
						
			if(value == val) {
				delete this.options.value[i];
				
				if(!this.options.allowDuplicate)
					break;
			}
		};
		
		this.render();
		return this;
	};
	
	proto._create = function(container, parent, elm) {
		var self = this;
		if(!elm)
			elm = $('<span class="widget-tags" />');
		
		elm = Widget.super_.prototype._create.call(this, container, parent, elm);
		
		this._tags = $('<span class="tags" />').appendTo(elm);
		elm.append(' ');
		
		this.typeahead = new Typeahead(this._getTypeaheadOptions(this.options));
		this.typeahead.create(elm, this);
		this.typeahead.on('select', function(entity, label) {
			self.addTag(entity || label);
			
			setTimeout(function() {
				self.typeahead.val('');
			}, 1);
		});
		this.typeahead.on('enter', function(entity, label) {
			if(self.options.closedList)
				return;
			
			self.addTag(entity || label);
			
			setTimeout(function() {
				self.typeahead.val('');
			}, 1);
		});
		
		return elm;
	};
	
	proto._destroy = function() {
		this.typeahead.destroy();
		this.typeahead = null;
	};
	
	proto._getTypeaheadOptions = function(options) {
		return $.extend({
			source: options.api,
			class: options.inputClass,
			placeholder: options.placeholder,
			disableEnter: true
		}, options.typeahead);
	};
	
	proto._load = function(callback) {
		var self = this;
		
		Widget.super_.prototype._load.call(this, function(err) {
			if(err) return callback(err);
			
			self.typeahead.load(callback);
		});
	};
	
	proto._render = function(options) {
		Widget.super_.prototype._render.apply(this, arguments);
		
		this._tags.empty();
		for(var i in options.value) {
			if(!options.value[i]) continue;
			
			this._renderTag(options.value[i], options, i);
			this._tags.append(' ');
		}
		
		this.typeahead.render(this._getTypeaheadOptions(options));
	};
	
	proto._renderTag = function(entity, options, i) {
		var self = this,
				
		value = entity[options.valueProp] !== undefined ? 
					entity[options.valueProp] : entity,
		
		label = $('<span class="label" />')
				.addClass(options.tagClass)
				.text(entity[options.labelProp] || entity)
				.appendTo(this._tags);
		
		$('<input type="hidden" />')
		.attr({
			name: this.getInputName(),
			value: value
		})
		.appendTo(label);

		label.prepend(' ');
		
		$('<i class="close" />')
		.html('&times;')
		.prependTo(label)
		.click(function(e) {
			e.preventDefault();
			self.removeTag(value, i);
		});
		
		return label;
	};
	
	return Widget;
});