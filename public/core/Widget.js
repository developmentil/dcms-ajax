define(['libs/util', 'SignalsEmitter'], function(util, SignalsEmitter) {
	
	function Widget(options) {
		Widget.super_.call(this);
		
		this.options = $.extend({}, this.defaults, options || {});
		this._elm = null;
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
	
	proto.create = function(container) {
		this._elm = $('<div class="widget" />');
		if(container)
			this._elm.appendTo(container);
		
		return this._elm;
	};
	
	proto.render = function(options) {
		options = $.extend({}, this.options, options || {});
		
		this._render(options);
		return this;
	};
	
	
	/*** Protected Methods ***/
	
	proto._render = function(options) {
		
	};
	
	return Widget;
});

