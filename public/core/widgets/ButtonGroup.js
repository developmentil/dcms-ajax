define(['core/dcms-ajax'], function(DA) {
	
	function Widget() {
		Widget.super_.apply(this, arguments);
	};
	DA.Widget.extend(Widget);
	var proto = Widget.prototype;
	
	
	proto._create = function(container, parent, elm) {
		if(!elm)
			elm = $('<div class="btn-group" />');
		
		return Widget.super_.prototype._create.call(this, container, parent, elm);
	};
	
	proto._render = function(options) {
		this._elm.empty();
		
		if(options.action) {
			var action = options.action;
			
			var button = $('<a class="btn" />')
			.appendTo(this._elm)
			.text(action.label)
			.attr('href', action.url || '#');
	
			if(action.click) {
				button.click(function(e) {
					if(!action.useDefault)
						e.preventDefault();
					
					return action.click.apply(this, arguments);
				});
			}
			
			if(options.actions) {
				$('<button class="btn dropdown-toggle" data-toggle="dropdown" type="button" />')
				.append('<span class="caret" />')
				.appendTo(this._elm);
			}
		} else {
			$('<button class="btn dropdown-toggle" data-toggle="dropdown" type="button" />')
			.text(options.actionsLabel || options.label)
			.append(' <span class="caret" />')
			.appendTo(this._elm);
		}
		
		if(options.actions) {
			var ul = $('<ul class="dropdown-menu" />').appendTo(this._elm);
			$.each(options.actions, function(i, action) {
				var li = $('<li />').appendTo(ul),
				a = $('<a />').appendTo(li)
				.attr('tabindex', action.tabindex || -1)
				.text(action.label)
				.attr('href', action.url || '#');
		
				if(action.click) {
					a.click(function(e) {
						if(!action.useDefault)
							e.preventDefault();

						return action.click.apply(this, arguments);
					});
				}
			});
		}
	};
	
	return Widget;
});