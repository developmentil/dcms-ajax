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
			timeout: 3600 * 1000, // 1 hour
			idle: 1200 * 1000, // 20 minutes
			priority: 1000000,
			cancelUri: '..',
			usernameControl: {},
			passwordControl: {},
			controls: null,
			credits: [{
				name: 'Development IL',
				image: '/cms/images/logo.png',
				link: 'http://www.development.co.il'
			}]
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
					id: 'username',
					name: 'email',
					placeholder: i18n.Email,
					dir: 'ltr',
					autofocus: true
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
						position: 'absolute',
						top: '-1000px'
					}
				}
			];
		}
		
		
		DA.when('runned', function(callback) {			
			DA.api(options.api, function(err, data) {
				if(err || !data) return displayLoginModal(callback);
				
				loggedIn(data);
				callback();
			});
		}, options.priority);
		
		
	
	
		var _timeout = null, _idle = null;

		DA.autoLogout = function(stop) {
			if(_timeout) clearTimeout(_timeout);
			if(_idle) clearTimeout(_idle);

			if(stop || !DA.identity) return;

			_idle = setTimeout(function() {
				_idle = null;
				
				DA.ui.confirm({
					title: i18n.IdleTitle,
					content: i18n.IdleMsg,
					primaryLabel: i18n.Continue,
					cancelLabel: i18n.Logout
				}, function(result) {
					if(!result) return logout();
					
					DA.api(options.api, function(err, data) {
						if(err || !data) return logout();
					});
				});
			}, options.idle);

			_timeout = setTimeout(function() {
				logout(true);
			}, options.timeout);
		};
		
		
		function displayLoginModal(callback) {
			var modal = new Modal({
				id: 'auth-modal',
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
							loggedIn(data);
							
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
			
			if(options.credits) {
				var credits = $('<div class="credits" />')
				.appendTo('#auth-modal');

				$.each(options.credits, function(i, credit) {
					$('<a target="_blank" />').appendTo(credits)
					.attr('href', credit.link || '#')
					.append($('<img />').attr({
						src: credit.image,
						alt: credit.name || ''
					}));
				});
			}
			
			modal.insert(form);
			modal.render();
			
			// focus bug HACK FIX
			var username = $('#username').focus();
			setTimeout(function() {
				username.focus();
			}, 500);
		};
		
		function loggedIn(identity) {
			DA.identity = identity;
			
			DA.autoLogout();
			
			DA.on('api', function() {
				DA.autoLogout();
			});
		}
		
		function logout(reload) {
			DA.api({
				url: options.api + '/logout',
				success: function() {
					if(!reload)
						window.location = options.cancelUri;
					else
						window.location.reload();
				}
			});
		}
	};
});