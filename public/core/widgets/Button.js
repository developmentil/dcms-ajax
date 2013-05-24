define(['core/dcms-ajax'], function(DA) {
	
	function Widget() {
		Widget.super_.apply(this, arguments);
	};
	DA.Widget.extend(Widget);
	var proto = Widget.prototype;
	
	proto.defaults = {
		type: null,
		url: null,
		label: null,
		click: null,
		toggle: null
	};
	
	Widget.render = function(options, elm) {
		var isLink = (options.url || options.type === 'link');
		
		if(!elm) {
			elm = isLink ? $('<a class="btn" />') : $('<button class="btn" />');
		} else {
			elm.empty();
		}
		
		if(options.id)
			elm.attr('id', options.id);
		
		if(options.className)
			elm.addClass(options.className);
		
		elm.text(options.label);

		if(options.icon) {
			elm.prepend(' ');
			
			$('<i />')
			.prependTo(elm)
			.addClass(options.icon.className || options.icon);
		}
		
		if(isLink) {
			elm.attr('href', options.url || '#');
		} else {
			elm.attr('type', options.type || 'button');
		}

		if(options.toggle)
			elm.attr('data-toggle', options.toggle);
		
		if(options.click) {
			elm.click(function(e) {
				if(!options.useDefault)
					e.preventDefault();

				return options.click.apply(this, arguments);
			});
		}
		
		return elm;
	};
	
	proto._create = function(container, parent, elm) {
		if(!elm) {
			elm = Widget.render(this.options);
		}
		
		return Widget.super_.prototype._create.call(this, container, parent, elm);
	};
	
	proto._render = function(options) {
		Widget.render(options, this._elm);
	};
	
	return Widget;
});