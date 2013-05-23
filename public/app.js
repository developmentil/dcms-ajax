requirejs.config({
	catchError: true,
    baseUrl: './',
//	locale: 'he-iw',
    paths: {
		i18n: 'static/js/i18n',
		jquery: 'http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min',
		bootstrap: 'static/libs/bootstrap/js/bootstrap.min',
		'dcms-ajax': 'core/index'
    }
});

requirejs([
	'dcms-ajax', 'bootstrap'
], function(DA) {

	DA.registry.set('layout.brand', 'Demo CMS');
	
//	DA.registry.set('plugins.auth', {
//		uri: '/admin/login',
//		idle: 600 * 1000
//	});
	
	DA.registry.push('modules', 'pages');
	
	DA.bootstrap();
});
