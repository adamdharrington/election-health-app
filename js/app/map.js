define(['data-service', 'jquery', 'vendor/mustache.min', 'text!views/candidates.mustache'],function(data, $, Mustache, template){
	var constituencyCandidates;
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
	data.responses(function(d){console.log('candidates',d)});
	data.candidates(function(d){constituencyCandidates = d});
	
	$('svg').on('click','path',function(){
		var _constituency = this.id;
		console.log(constituencyCandidates[_constituency]);
		$('#health-app').find('.candidates').html(
			Mustache.render(template, {candidates: constituencyCandidates[_constituency]})
		);
	})
});