define([],
		function () {
			var $ = window.jQuery;
			var safeGet = function($elem, callback){
				$.get($elem.data('src')).success(function(){
					callback($elem, $elem.data('src'));
				})
			};
		return {
			get: function(elem){
				var $elem = $(elem);
				if ($elem.data('src')) safeGet($elem, function(target, img){
					target.context.src = img;
				});
			}
		}
});