define(['core/dcms-ajax', 'core/nls/index'], function(DA, i18n) {
	i18n = i18n.widgets.Table;
	
	function Widget() {
		Widget.super_.apply(this, arguments);
	};
	DA.Widget.extend(Widget);
	var proto = Widget.prototype;
	
	proto.defaults = {
		className: 'table-hover',
		sort: false,
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
	
	proto.isSorted = function(columnName) {
		if(typeof columnName === 'undefined')
			return this.options.sort ? true : false;
		
		return (this.options.sort && this.options.sort[columnName]) || 0;
	};
	
	proto.sort = function(columnName, value) {
		this.emit('sort', columnName, value);
		return this;
	};
	
	proto.unsort = function(columnName) {
		this.emit('unsort', columnName);
		return this;
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
				self._columnLabelRender(column)
				.appendTo(tr)
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
	
	proto._columnLabelRender = function(column) {
		if(!column.label)
			return $('<td />');
		
		var self = this, th = $('<th />'),
		columnName = column.name,
		sorted = this.isSorted(columnName);
		
		if(this.options.sort && !column.disableSort) {
			if(sorted) {
				$('<i />').appendTo(th)
				.addClass(sorted > 0 ? 'icon-arrow-up' : 'icon-arrow-down');
			}
	
			$('<a href="#" />').appendTo(th)
			.text(column.label)
			.click(function(e) {
				e.preventDefault();
				
				if(!sorted)
					self.sort(columnName, 1);
				else if(sorted > 0)
					self.sort(columnName, -1);
				else
					self.unsort(columnName);
			});
		} else {
			th.text(column.label);
		}
		
		return th;
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
	
	proto._renderWidget = function(td, value, row) {
		var widget = this.instance,
		options = this.options || {};

		if(typeof options === 'function')
			options = options(row, value);
		
		if(!widget) {
			widget = this.widget;
			
			if(typeof widget === 'string')
				widget = DA.Widget[widget];
			if(!widget)
				throw new Error('Invalid widget: ' + this.widget);
			
			widget = this.instance = new widget(options);
			widget.create(td);
			
			widget.render();
		} else {
			widget.create(td);
			widget.render(options);
		}
	};
	
	return Widget;
});