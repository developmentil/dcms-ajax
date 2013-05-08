define(['core/dcms-ajax'], function(DA) {
	
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
	
	proto._render = function(options) {
		var self = this, tr;
		this._elm.empty();
		
		if(options.columns) {
			this._thead = $('<thead />').appendTo(this._elm);
			tr = $('<tr />').appendTo(this._thead);
			
			$.each(options.columns, function(name, column) {
				if(column.name)
					name = column.name;
				
				var td = column.label ? $('<th />').text(column.label) : $('<td />');
				
				td.appendTo(tr)
				.attr('data-name', name);
			});
		}
		
		this._tbody = $('<tbody />').appendTo(this._elm);
		
		// use for..in to ignore undefined items
		for(var i in options.rows) {
			(function(row) {
				var id = row[options.idField] || i,
				
				tr = $('<tr />').appendTo(self._tbody)
				.attr('data-id', id);
				
				$.each(options.columns, function(name, column) {
					if(column.name)
						name = column.name;

					var value = row[name],
					
					td = $('<td />').appendTo(tr);
					
					if(typeof column.render === 'function')
						column.render(td, value, row);
					else
						column.text(value);
				});
			})(options.rows[i]);
		}
	};
	
	return Widget;
});