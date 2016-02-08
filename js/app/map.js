define(['data-service', 'jquery', 'safe-fetch', 'vendor/mustache.min', 'text!views/candidates.mustache'],function(data, $, safeFetch, Mustache, template){
	var constituencyCandidates, activeConstituency, responses;
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
	}
	
	data.constituencies(function(d){console.log('constituencies',d)});
	data.responses(function(d){console.log(d); responses = d});
	data.candidates(function(d){constituencyCandidates = d});
	
	$('svg').on('click','path',function(){
		var _constituency = this.id,
			$this = $(this);
		$this.parent().find('.svg--selected').attr('class', '');
		$this.attr('class', 'svg--selected');
		if(_constituency !== 'dublin') {
			console.log(constituencyCandidates[_constituency]);
			_constituency = data.addSupport(_constituency);
			$('#health-app').find('.candidates').html(
					Mustache.render(template, {
						candidates: _constituency,
						constituency: _constituency[0].constituency.name
					})
			).find("img").each(function () {
				safeFetch.get(this);
			});
		}
	});
	$('#dublin').one('click', function(){
		var d = $('#dublin-constituencies');
		d.attr('class') === 'svg--hidden' 
		  ? d.attr('class', 'svg--show') 
		  : d.attr('class', 'svg--hidden');
	});
});