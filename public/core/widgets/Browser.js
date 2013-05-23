define(['core/dcms-ajax', 
	'core/widgets/Table', 'core/widgets/Pagination'
], function(DA, Table, Pagination) {
	
	function Widget() {
		Widget.super_.apply(this, arguments);
	};
	DA.Widget.extend(Widget);
	var proto = Widget.prototype;
	
	proto.defaults = {
		api: null,
		limit: 20,
		offset: 0,
		count: null,
		fields: {},
		entities: [],
		sort: [],
		tableClass: 'table-hover table-condensed',
		paginationClass: 'pagination-centered'
	};
	
	
	proto.create = function(container) {
		var self = this;
		
		this._elm = $('<div class="browser" />');
		if(container)
			this._elm.appendTo(container);
		
		if(this.options.id)
			this._elm.attr('id', this.options.id);
		
		if(this.options.className)
			this._elm.addClass(this.options.className);
		
		this.table = new Table(this._getTableOptions(this.options));
		this.table.create(this._elm);
		this.table.when('sort', function(columnName, value) {
			if(!self.options.sort[columnName])
				self.options.sort = {};
			
			self.options.sort[columnName] = value;
			self.reload();
		});
		this.table.when('unsort', function(columnName) {
			delete self.options.sort[columnName];
			self.reload();
		});
		
		this.pagination = new Pagination(this._getPaginationOptions(this.options));
		this.pagination.create(this._elm);
		
		this.pagination.on('change', function(page) {
			self.options.offset = (page - 1) * self.options.limit;
			self.reload();
		});
		
		return this._elm;
	};
	
	proto._getTableOptions = function(options) {
		return $.extend(options.table || {}, {
			sort: options.sort,
			className: options.tableClass,
			columns: options.fields,
			rows: options.entities
		});
	};
	
	proto._getPaginationOptions = function(options) {
		return $.extend(options.pagination || {}, {
			className: options.paginationClass,
			pages: options.count && options.limit ? Math.ceil(options.count / options.limit) : null,
			current: options.limit ? 1 + Math.ceil(options.offset / options.limit) : 1
		});
	};
	
	proto._load = function(callback) {
		if(!this.options.api) {
			callback(null);
			return;
		}
		
		var self = this,
				
		options = {
			data: {
				limit: this.options.limit,
				offset: this.options.offset,
				sort: this.options.sort
			}
		};
		
		if(typeof this.options.api === 'string') {
			options.url = this.options.api;
		} else {
			$.extend(true, options, this.options.api);
		}
		
		options.success = function(data) {
			$.extend(self.options, data);
			
			callback(null);
		};
		
		options.error = callback;
		
		DA.api(options);
	};
	
	proto._render = function(options) {
		this.table.render(this._getTableOptions(options));
		this.pagination.render(this._getPaginationOptions(options));
	};
	
	return Widget;
});