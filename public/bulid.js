({
    baseUrl: './',
	locale: "en-us",
	optimize: "uglify2",
    paths: {
		i18n: 'static/js/i18n',
		jquery: 'http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min'
    },
    name: 'core/index',
    out: 'bin/dcms-ajax.js'
})