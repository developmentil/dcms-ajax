define(['core/nls/index', 
	'core/widgets/Modal', 'core/widgets/FormHorizontal'
], function(i18n, Modal, FormHorizontal) {
	i18n = i18n.plugins.auth;
	var accountMenu = {
		label: i18n.MyAccount,
		items: []
	};
	
	return function(DA, options) {
		DA.identity = null;
		
		if(typeof options === 'string')
			options = {api: options};
		
		options = $.extend({
			api: null,
//			idle: 600000, // reminer each 10 min.
			priority: 1000000,
			cancelUri: '..',
			usernameControl: {},
			passwordControl: {},
			controls: null
		}, options);
		
		DA.registry.set('layout.menus.account', accountMenu.items);
		DA.registry.push('layout.menus.auth', 800, accountMenu);
		
		accountMenu.items[800] = {
			label: i18n.Logout,
			click: logout
		};
		
		var controls = options.controls;
		if(!controls) {
			controls = [
				$.extend({
					name: 'email',
					placeholder: i18n.Email,
					dir: 'ltr'
				}, options.usernameControl),
				
				$.extend({
					type: 'password',
					name: 'password',
					placeholder: i18n.Password,
					dir: 'ltr'
				}, options.passwordControl),
				
				{
					type: 'submit',
					wrap: false,
					css: {
						display: 'none'
					}
				}
			];
		}
		
		
		DA.when('runned', function(callback) {
			DA.api(options.api, function(err, data) {
				if(err || !data) return displayLoginModal(callback);
				
				DA.identity = data;
				callback();
			});
		}, options.priority);
		
		
		function displayLoginModal(callback) {
			var modal = new Modal({
				title: i18n.LoginTitle,
				primaryLabel: i18n.Login,
				close: false,
				autoDestroy: false,
				cancelClick: function() {
					window.location = options.cancelUri;
				},
				primaryDismiss: false,
				primaryClick: function() {
					form.submit();
				}
			}),
			
			form = new FormHorizontal({
				controls: controls,
				onSubmit: function(e) {
					e.preventDefault();
					modal.hide();
					
					DA.api({
						type: 'post',
						url: options.api + '/login',
						data: this.serialize(),
						success: function(data) {
							DA.identity = data;
							
							modal.destroy();
							callback();
						},
						error: function() {
							DA.ui.alert(i18n.InvaildError, function() {
								modal.show();
							}, 2000);
						}
					});
				}
			});
			
			modal.create('body');
			
			modal.insert(form);
			modal.render();
		};
		
		function logout() {
			DA.api({
				url: options.api + '/logout',
				success: function() {
					window.location = options.cancelUri;
				}
			});
		}
	};
});