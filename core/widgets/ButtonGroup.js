define([
	'core/dcms-ajax', 
	'core/widgets/Button', 'core/widgets/Dropdown'
], function(DA, Button, Dropdown) {
	
	function Widget() {
		Widget.super_.apply(this, arguments);
	};
	DA.Widget.extend(Widget, {
		buttons: null,
		action: null,
		actions: null
	});
	var proto = Widget.prototype;
	
	proto._create = function(container, parent, elm) {
		if(!elm)
			elm = $('<div class="btn-group" />');
		
		elm = Widget.super_.prototype._create.call(this, container, parent, elm);
		
		if(this.options.action) {
			this._button = new Button(this.options.action);
			this._button.create(elm, this);
		}
		
		if(this.options.actions) {
			this._dropdown = new Dropdown(this.options.actions);
			this._dropdown.create(elm, this);
		}
		
		return elm;
	};
	
	proto._destroy = function() {
		if(this._button) {
			this._button.destroy();
			this._button = null;
		}
		
		if(this._dropdown) {
			this._dropdown.destroy();
			this._dropdown = null;
		}
	};
	
	proto._render = function(options) {
		Widget.super_.prototype._render.apply(this, arguments);
		
		if(options.buttons) {
			this._elm.empty();
			for(var i in options.buttons) {
				this._elm.append(Button.create(options.buttons[i]));
			}
		}
		
		if(options.action) {
			this._button.render(options.action);
		}
		
		if(options.actions) {
			if(options.action) {
				$('<button class="btn dropdown-toggle" data-toggle="dropdown" type="button" />')
				.append('<span class="caret" />')
				.insertAfter(this._button._elm);
			} else {
				$('<button class="btn dropdown-toggle" data-toggle="dropdown" type="button" />')
				.text(options.actionsLabel || options.label)
				.append(' <span class="caret" />')
				.insertAfter(this._button._elm);
			}
			
			this._dropdown.render({
				items: options.actions
			});
		} else {
			this._elm.children('.btn.dropdown-toggle').remove();
		}
	};
	
	return Widget;
});