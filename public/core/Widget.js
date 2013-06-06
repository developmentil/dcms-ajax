define(['core/libs/util', 'core/SignalsEmitter'], function(util, SignalsEmitter) {
	
	function Widget(options) {
		Widget.super_.call(this);
		
		this._elm = null;
		this._parent = null;
		this._markAsLoaded = null;
		
		this.options = $.extend({}, this.defaults, options || {});
	};
	util.inherits(Widget, SignalsEmitter);
	var proto = Widget.prototype;
	
	function classExtend(ctor, superCtor, defaults) {
		if(ctor.prototype.defaults)
			defaults = $.extend(ctor.prototype.defaults, defaults || {});
		
		util.inherits(ctor, superCtor);
		
		if(defaults) {
			ctor.prototype.defaults = $.extend(
					defaults, 
					superCtor.prototype.defaults, 
					defaults
			);
		}
		
		ctor.extend = function(c, defaults) {
			classExtend(c, ctor, defaults);
		};
		
		for(var fn in superCtor) {
			if(typeof ctor[fn] === 'undefined')
				ctor[fn] = superCtor[fn];
		}
	};
	
	Widget.extend = function(ctor, defaults) {
		classExtend(ctor, Widget, defaults);
	};
	
	Widget.create = function(options, defWidget) {
		var widget = options.__widget || defWidget || Widget;
		if(typeof widget === 'string') {
			 widget = Widget[widget] || defWidget || Widget;
		}
		
		return new widget(options);
	};
	
	Widget.configElm = function(elm, options) {
		if(options.id)
			elm.attr('id', options.id);
		
		if(options.className)
			elm.addClass(options.className);
		
		if(options.css)
			elm.css(options.css);
		
		if(options.attr)
			elm.attr(options.attr);
		
		if(options.prop)
			elm.attr(options.prop);
		
		if(options.bind)
			elm.bind(options.bind);
		
		return elm;
	};
	
	
	/*** Static Vars ***/
	
	proto.defaults = {
		id: null,
		className: null,
		css: null,
		attr: null,
		prop: null,
		bind: null
	};
	
	
	/*** Public Methods ***/
	
	proto.create = function(container, parent) {
		if(container instanceof Widget) {
			parent = container;
			container = parent._elm;
		}
		
		this._parent = parent || null;
		
		this._elm = this._create(container, parent);
		if(container)
			this._elm.appendTo(container);
		
		this._elm.data('widget', this);
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
		this._markAsLoaded = null;
		
		return this.load.apply(this, arguments);
	};
	
	proto.load = function(noRender, callback) {
		if(typeof noRender !== 'boolean') {
			callback = noRender;
			noRender = false;
		}
		if(!callback)
			callback = function(err) { if(err) throw err; };
		
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
	
	proto.options = function(options) {
		if(options === undefined)
			return $.extend({}, this.options);
		
		$.extend(this.options, options || {});
		return this;
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
		
		Widget.configElm(elm, this.options);
		
		return elm;
	};
	
	proto._destroy = function() {
		
	};
	
	proto._render = function(options) {
		
	};
	
	return Widget;
});

