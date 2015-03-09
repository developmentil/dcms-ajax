define(['core/dcms-ajax', 'core/nls/index',
	'core/widgets/Table', 'core/widgets/Pagination', 'core/widgets/Select'
], function(DA, i18n, Table, Pagination, Select) {
	i18n = i18n.widgets.Browser;
	
	function Widget() {
		Widget.super_.apply(this, arguments);
	};
	DA.Widget.extend(Widget, {
		api: null,
		limit: null,
		offset: 0,
		count: null,
		sortable: false,
		sortableApi: null,
		sortableColumn: {},
		fields: {},
		entities: [],
		sort: {},
		tableClass: 'table-hover table-condensed',
		pagination: {},
		paginationClass: 'pagination-centered',
		limits: {},
		limitsClass: 'browser-limits',
		limitsOptions: [10, 20, 50, 100],
		summary: true,
		summaryClass: 'browser-summary',
		edit: null,
		saveApi: null,
		saveIdPostfix: null,
		saveOnReload: true
	});
	var proto = Widget.prototype;
	
	proto.isSorted = function() {
		return Table.prototype.isSorted.apply(this, arguments);
	};
	
	proto.isSortable = function() {
		var sortable = this.options.sortable;
		switch(typeof sortable)  {
			case 'string':
				return this.isSorted(sortable);
				
			case 'object':
				if(sortable === null)
					return !this.isSorted();
				
				for(var i in sortable) {
					var r1 = sortable[i],
					r2 = this.isSorted(i);
			
					if(r1 === r2 || (r1 === true && r2))
						return true;
				}
				return false;
			
			case 'function':
				return sortable(this.options.sort, this.options, this);
				
			case 'boolean':
			default:
				return sortable;
		}
	};
	
	proto.rePosition = function(source, target, callback) {
		var self = this,
		entities = self.options.entities,
		entity = entities[source],
		
		next = function(err) {
			if(err) return callback(err);
			
			if(Array.isArray(entities)) {
				entities.splice(source, 1);
				entities.splice(target, 0, entity);
				
				self.render();
			}
			
			callback(err);
		};
		
		if(!entity)
			return callback(new Error('Invalid source; Browser.rePosition'));
		
		if(this.options.sortableApi) {
			var options = this._apiOptions(this.options.sortableApi);
			
			if(!options.type)
				options.type = 'post';
			options.data.source = source;
			options.data.target = source < target ?  target+1 : target;
			
			DA.api(options, next);
		} else {
			next(null);
		}
	};
	
	proto.isEdit = function() {
		return this.options.edit ? true : false;
	};
	
	proto.edit = function(flag) {
		this.options.edit = flag;
		this.table.edit(!flag);
		
		return this;
	};
	
	proto.toggleEdit = function(toggle) {
		if(toggle === undefined)
			toggle = !this.options.edit;
		
		this.table.edit(this.options.edit);
		
		if(this.options.edit && !toggle)
			this.save();
		
		this.options.edit = toggle;
		return this;
	};
	
	proto.saveReload = function(callback) {
		if(!this.options.edit || !this.options.saveOnReload || !this.options.saveApi)
			return this.reload(false, callback);
		
		var self = this;
		this.save(function(err) {
			if(err) return callback.apply(self, arguments);
			
			self.reload(false, callback);
		});
	};
	
	proto.save = function(callback) {
		if(!this.options.saveApi) {
			callback(new Error('`saveApi` not defined'));
			return this;
		}
		
		var options = $.extend({
			type: 'post'
		}, (typeof this.options.saveApi === 'string' 
				? {url: this.options.saveApi}
				: this.options.saveApi));
		
		if(!options.data)
			options.data = {};
		
		options.data.rows = this.table.data(true, this.options.saveIdPostfix);
		if($.isEmptyObject(options.data.rows)) {
			setTimeout(callback, 1);
			return this;
		}
			
		DA.api(options, callback);
		return this;
	};
	
	proto._create = function(container, parent, elm) {
		if(!elm)
			elm = $('<div class="browser" />');
		
		elm = Widget.super_.prototype._create.call(this, container, parent, elm);
		
		var self = this;
		
		this.table = new Table(this._getTableOptions(this.options));
		this.table.create(elm, this);
		this.table.when('sort', function(columnName, value) {
			if(!self.options.sort[columnName])
				self.options.sort = {};
			
			self.options.sort[columnName] = value;
			self.saveReload();
		});
		this.table.when('unsort', function(columnName) {
			delete self.options.sort[columnName];
			self.saveReload();
		});
		this.table.when('sortupdate', function(endPos, startPos, ui, e) {
			self.rePosition(startPos, endPos, function(err) {
				if(err) {
					DA.error('Error on table sorting', err);
					self.saveReload();
				}
			});
		});
		
		if(this.options.summary) {
			this.summary = $('<div />').appendTo(elm)
			.addClass(this.options.summaryClass);
		} else {
			this.summary = null;
		}
		
		if(this.options.limitsOptions) {
			this.limits = new Select(this._getLimitsOptions(this.options));
			this.limits.create(elm, this);
		
			this.limits.on('change', function() {
				self.options.limit = self.limits.val();
				self.saveReload();
			});
		} else {
			this.limits = null;
		}
		
		this.pagination = new Pagination(this._getPaginationOptions(this.options));
		this.pagination.create(elm, this);
		
		this.pagination.on('change', function(page) {
			self.options.offset = (page - 1) * self.options.limit;
			self.saveReload();
		});
		
		return elm;
	};
	
	proto._destroy = function() {
		this.table.destroy();
		this.table = null;
		
		this.summary = null;
		
		this.limits.destroy();
		this.limits = null;
		
		this.pagination.destroy();
		this.pagination = null;
	};
	
	proto._getTableOptions = function(options) {
		var sortable = this.isSortable(),
		sortableColumn = null, columms;

		if(sortable && options.sortableColumn) {
			sortableColumn = $.extend({
				type: 'sortable',
				name: '_sortable'
			}, options.sortableColumn);
		}

		if(Array.isArray(options.fields)) {
			columms = [];
			
			if(sortableColumn)
				columms.push(sortableColumn);
			
			columms.push.apply(columms, options.fields);
		} else {
			columms = {};
			
			if(sortableColumn)
				columms[sortableColumn.name] = sortableColumn;
			
			$.extend(columms, options.fields);
		}
		
		return $.extend(options.table || {}, {
			sortable: sortable,
			sort: options.sort,
			class: options.tableClass,
			columns: columms,
			rows: options.entities,
			edit: options.edit
		});
	};
	
	proto._getPaginationOptions = function(options) {
		return $.extend(options.pagination || {}, {
			class: options.paginationClass,
			pages: options.count && options.limit ? Math.ceil(options.count / options.limit) : null,
			current: options.limit ? 1 + Math.ceil(options.offset / options.limit) : 1
		});
	};
	
	proto._getLimitsOptions = function(options) {
		var opts = {};
		$.each(options.limitsOptions, function(i, v) {
			opts[v] = i18n.DisplayLimit.replace(':limit', v);
		});
		
		return $.extend(options.limits || {}, {
			name: 'limit',
			class: options.limitsClass,
			options: opts,
			value: options.limit
		});
	};
	
	proto._apiOptions = function(api) {
		var options = {
			data: {
				limit: this.options.limit,
				offset: this.options.offset,
				sort: this.options.sort
			}
		};
		
		if(typeof api === 'string') {
			options.url = api;
		} else {
			$.extend(true, options, api);
		}
		
		return options;
	};
	
	proto._load = function(callback) {
		if(!this.options.api) {
			callback(null);
			return;
		}
		
		var self = this,
		options = this._apiOptions(this.options.api);
		
		DA.api(options, function(err, data) {
			if(err) return callback(err);
			
			$.extend(self.options, data);
			callback(null);
		});
	};
	
	proto._render = function(options) {
		Widget.super_.prototype._render.apply(this, arguments);
		
		this.table.render(this._getTableOptions(options));
		
		if(options.count || options.count === null) {
			if(this.summary) {
				this.summary.show().text(i18n.Summary
						.replace(':from', options.offset + 1)
						.replace(':to', Math.min(options.offset + options.limit, options.count))
						.replace(':total', options.count)
						.replace(':pages', Math.ceil(options.count / options.limit))
				);
			}

			if(this.limits) {
				this.limits._elm.show();
				this.limits.render(this._getLimitsOptions(options));
			}
		} else {
			if(this.summary)
				this.summary.hide();
			
			if(this.limits)
				this.limits._elm.hide();
		}
		
		this.pagination.render(this._getPaginationOptions(options));
	};
	
	return Widget;
});