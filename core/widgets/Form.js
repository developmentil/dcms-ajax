define(['core/widgets/ControlsContainer', 'core/widgets/Fieldset'], function(ControlsContainer, Fieldset) {
	
	function Widget() {
		Widget.super_.apply(this, arguments);
	};
	ControlsContainer.extend(Widget, {
		api: null,
		action: '',
		method: 'post',
		target: null,
		enctype: null,
		fieldsets: [],
		fieldset: Fieldset,
		onSubmit: null,
		validate: null,
		novalidate: null
	});
	var proto = Widget.prototype;
	
	Widget.parsley = {
		successClass: 'success',
        errorClass: 'error',
		errors: {
			classHandler: function(el) {
				return $(el).closest('.control-group');
			},
			errorsWrapper: '<span class="help-inline"></span>',
			errorElem: '<span></span>'
		},
		validateIfUnchanged: true,
		validators: {},
		messages: {}
	};
	
	Widget.validate = function(element, options) {
		require(['parsley'], function() {
			if(element.data('parsleyForm'))
				element.parsley('destroy');

			element.parsley($.extend(true, {}, Widget.parsley, options.parsley));
		});
	};
	
	proto.submit = function() {
		this._elm.submit();
		return this;
	};
	
	proto.serialize = function() {
		return this._elm.serialize();
	};
	
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
		var self = this, options = this.options;
		
		if(!elm)
			elm = $('<form />');
		
		elm = Widget.super_.prototype._create.call(this, container, parent, elm);
		
		elm.attr('action', options.action)
		.attr('method', options.method)
		.attr('target', options.target)
		.attr('enctype', options.enctype)
		.on('submit.form', function() {
			self.emitEvent('submit', arguments);
			
			if(options.onSubmit)
				options.onSubmit.apply(self, arguments);
		});
		
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
	
	proto._render = function(options) {
		Widget.super_.prototype._render.apply(this, arguments);
		
		if(options.novalidate || (options.validate && options.novalidate !== false))
			this._elm.attr('novalidate', 'novalidate');
		else
			this._elm.removeAttr('novalidate');
		
		if(options.validate)
			Widget.validate(this._elm, options);
	};
	
	return Widget;
});