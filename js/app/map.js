define(['data-service', 'jquery', 'safe-fetch', 'vendor/mustache.min', 'text!views/candidates.mustache'],
		function(data, $, safeFetch, Mustache, template){
	var constituencyCandidates, constituencies, activeConstituency, responses;
	Array.prototype.findByName = function(name){
		if(!this.length)return null;
		return this.filter(function(o){
			return (o.hasOwnProperty('slug') && o.slug === name)
		});
	};
	
	Array.prototype.extractByKey = function(key){
		var vals = this.map(function(o){
			if(o.hasOwnProperty(key)) return o[key];
			return null;
		});
		return vals.filter(function(i){return i !== null;});
	};


	function initiate() {
		data.constituencies(function (d) {
			window.constituencies = constituencies = d;
		});
		data.responses(function (d) {
			responses = d;
		});
		data.candidates(function (d) {
			constituencyCandidates = d;
		});

		$('svg').on('click', 'path', function () {
			var _constituency = this.id,
					constituencyName,
					$this = $(this);
			$this.parent().find('.svg--selected').attr('class', '');
			$this.attr('class', 'svg--selected');
			if (_constituency !== 'dublin') {
				constituencyName = constituencies[_constituency].name;
				_constituency = data.addSupport(_constituency);
				var candiDiv = $('#health-app').find('.candidates');
				candiDiv.html(
						Mustache.render(template, {
							candidateGroups: _constituency,
							constituency: constituencyName
						})
				).find("img").each(function () {
					safeFetch.get(this);
				});
				$('html, body').animate({
					scrollTop: candiDiv.offset().top - 50
				},600);
			}
		}).on('mouseover', 'path', function(e){
			var _constituency = this.id,
					constituencyName,
					$tip = $('.county-name');
			if (_constituency !== 'dublin') {
				constituencyName = constituencies[_constituency].name;
			}
			else constituencyName = "Dublin";
			$tip.text(constituencyName)
					.addClass('show');

			e.currentTarget.onmousemove = function (e) {
				var x = (e.clientX + 20) + 'px',
						y = (e.clientY + 20) + 'px';
				$tip.css({
					top : y,
					left : x
				});
			};
		}).on('mouseout', function(){
			$('.county-name').removeClass('show');
		}).after('<div class="county-name"></div>');



		$('#dublin').one('click', function () {
			var d = $('#dublin-constituencies');
			d.attr('class') === 'svg--hidden'
					? d.attr('class', 'svg--show')
					: d.attr('class', 'svg--hidden');
		});

	}
	return{
		init: initiate
	}
});