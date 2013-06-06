define(['core/dcms-ajax'], function(DA) {
	
	function Widget() {
		Widget.super_.apply(this, arguments);
	};
	DA.Widget.extend(Widget, {
		className: 'progress-striped',
		barClass: '',
		percentage: 0.6,
		bars: []
	});
	var proto = Widget.prototype;
	
	Widget.createBar = function(options) {
		var percent = typeof options.percentage === 'number' ? options.percentage : options,
		
		elm = $('<div class="bar" />')
		.css('width', (percent * 100) + '%');
		
		if(options.barClass)
			elm.addClass(options.barClass);
		
		return elm;
	};
	
	proto._create = function(container, parent, elm) {
		if(!elm)
			elm = $('<div class="progress" />');
		
		elm = Widget.super_.prototype._create.call(this, container, parent, elm);
		
		return elm;
	};
	
	proto._render = function(options) {
		this._elm.empty().removeClass('progress-striped active');
		
		$.each(options.bars, function(i, bar) {
			Widget.createBar(bar)
			.appendTo(this._elm);
		});
		
		Widget.createBar(options)
		.appendTo(this._elm);
	};
	
	return Widget;
});