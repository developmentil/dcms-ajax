define(function() {
	var name = 'Pages',
	uri = '/pages';
	
	DA.on('initiated', function(callback) {
		DA.registry.push('layout.menus.main', 20, {
			label: name,
			url: '#' + uri
		});
		
		callback();
	});
	
	var browserTabs = [];
	
	DA.app.get('#' + uri, function() {
		console.log(uri);
	});
	
//	module.route(uri, function() {
//		var tab = DA.tabs.create(name, uri),
//		browser = new Browser({
//			api: uri,
//			limit: 20,
//			columns: [{
//				name: '_id',
//				label: '#',
//				render: function(tag, value, entity) {
//					tag.append(
//						$('<a href="_blank" />')
//						.href('/pages/' + value)
//						.text(value)
//					);
//				}
//			}, {
//				name: 'title',
//				label: 'Title'
//			}, {
//				type: 'actions',
//				mainAction: function(entity) {
//					return {
//						label: 'Edit',
//						href: '#' + uri + '/' + entity._id + '/edit'
//					};
//				},
//				actions: [function(entity) {
//					return {
//						label: 'Delete',
//						href: '#' + uri + '/' + entity._id + '/delete'
//					};
//				}]
//			}]
//		});
//		
//		browserTabs.push(browserTabs);
//		
//		tab.on('load', function(callback) {
//			browser.load(callback);
//		});
//		
//		tab.on('render', function(container) {
//			browser.render(container);
//		});
//	});
//	
//	module.route(uri + '/:id/edit', function(e, id) {
//		var tab = DA.tabs.create(name, uri);
//		
//		tab.on('load', function(callback) {
//			DA.api({
//				url: uri + '/' + id + '/get',
//				success: function(entity) {
//					tab.ajaxForm = new AjaxForm({
//						api: uri + '/' + id + '/edit',
//						entity: entity,
//						fieldsets: [
//							new FieldSet({
//								controls: [{
//									name: 'title',
//									label: 'Title',
//									class: 'input-xlarge'
//								}, {
//									type: 'htmleditor',
//									name: 'content',
//									label: 'Content'
//								}]
//							})
//						]
//					});
//					
//					callback(null);
//				},
//				error: callback
//			});
//		});
//		
//		tab.on('render', function(container) {
//			tab.ajaxForm.render(container);
//		});
//	});
//	
//	module.route(uri + '/:id/delete', function(e, id) {
//		DA.ui.confirm('Delete?', function(yes) {
//			if(!yes) return;
//
//			DA.api({
//				type: 'post',
//				url: uri + '/' + id + '/delete',
//				success: function() {
//					DA.tabs.reload(uri);
//				}
//			});
//		});
//	});
});