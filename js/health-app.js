/* New RequireJS configuration File */

requirejs.config({
	appUrl  : "../",
	baseUrl : "./js/app",
	paths   : {
		vendor : "./../vendor",
		views  : "./../../templates"
	},
	shim: {
		'vendor/mustache.min' : {
			exports : 'Mustache'
		}
	}
});

requirejs(['main']);