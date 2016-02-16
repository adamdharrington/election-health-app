define([],function(){
	var constituencies = [{name:'dublin'},{name:'leitrim'}], candidateResponses;
  function getConstituencies(callback){
	  if(constituencies) callback(constituencies);
	  
	  
  }
  function getResponses(callback){
	  if(candidateResponses) callback(candidateResponses);
	  else{
		  $.ajax({
			  method : 'get',
			  url : 'https://spreadsheets.google.com/feeds/list/1Ou6L7Yp8vE-WWCTog47548o_MpqouSIwwZkHNuXxx68/o1vbyfb/public/values?alt=json'
		  }).done(function(response){
			  if(response.hasOwnProperty('feed')){
				  candidateResponses = response.feed.entry;
				  callback(candidateResponses);
			  }
		  });
	  }
  }
  function gotResponses(data){
	  console.log(candidateResponses);
  }
  
  return {
	  constituencies : getConstituencies,
	  responses: getResponses
  }
});