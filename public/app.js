requirejs.config({
    baseUrl: 'core',
    paths: {
        plugins: '../plugins',
        widgets: '../widgets',
        modules: '../modules'
    }
});

requirejs(['dcms-ajax'], function(DA) {

	DA.on('initiated', function(callback) {
		console.log('DA.initiated');
		
		callback();
	});
	
	DA.on('loaded', function(callback) {
		console.log('DA.loaded');
		
		callback();
	});
	
//	DA.registry.set('plugins.auth', {
//		uri: '/admin/login',
//		idle: 600 * 1000
//	});
	
	DA.registry.set('plugins.layout');
	
	DA.registry.push('modules', 'pages');
	
	DA.bootstrap();
});
