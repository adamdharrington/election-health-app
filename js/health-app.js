/* New RequireJS configuration File */

requirejs.config({
	appUrl  : "../",
	baseUrl : "./js/app",
	paths   : {
		vendor : "./../vendor",
		jquery : "./../vendor/jquery-1.10.2.min",
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