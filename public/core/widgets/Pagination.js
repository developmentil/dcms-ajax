define(['core/dcms-ajax'], function(DA) {
	
	function Widget() {
		Widget.super_.apply(this, arguments);
	};
	DA.Widget.extend(Widget);
	var proto = Widget.prototype;
	
	proto.defaults = {
		pages: null,
		current: 1,
		displayLimit: 5,
		hidePrevious: false,
		hideNext: false,
		previousLabel: '«',
		nextLabel: '»'
	};
	
	proto.create = function(container) {		
		this._elm = $('<div class="pagination" />');
		if(container)
			this._elm.appendTo(container);
		
		if(this.options.id)
			this._elm.attr('id', this.options.id);
		
		if(this.options.className)
			this._elm.addClass(this.options.className);
		
		this._elm.hide();
		
		return this._elm;
	};
	
	proto.current = function(page) {
		if(typeof page === 'undefined')
			return this.options.current;
		
		if(page >= 1 && page <= this.options.pages) {
			this.render({current: page});
			this.emit('change', page);
		}
		
		return this;
	};
	
	proto.next = function() {
		if(this.hasNext())
			this.current(this.options.current + 1);
		
		return this.options.current;
	};
	
	proto.prev = function() {
		if(this.hasPrev())
			this.current(this.options.current - 1);
		
		return this.options.current;
	};
	
	proto.hasNext = function() {
		return (this.options.current < this.options.pages);
	};
	
	proto.hasPrev = function() {
		return (this.options.current > 1);
	};
	
	proto._render = function(options) {
		this._elm.empty().show();
		
		if(!options.pages) {
			this._elm.hide();
			return;
		}
		
		var ul = $('<ul />').appendTo(this._elm);
		
		if(!options.hidePrevious) {
			this._renderPrev(ul, options);
		}
		
		var self = this,
		cur = Math.max(1, this.current() - Math.floor(options.displayLimit / 2));

		if(cur + options.displayLimit > options.pages)
			cur = Math.max(1, options.pages - options.displayLimit);

		for(var i = 0; i < options.displayLimit && cur <= options.pages; i++) {			
			(function(cur) {
				self._renderPage(ul, cur.toString(), cur !== self.current() ? function() {
					self.current(cur);
				} : 'active');
			})(cur++);
		}
		
		if(!options.hideNext) {
			this._renderNext(ul, options);
		}
	};
	
	proto._renderPrev = function(ul, options) {
		var self = this;
		
		this._renderPage(ul, options.previousLabel, this.hasPrev() ? function() {
			self.prev();
		} : 'disabled');
	};
	
	proto._renderNext = function(ul, options) {
		var self = this;
		
		this._renderPage(ul, options.nextLabel, this.hasNext() ? function() {
			self.next();
		} : 'disabled');
	};
	
	proto._renderPage = function(ul, label, action) {
		var li = $('<li />').appendTo(ul), inner;

		if(typeof action === 'function') {
			inner = $('<a href="#" />')
			.click(function(e) {
				e.preventDefault();
				action(e);
			});
		} else {
			li.addClass(action);
			inner = $('<span />');
		}
		
		inner.appendTo(li)
		.text(label);
	};
	
	return Widget;
});