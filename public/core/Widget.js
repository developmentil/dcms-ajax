define(['core/libs/util', 'core/SignalsEmitter'], function(util, SignalsEmitter) {
	
	function Widget(options) {
		Widget.super_.call(this);
		
		this._elm = null;
		this._parent = null;
		this._markAsLoaded = false;
		
		this.options = $.extend({}, this.defaults, options || {});
	};
	util.inherits(Widget, SignalsEmitter);
	var proto = Widget.prototype;
	
	function classExtend(ctor, superCtor) {
		util.inherits(ctor, superCtor);
		
		ctor.extend = function(c) {
			classExtend(c, ctor);
		};
	};
	
	Widget.extend = function(ctor) {
		classExtend(ctor, Widget);
	};
	
	
	/*** Static Vars ***/
	
	proto.defaults = {};
	
	
	/*** Public Methods ***/
	
	proto.create = function(container, parent) {
		this._parent = parent || null;
		
		this._elm = this._create(container, parent);
		if(container)
			this._elm.appendTo(container);
		
		return this._elm;
	};
	
	proto.destroy = function() {
		this._destroy();
		
		this._elm.remove();
		this._elm = null;
		this._parent = null;
		
		return this;
	};
	
	proto.reload = function(noRender, callback) {
		this._markAsLoaded = false;
		
		return this.load.apply(this, arguments);
	};
	
	proto.load = function(noRender, callback) {
		if(typeof noRender !== 'boolean') {
			callback = noRender;
			noRender = false;
		}
		callback = callback || $.noop;
		
		if(this._markAsLoaded) {
			if(!noRender)
				this.render();

			callback();
			return;
		}
		
		var self = this;
		this._load(function(err) {
			if(err) return callback(err);
			
			self.trigger('load', function(err) {
				if(err) return callback(err);
				
				self._markAsLoaded = true;

				if(!noRender)
					self.render();

				callback();
			});
		});
	};
	
	proto.element = function() {
		return this._elm;
	};
	
	proto.render = function(options) {		
		options = $.extend(this.options, options || {});
		
		this._render(options);
		this.emit('render', options);
		
		return this;
	};
	
	
	/*** Protected Methods ***/
	
	proto._load = function(callback) {
		callback(new Error('Not implemented'));
	};
	
	proto._create = function(container, parent, elm) {
		if(!elm)
			elm = $('<div class="widget" />');
		
		if(this.options.id)
			elm.attr('id', this.options.id);
		
		if(this.options.className)
			elm.addClass(this.options.className);
		
		return elm;
	};
	
	proto._destroy = function() {
		
	};
	
	proto._render = function(options) {
		
	};
	
	return Widget;
});

