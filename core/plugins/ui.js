define(['core/nls/index', 
	'core/widgets/Modal'
], function(i18n, Modal) {
	i18n = i18n.plugins.ui;
	
	return function(DA, options) {
		
		DA.ui.alert = function(options, callback) {
			setupModal({
				title: i18n.AlertTitle,
				cancel: null
			}, options, callback);
		};
		
		DA.ui.error = function(options, callback) {
			showModal({
				title: i18n.ErrorTitle,
				content: i18n.ErrorMsg,
				cancelLabel: i18n.Continue,
				primaryLabel: i18n.Reset,
				primary: {
					icon: 'icon-refresh icon-white'
				},
				cancelClick: callback,
				primaryClick: function() {
					window.location.reload();
				}
			});
		};
		
		DA.ui.confirm = function(options, callback) {
			setupModal({}, options, callback);
		};
	};
	
	function setupModal(def, options, callback) {
		if(!options || typeof options !== 'object')
			options = {content: options};
		
		options = $.extend(def, options);
			
		return showModal(options, callback);
	};
	
	function showModal(options, callback) {
		var modal = new Modal(options);
		
		if(callback)
			modal.on('hidden', callback);
			
		modal.create('body');
		modal.render();
		
		return modal;
	};
});