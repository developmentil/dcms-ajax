define(['core/dcms-ajax'], function(DA) {
	
	function Widget() {
		Widget.super_.apply(this, arguments);
	};
	DA.Widget.extend(Widget, {
		type: null,
		url: null,
		label: null,
		click: null,
		toggle: null
	});
	var proto = Widget.prototype;
	
	Widget.create = function(options, elm) {
		var type = options.type || (options.url ? 'link' : 'button');
		
		if(type === 'link')
			elm = $('<a class="btn" />').attr('href', options.url || '#');
		else if(type === 'span' || type === 'div')
			elm = $('<' + type + ' class="btn" />');
		else
			elm = $('<button class="btn" />').attr('type', options.type || 'button');
		
		if(options.id)
			elm.attr('id', options.id);
		
		if(options.class)
			elm.addClass(options.class);
		
		elm.text(options.label);

		if(options.icon) {
			elm.prepend(' ');
			
			$('<i />')
			.prependTo(elm)
			.addClass(options.icon.class || options.icon);
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
			elm = Widget.create(this.options);
		}
		
		return Widget.super_.prototype._create.call(this, container, parent, elm);
	};
	
	return Widget;
});