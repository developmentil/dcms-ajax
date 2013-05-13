define(function() {
	var name = 'Pages',
	api = '/pages',
	uri = '#' + api;
	
	DA.when('initiated', function(callback) {
		DA.registry.push('layout.menus.main', 20, {
			label: name,
			url: uri
		});
		
		callback();
	});
	
	var browserTabs = [];
	
	DA.app.get(uri, function() {
		var tab = DA.tabs.createTab(name),
		
		browser = new DA.Widget.Browser({
			api: api,
			limit: 20,
			fields: {
				_id: {
					name: '_id',
					label: '#',
					render: function(tag, value, entity) {
						tag.append(
							$('<a href="_blank" />')
							.attr('href', '/pages/' + value)
							.text(value)
						);
					}
				},
				title: 'Title',
				_actions: {
					type: 'actions',
					mainAction: function(entity) {
						return {
							label: 'Edit',
							href: uri + '/' + entity._id + '/edit'
						};
					},
					actions: [function(entity) {
						return {
							label: 'Delete',
							href: uri + '/' + entity._id + '/delete'
						};
					}]
				}
			}
		});
		
		browser.create(tab.element());
		browserTabs.push(tab);
		
		tab.when('load', function(callback) {
			browser.load(true, callback);
		});
		
		tab.on('render', function() {
			browser.render();
		});
	});
	
	DA.app.get(uri + '/:id/edit', function(e) {
		var id = this.params.id,
		tab = DA.tabs.create(name, uri),
		
		form = new Form({
			action: uri + '/' + id + '/edit',
			data: {},
			fieldsets: [
				new FieldSet({
					controls: [{
						name: 'title',
						label: 'Title',
						class: 'input-xlarge'
					}, {
						type: 'htmleditor',
						name: 'content',
						label: 'Content'
					}]
				})
			]
		});

		form.create(tab.element());
		
		tab.when('load', function(callback) {
			DA.api({
				url: api + '/' + id + '/get',
				success: function(entity) {
					form.options.data = entity;
					callback(null);
				},
				error: callback
			});
		});
		
		tab.on('render', function() {
			form.render();
		});
	});
	
	DA.app.post(uri, '/:id/edit', function(e) {
		DA.api({
			url: api + '/' + this.params.id + '/edit',
			data: this.data,
			success: function() {
				// TODO close tab
			}
		});
		
		return false;
	});
	
	DA.app.get(uri, '/:id/delete', function(e) {
		var id = this.params.id;
		
		DA.ui.confirm('Delete?', function(yes) {
			if(!yes) return;

			DA.api({
				type: 'post',
				url: uri + '/' + id + '/delete',
				success: function() {
					DA.tabs.reload(uri);
				}
			});
		});
	});
});