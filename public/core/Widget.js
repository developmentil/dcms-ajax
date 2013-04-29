define(['libs/util', 'libs/EventEmitter'], function(util, EventEmitter) {
	
	function Widget(options) {
		Widget.super_.call(this);
		
		this.options = options || {};
		this._elm = null;
	};
	util.inherits(Widget, EventEmitter);
	
	function classExtend(ctor, superCtor) {
		util.inherits(ctor, superCtor);
		
		ctor.extend = function(c) {
			classExtend(c, ctor);
		};
	};
	
	Widget.extend = function(ctor) {
		classExtend(ctor, Widget);
	};
	
	
	/*** Public Methods ***/
	
	Widget.prototype.create = function(container) {
		this._elm = $('<div class="widget" />');
		if(container)
			this._elm.appendTo(container);
		
		return this._elm;
	};
	
	Widget.prototype.render = function() {	
		return this;
	};
	
	return Widget;
});

