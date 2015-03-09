define(['core/dcms-ajax', 'core/nls/index', 'core/widgets/Control'], function(DA, i18n, Control) {
	i18n = i18n.widgets.Table;
	
	function Widget() {
		Widget.super_.apply(this, arguments);
	};
	DA.Widget.extend(Widget, {
		class: 'table-hover',
		sort: false,
		sortable: null,
		sortableOpts: {},
		columns: null,
		columnsAlign: 'center',
		idField: '_id',
		rows: [],
		noResult: true,
		edit: null
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
			if(!entity)
				return null;
			
			entity = entity[keys[i]];
		}
		
		return entity;
	};
	
	proto.isSorted = function(columnName) {
		var sort = this.options.sort;
		
		if(typeof columnName === 'undefined') {
			if(!sort)
				return false;
			
			if(Array.isArray(sort))
				return sort.length > 0;
			
			return Object.keys(sort).length > 0;
		}
		
		return (sort && sort[columnName]) || 0;
	};
	
	proto.sort = function(columnName, value) {
		this.emit('sort', columnName, value);
		return this;
	};
	
	proto.unsort = function(columnName) {
		this.emit('unsort', columnName);
		return this;
	};
	
	proto.isEdit = function() {
		return this.options.edit ? true : false;
	};
	
	proto.edit = function(stop) {
		this.render({
			edit: !stop
		});
			
		return this;
	};
	
	proto.data = function(changesOnly, keyPostfix) {
		if(!keyPostfix)
			keyPostfix = '';
		
		var data = {}, row, id;
		for(var i in this.options.rows) {
			if(!this.options.rows[i]._changes && changesOnly) continue;
			
			row = this.options.rows[i];
			id = row[this.options.idField] || i;
			
			data[id + keyPostfix] = changesOnly ? row._changes : row;
			delete row._changes;
		}
		
		return data;
	};
	
	proto._create = function(container, parent, elm) {
		if(!elm)
			elm = $('<table class="table" />');
		
		return Widget.super_.prototype._create.call(this, container, parent, elm);
	};
	
	proto._initSortable = function(elm, options) {
		var self = this,
		bUpdate = 'sortupdate.table',
		bStart = 'sortstart.table';

		elm.unbind(bStart);
		elm.unbind(bUpdate);
		
		if(!options.sortable) {
			if(this._elm.hasClass('ui-sortable'))
				this._elm.sortable('destroy');
			
			return;
		}
		
		require(['jquery-ui'], function() {
			var startIndex = -1;

			elm.sortable($.extend({
				appendTo: 'parent',
				axis: 'y',
//				cancel: '.unsortable',
				scrollSensitivityType: 10,
				delay: 150,
				forceHelperSize: true,
				forcePlaceholderSize: true,
				handle: '.sortable-handler',
				items: '> tbody > tr'
			}, options.sortableOpts))

			.bind(bStart, function(e, ui) {
				startIndex = ui.item.index();
				
				self.emit('sortstart', startIndex, ui, e);
			})
			.bind(bUpdate, function(e, ui) {
				self.emit('sortupdate', ui.item.index(), startIndex, ui, e);
				
				startIndex = -1;
			});
		});
	};
	
	proto._defineColumn = function(column, i) {
		if(typeof column === 'string')
			column = {label: column};

		if(!column.name)
			column.name = i;
		
		if(column.align && column.alignLabel === undefined) {
			column.alignLabel = this.options.columnsAlign;
		} else if(column.align === undefined) {
			column.align = this.options.columnsAlign;
			if(column.alignLabel === undefined)
				column.alignLabel = column.align;
		}
		
		if(column.type) {
			var type = column.type.charAt(0).toUpperCase() + column.type.slice(1),
			defineMethod = '_defineColumn' + type,
			filterMethod = '_filter' + type,
			renderMethod = '_render' + type,
			editRenderMethod = '_editRender' + type;
			
			if(typeof this[defineMethod] === 'function')
				column = this[defineMethod](column, i);
			
			if(!column.filter && typeof this[filterMethod] === 'function')
				column.filter = this[filterMethod];
			
			if(!column.render && typeof this[renderMethod] === 'function')
				column.render = this[renderMethod];
			
			if(!column.editor && typeof this[editRenderMethod] === 'function')
				column.editor = this[editRenderMethod];
		}
		
		return column;
	};
	
	proto._render = function(options) {
		Widget.super_.prototype._render.apply(this, arguments);
		
		var self = this, tr, count = 0, columns = 0;
		this._elm.empty();
		
		if(options.columns) {
			this._thead = $('<thead />').appendTo(this._elm);
			tr = $('<tr />').appendTo(this._thead);
			
			this.eachColumn(options.columns, function(column) {
				columns++;
				
				self._columnLabelRender(column)
				.appendTo(tr)
				.attr('data-name', column.name);
			});
		}
		
		this._tbody = $('<tbody />').appendTo(this._elm);
		
		// use for..in to ignore undefined items
		for(var i in options.rows) { (function(row, i) {
			count++;
			
			var id = row[options.idField] || i,

			tr = $('<tr />').appendTo(self._tbody)
			.attr('data-id', id);

			if(options.columns) {
				// render columns only
				self.eachColumn(options.columns, function(column) {
					var key = column.displayName || column.name,
					value = self.getValue(row, key),
					td = Widget.createElm($('<td />').appendTo(tr), column);

					if(column.filter)
						value = column.filter(value, row, i);

					if(column.align)
						td.css('textAlign', column.align);

					if(column.dir)
						td.attr('dir', column.dir);

					if(column.primary)
						td.addClass('primary');

					Widget.renderElm(td, column);

					if(!options.edit || !column.control) {
						if(typeof column.render === 'function')
							column.render(td, value, row, i);
						else {
							self._defaultRender.call(column, td, value, row, i);
						}
					} else {
						var opts = column.control;
						if(typeof opts === 'function') {
							opts = opts(value, row, i);
						} else {
							if(typeof opts === 'string')
								opts = {type: opts};
							else if(typeof opts !== 'object')
								opts = {};
								
							opts.value = value;
						}
						
						if(typeof column.editor === 'function')
							column.editor(td, opts, row, key);
						else {
							self._defaultEditor.call(column, td, opts, row, key);
						}
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
		})(options.rows[i], i); }
	
		if(!count && options.noResult && columns) {
			tr = $('<tr />').appendTo(self._tbody);
	
			$('<td />').appendTo(tr)
			.attr('colspan', columns)
			.addClass('no-result')
			.text(i18n.NoResult);
		}
		
		this._initSortable(this._elm, options);
	};
	
	proto._columnLabelRender = function(column) {
		if(!column.label)
			return $('<td />');
		
		var self = this, th = $('<th />'),
		columnName = column.name,
		sortName = column.sortBy || column.sortName || columnName,
		sorted = this.isSorted(sortName);

		if(column.alignLabel)
			th.css('textAlign', column.alignLabel);
		
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
					self.sort(sortName, 1);
				else if(sorted > 0)
					self.sort(sortName, -1);
				else
					self.unsort(sortName);
			});
		} else {
			th.text(column.label);
		}
		
		return th;
	};
	
	proto._defaultRender = function(td, value, row, i) {
		if(this.nullText !== null)
			td.text(value || this.nullText || '-');
		else
			td.text(value);
	};
	
	proto._defaultEditor = function(td, opts, row, key) {
		var control = Control.create(opts);
		
		control.on('change', function() {
			if(!row._changes)
				row._changes = {};
						
			row._changes[key] 
					= row[key] 
					= control.sendVal();
		});
		
		control.create(td);
		control.load();
	};
	
	proto._defineColumnBoolean = function(column, i) {
		column = $.extend({
			trueLabel: i18n.Yes,
			falseLabel: i18n.No,
			trueClass: 'text-success',
			falseClass: 'text-error',
			invert: false
		}, column);
			
		return column;
	};
	
	proto._filterBoolean = function(value, row, i) {
		return (value && value !== '0' && value !== 'false');
	};
	
	proto._renderBoolean = function(td, value, row, i) {
		var flag = this.invert ? !value : value;
		
		if(flag) {
			td.text(this.trueLabel);
			if(this.trueClass)
				td.addClass(this.trueClass);
		} else {
			td.text(this.falseLabel);
			if(this.falseClass)
				td.addClass(this.falseClass);
		}
	};
	
	proto._defineColumnNumber = function(column, i) {
		column = $.extend({
			dir: 'ltr'
		}, column);
		
		return column;
	};
	
	proto._filterNumber = function(value, row, i) {
		if(!value)
			return null;
		
		return this.isInt ? parseInt(value, 10) : parseFloat(value, 10);
	};
	
	proto._renderNumber = function(td, value, row, i) {
		if(typeof value !== 'number') {
			td.text(this.nullText || '-');
			return;
		}
		
		if(typeof this.fixed === 'number')
			value = value.toFixed(this.fixed);
		
		td.text(value);
	};
	
	proto._defineColumnCurrency = function(column, i) {
		column = $.extend({
			currency: DA.registry.get('currency.symbol'),
			fixed: 2,
			dir: 'ltr'
		}, column);
			
		return column;
	};
	
	proto._filterCurrency = function(value, row, i) {
		if(!value)
			return null;
		
		return parseFloat(value, 10);
	};
	
	proto._renderCurrency = function(td, value, row, i) {
		if(typeof value !== 'number') {
			td.text(this.nullText || '-');
			return;
		}
		
		var num = value.toFixed(this.fixed);
		
		if(this.currency)
			num += ' ' + this.currency;
		
		td.text(num);
	};
	
	proto._filterFullDate = function(value, row, i) {
		return new Date(value);
	};
	
	proto._renderFullDate = function(td, value, row, i) {
		var format = this.format 
				|| (DA.registry.get('locale.date') + ' ' + DA.registry.get('locale.time')) 
				|| 'mm/dd/yy HH:ii:ss';
		
		if(isNaN(value.getTime())) {
			td.text(this.nullText || '-');
			return;
		}
		
		format = $.datepicker.formatDate(format, value);
		format = formatTime(format, value);
		
		td.text(format);
	};
	
	proto._filterDate = function(value, row, i) {
		return new Date(value);
	};
	
	proto._renderDate = function(td, value, row, i) {
		var format = this.format 
				|| DA.registry.get('locale.date') 
				|| 'mm/dd/yy';
		
		if(isNaN(value.getTime())) {
			td.text(this.nullText || '-');
			return;
		}
		
		td.text($.datepicker.formatDate(format, value));
	};
	
	proto._filterTime = function(value, row, i) {
		return new Date(value);
	};
	
	proto._renderTime = function(td, value, row, i) {
		var format = this.format 
				|| DA.registry.get('locale.time');
		
		if(isNaN(value.getTime())) {
			td.text(this.nullText || '-');
			return;
		}
		
		td.text(formatTime(format, value));
	};
	
	proto._renderSortable = function(td, value, row, i) {
		var icon = this.icon || 'icon-resize-vertical';
		
		$('<i class="sortable-handler" />')
		.prependTo(td)
		.addClass(icon.class || icon);
	};
	
	proto._renderWidget = function(td, value, row, i) {
		var widget = row.__instance || this.instance,
		options = this.options || {};

		if(typeof options === 'function')
			options = options(row, value, i);
		
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
			widget.create(td);
			widget.render(options);
		}
	};
	
	return Widget;
	
	
	function formatTime(format, date) {
		var lendingZero = function(i) {
			return (i < 10 ? '0' + i : i);
		};
		
		if(!format)
			format = 'HH:ii:ss';
		
		format = format.replace(/HH/g, lendingZero(date.getHours()));
		format = format.replace(/hh/g, lendingZero(date.getHours() % 12 || 12));
		format = format.replace(/ii/g, lendingZero(date.getMinutes()));
		format = format.replace(/ss/g, lendingZero(date.getSeconds()));
		format = format.replace(/a/g, date.getHours() < 12 ? 'am' : 'pm');
		format = format.replace(/A/g, date.getHours() < 12 ? 'AM' : 'PM');
		
		return format;
	}
});