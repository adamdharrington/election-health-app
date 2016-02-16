/* New RequireJS configuration File */

requirejs.config({
	appUrl  : "../",
	baseUrl : "./js/app",
	paths   : {
		vendor : "./../vendor",
		jquery : "empty:",
		views  : "./../../templates"
	},
	shim: {
		'jquery' : {
			exports: '$'
		},
		'vendor/mustache.min' : {
			exports : 'Mustache'
		}
	}
});

requirejs(['main']);