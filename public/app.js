requirejs.config({
    baseUrl: 'core',
    paths: {
		jquery: 'http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min',
		bootstrap: '../static/libs/bootstrap/js/bootstrap.min',
        plugins: '../plugins',
        widgets: '../widgets',
        modules: '../modules'
    }
});

requirejs([
	'dcms-ajax', 'jquery', 'bootstrap'
], function(DA) {

	DA.registry.set('layout.brand', 'Demo CMS');
	
	DA.registry.set('plugins.layout');
//	DA.registry.set('plugins.auth', {
//		uri: '/admin/login',
//		idle: 600 * 1000
//	});
	
	DA.registry.push('modules', 'pages');
	
	DA.bootstrap();
});
