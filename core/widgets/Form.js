define(['core/widgets/ControlsContainer', 'core/widgets/Fieldset'], function(ControlsContainer, Fieldset) {
	
	function Widget() {
		Widget.super_.apply(this, arguments);
	};
	ControlsContainer.extend(Widget, {
		action: '',
		method: 'post',
		fieldsets: [],
		fieldset: Fieldset
	});
	var proto = Widget.prototype;
	
	proto.create = function() {
		var controls = this.options.controls;
		this.options.controls = [];
		
		var elm = Widget.super_.prototype.create.apply(this, arguments);
		
		for(var i in this.options.fieldsets) {
			this.insertFieldset(this.options.fieldsets[i]);
		}
		this.options.fieldsets = [];
		
		for(var i in controls) {
			this.insert(controls[i]);
		}
		
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

		DA.api(self.options.api, function(err, data) {
			if(err) return next(err);
			
			$.extend(self.options, data);
			next(null);
		});
	};
	
	return Widget;
});