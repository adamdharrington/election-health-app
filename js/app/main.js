define(['vendor/mustache.min','text!views/irish_constituencies.html', 'map'],
		function (Mustache, svg, map) {
	var $ = window.jQuery;
	$(function($) {
		(function () {
			$('#health-app').find('.map').html(Mustache.render(svg));
			map.init();
		})();
	});

});