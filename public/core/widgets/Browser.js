define(['core/dcms-ajax', 'core/widgets/Table'], function(DA, Table) {
	
	function Widget() {
		Widget.super_.apply(this, arguments);
	};
	DA.Widget.extend(Widget);
	var proto = Widget.prototype;
	
	proto.defaults = $.extend({
		api: null,
		limit: 20,
		offset: 0,
		fields: {},
		entities: []
	}, proto.defaults);
	
	
	proto.create = function(container) {
		this._elm = $('<div class="browser" />');
		if(container)
			this._elm.appendTo(container);
		
		if(this.options.id)
			this._elm.attr('id', this.options.id);
		
		if(this.options.className)
			this._elm.addClass(this.options.className);
		
		this.table = new Table(this._getTableOptions(this.options));
		this.table.create(this._elm);
		
		return this._elm;
	};
	
	proto.get.reload = function(callback) {
		this.options.entities = [{
			_id: '1234567890abcedf',
			name: 'My nice name',
			title: 'My Page Title',
			createdAt: new Date()
		}];
	
		calback(null);
	};
	
	proto._getTableOptions = function(options) {
		return $.extend(options.table || {}, {
			columns: options.fields,
			rows: options.entities
		});
	};
	
	proto._render = function(options) {
		this.table.render(this._getTableOptions(options));
	};
	
	return Widget;
});