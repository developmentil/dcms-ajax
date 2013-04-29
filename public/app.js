requirejs.config({
    baseUrl: 'core',
    paths: {
        plugins: '../plugins',
        widgets: '../widgets',
        modules: '../modules'
    }
});

requirejs(['dcms-ajax'], function(DA) {

	DA.on('init', function() {
		console.log('DA.init');
	});
	
	DA.on('load', function() {
		console.log('DA.load');
	});
	
//	DA.registry.set('plugins.auth', {
//		uri: '/admin/login',
//		idle: 600 * 1000
//	});
	
	DA.registry.set('plugins.layout');
	
	DA.registry.push('modules', 'pages');
	
	DA.app();
});
