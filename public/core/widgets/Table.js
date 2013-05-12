define(['core/dcms-ajax', 'core/nls/index'], function(DA, i18n) {
	i18n = i18n.widgets.Table;
	
	function Widget() {
		Widget.super_.apply(this, arguments);
	};
	DA.Widget.extend(Widget);
	var proto = Widget.prototype;
	
	proto.defaults = {
		className: 'table-hover',
		columns: null,
		idField: '_id',
		rows: []
	};
	
	proto.create = function(container) {		
		this._elm = $('<table class="table" />');
		if(container)
			this._elm.appendTo(container);
		
		if(this.options.id)
			this._elm.attr('id', this.options.id);
		
		if(this.options.className)
			this._elm.addClass(this.options.className);
		
		return this._elm;
	};
	
	proto.eachColumn = function(columns, each) {
		var self = this;
		$.each(columns, function(i, column) {
			column = self._defineColumn(column, i);
			
			each(column, i);
		});
	};
	
	proto._defineColumn = function(column, i) {
		if(typeof column === 'string')
			column = {label: column};

		if(!column.name)
			column.name = i;
		
		if(column.type) {
			var type = column.type.charAt(0).toUpperCase() + column.type.slice(1),
			defineMethod = '_defineColumn' + type,
			renderMethod = '_render' + type;
			
			if(typeof this[defineMethod] === 'function')
				column = this[defineMethod](column, i);
			if(!column.render && typeof this[renderMethod] === 'function')
				column.render = this[renderMethod];
		}
		
		return column;
	};
	
	proto._render = function(options) {
		var self = this, tr;
		this._elm.empty();
		
		if(options.columns) {
			this._thead = $('<thead />').appendTo(this._elm);
			tr = $('<tr />').appendTo(this._thead);
			
			this.eachColumn(options.columns, function(column) {
				var td = column.label ? $('<th />').text(column.label) : $('<td />');
				
				td.appendTo(tr)
				.attr('data-name', column.name);
			});
		}
		
		this._tbody = $('<tbody />').appendTo(this._elm);
		
		// use for..in to ignore undefined items
		for(var i in options.rows) {
			(function(row) {
				var id = row[options.idField] || i,
				
				tr = $('<tr />').appendTo(self._tbody)
				.attr('data-id', id);
		
				if(options.columns) {
					// render columns only
					self.eachColumn(options.columns, function(column) {
						var value = row[column.name],

						td = $('<td />').appendTo(tr);

						if(typeof column.render === 'function')
							column.render(td, value, row);
						else
							td.text(value);
					});
				} else {
					// render all row props
					for(var j in row) {
						$('<td />').appendTo(tr)
						.text(row[j]);
					}
				}
			})(options.rows[i]);
		}
	};
	
	proto._defineColumnBoolean = function(column, i) {
		column = $.extend({
			trueLabel: i18n.Yes,
			falseLabel: i18n.No,
			trueClass: 'text-success',
			falseClass: 'text-error'
		}, column);
			
		return column;
	};
	
	proto._renderBoolean = function(td, value, row) {
		if(value) {
			td.text(this.trueLabel);
			if(this.trueClass)
				td.addClass(this.trueClass);
			if(this.trueClass)
				td.addClass(this.trueClass);
		} else {
			td.text(this.trueLabel);
			if(this.falseClass)
				td.addClass(this.falseClass);
		}
	};
	
	proto._renderActions = function(td, value, row) {
		var actionLabel = i18n.Action, group = td;
		if(this.actions) {
			group = $('<div class="btn-group" />').appendTo(td);
		}
		
		if(this.action) {
			var action = this.action;
			if(typeof action === 'function')
				action = action(row, value);
			
			var button = $('<a class="btn" />')
			.appendTo(group)
			.text(action.label || actionLabel)
			.attr('href', action.url || '#');
	
			if(action.click) {
				button.click(function(e) {
					e.preventDefault();
					action.click(e);
				});
			}
			
			if(this.actions) {
				$('<button class="btn dropdown-toggle" data-toggle="dropdown" type="button" />')
				.append('<span class="caret" />')
				.appendTo(group);
			}
		} else {
			$('<button class="btn dropdown-toggle" data-toggle="dropdown" type="button" />')
			.text(this.actionsLabel || this.label || actionLabel)
			.append(' <span class="caret" />')
			.appendTo(group);
		}
		
		if(this.actions) {
			var ul = $('<ul class="dropdown-menu" />').appendTo(group);
			$.each(this.actions, function(i, action) {
				if(typeof action === 'function')
					action = action(row, value);
				
				var li = $('<li />').appendTo(ul),
				a = $('<a tabindex="-1" />').appendTo(li)
				.text(action.label || actionLabel)
				.attr('href', action.url || '#');
		
				if(action.click) {
					a.click(function(e) {
						e.preventDefault();
						action.click(e);
					});
				}
			});
		}
	};
	
	return Widget;
});