define(['core/nls/index', 
	'core/widgets/Modal'
], function(i18n, Modal) {
	i18n = i18n.plugins.ui;
	
	return function(DA, options) {
		
		DA.ui.alert = function(options, callback) {
			showModal({
				cancel: null
			}, options, callback);
		};
		
		DA.ui.error = function(options, callback) {
			showModal({
				title: i18n.ErrorTitle,
				cancel: null
			}, options, callback);
		};
		
		DA.ui.confirm = function(options, callback) {
			showModal({}, options, callback);
		};
	};
	
	function showModal(def, options, callback) {
		if(typeof options === 'string')
			options = {content: options};
		
		options = $.extend(def, options);
			
		var modal = new Modal(options);
		
		if(callback)
			modal.on('hidden', callback);
			
		modal.create('body');
		modal.render();
		
		return modal;
	};
});