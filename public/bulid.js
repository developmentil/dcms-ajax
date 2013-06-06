({
    baseUrl: './',
//	locale: "he-IL",
	optimize: "uglify2",
    paths: {
		i18n: 'libs/require/i18n',
		jquery: 'http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min',
		'dcms-ajax': 'core/index'
    },
    name: 'dcms-ajax',
    out: 'bin/dcms-ajax.js'
})