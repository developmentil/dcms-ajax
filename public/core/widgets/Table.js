define(['core/dcms-ajax', 'core/nls/index'], function(DA, i18n) {
	i18n = i18n.widgets.Table;
	
	function Widget() {
		Widget.super_.apply(this, arguments);
	};
	DA.Widget.extend(Widget, {
		class: 'table-hover',
		sort: false,
		columns: null,
		columnsAlign: 'center',
		idField: '_id',
		rows: []
	});
	var proto = Widget.prototype;
	
	proto.eachColumn = function(columns, each) {
		var self = this;
		$.each(columns, function(i, column) {
			column = self._defineColumn(column, i);
			
			each(column, i);
		});
	};
	
	proto.getValue = function(entity, key) {
		var keys = key.split('.');
		for(var i = 0; i < keys.length; i++) {
			if(typeof entity !== 'object')
				return null;
			
			entity = entity[keys[i]];
		}
		
		return entity;
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
	
	proto._create = function(container, parent, elm) {
		if(!elm)
			elm = $('<table class="table" />');
		
		return Widget.super_.prototype._create.call(this, container, parent, elm);
	};
	
	proto._defineColumn = function(column, i) {
		if(typeof column === 'string')
			column = {label: column};

		if(!column.name)
			column.name = i;
		
		if(column.align === undefined)
			column.align = this.options.columnsAlign;
		
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
		Widget.super_.prototype._render.apply(this, arguments);
		
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
						var value = self.getValue(row, column.name),

						td = $('<td />').appendTo(tr);
						if(column.align)
							td.css('textAlign', column.align);
		
						if(column.class)
							td.addClass(column.class);

						if(typeof column.render === 'function')
							column.render(td, value, row);
						else {
							if(column.nullText)
								td.text(value || column.nullText);
							else
								td.text(value);
						}
					});
				} else {
					// render all row props
					for(var j in row) {
						var td = $('<td />').appendTo(tr)
						.text(row[j]);
				
						if(options.columnsAlign)
							td.css('textAlign', options.columnsAlign);
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

		if(column.align)
			th.css('textAlign', column.align);
		
		if(column.class)
			th.addClass(column.class);
		
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
		if(value && value !== '0' && value !== 'false') {
			td.text(this.trueLabel);
			if(this.trueClass)
				td.addClass(this.trueClass);
		} else {
			td.text(this.falseLabel);
			if(this.falseClass)
				td.addClass(this.falseClass);
		}
	};
	
	proto._renderWidget = function(td, value, row) {
		var widget = row.__instance || this.instance,
		options = this.options || {};

		if(typeof options === 'function')
			options = options(row, value);
		
		if(!widget) {
			widget = this.widget;
			
			if(typeof widget === 'string')
				widget = DA.Widget[widget];
			if(!widget)
				throw new Error('Invalid widget: ' + this.widget);
			
			widget = row.__instance = new widget(options);
			widget.create(td);
			
			widget.render();
		} else {
			widget.create(td)
			.render(options);
		}
	};
	
	return Widget;
});