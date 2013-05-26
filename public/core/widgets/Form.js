define(['core/widgets/ControlsContainer', 'core/widgets/Fieldset'], function(ControlsContainer, Fieldset) {
	
	function Widget() {
		Widget.super_.apply(this, arguments);
	};
	ControlsContainer.extend(Widget);
	var proto = Widget.prototype;
	
	proto.defaults = {
		action: '',
		method: 'post',
		fieldsets: [],
		fieldset: Fieldset
	};
	
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
	
	proto._create = function(container, parent, elm) {
		if(!elm)
			elm = $('<form />');
		
		elm = Widget.super_.prototype._create.call(this, container, parent, elm);
		
		elm.attr('action', this.options.action)
		.attr('method', this.options.method);
		
		return elm;
	};
	
	proto._load = function(callback) {
		var self = this,
				
		next = function(err) {
			if(err) return callback(err);
			
			Widget.super_.prototype._load.call(self, callback);
		};
		
		if(!self.options.api) {
			next(null);
			return;
		}

		var options = {};

		if(typeof self.options.api === 'string') {
			options.url = self.options.api;
		} else {
			$.extend(true, options, self.options.api);
		}

		options.success = function(data) {
			$.extend(self.options, data);

			next(null);
		};

		options.error = next;

		DA.api(options);
	};
	
	return Widget;
});