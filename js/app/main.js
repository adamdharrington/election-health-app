define(['jquery', 'vendor/mustache.min','text!views/irish_constituencies.html'],
		function ($,Mustache, svg) {
	
	(function(){
		$('#health-app').find('.map').html(Mustache.render(svg));
	})();

	require(['map'],function(m){
		
	});
});