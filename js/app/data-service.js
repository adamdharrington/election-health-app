define(['twitter', 'fallback'],function(tw, fallback){
	var $ = window.jQuery;
	var constituencies, candidateResponses, candidates,
			_fallbackCandidates = fallback.candidates,
	    candidateFixes = {
        "carlow-kilkenny_conor-macliam": {
          "type": "edit",
          "values": {
            "party": {
              "id": 24,
              "slug": "anti-austerity-alliance",
              "name": "Anti Austerity Alliance",
              "path": "/parties/anti-austerity-alliance"
            }
          }
        },
        "dublin-south-central_máire-devine":{
          "type" : "edit",
          "values": {
            "cid" : "dublin-south-central_maire-devine"
          }
        },
        "dublin-south-central_bríd-smith":{
          "type" : "edit",
          "values": {
            "cid" : "dublin-south-central_brid-smith"
          }
        }
      };
	function DataService(variable, url, filter, fallback){
		var _url, _filter;
		_url = url || null;
		_filter = filter || null;
		return function(callback){	
		  if(variable) callback(variable);
		  else{
			  $.ajax({
				  method : 'get',
				  url : _url,
				  dataType: 'json'
			  }).done(function(response){
				  var _response = response;
				  if(filter) _response = _filter(response);
				  variable = _response;
				  callback(variable);
			  }).fail(function(){
					var _response;
					if(filter) _response = _filter(fallback());
					variable = _response;
					callback(variable);
				});
		  }
		}
	}
  /*var getConstituencies = new DataService(constituencies
	,  "///irish-elections.storyful.com/constituencies.json"
	, function(data){
		// expect a constituency object, return as array
		if(data.hasOwnProperty('constituencies')){
			return data.constituencies;
		}
		// But always return an array
		return [];
	}
  );*/
  var getConstituencies = function(callback){
	  var response = {"constituencies": fallback.constituencies()},
	  filter = function(array){
		  var i, _constituencies = {};
		  for (i=0; i<array.length; i+=1){
			  _constituencies[array[i].slug] = array[i];
		  }
		  constituencies = _constituencies;
		  return _constituencies;
	  };
	  callback(filter(response.constituencies));
	  
    },
    doFixes = function(candidate){
      var fixes = candidateFixes[candidate.cid];
      if (fixes.type === "edit"){
        for (var fix in fixes.values){
          if (fixes.values.hasOwnProperty(fix)){
            candidate[fix] = fixes.values[fix];
          }
        }
      }
      return candidate;
    },
    getCandidates = new DataService(candidates
			,"//irish-elections.storyful.com/candidates.json"
			,function(array){
		  	var i, co,ca, _constituencies = {},
					makeId = function(cand){
						return cand.constituency.slug +"_" + sanitise(cand.first_name)+ "-" + sanitise(cand.last_name);
					},
					sanitise = function(str){
						return str.split(/[\.\-\?=,!@#$%^&*():;\/\\|<>"'’\s]+/).join("").toLowerCase();
					};
        if (array.hasOwnProperty('candidates')) array = array.candidates;
				for (i=0; i<array.length; i+=1){
					if(!array[i].constituency) continue;
					if(array[i].twitter_url !== null) array[i]['tweet'] = tw.makeTweet(array[i].twitter_url);
					co = array[i].constituency.slug;
					array[i].cid = makeId(array[i]);
          if (candidateFixes.hasOwnProperty(array[i].cid)) array[i] = doFixes(array[i]);
					if (_constituencies[co])_constituencies[co].push(array[i]);
					else _constituencies[co] = [array[i]];
				}
		  	candidates = _constituencies;
				return _constituencies;
	  	}
			,_fallbackCandidates);

  var formatCandidateResponses = function(data){
		// Try return responses in format expected
		var returnObj = {};
		if(data && data.hasOwnProperty('feed') && data.feed.hasOwnProperty('entry')){
			var entries = data.feed.entry, len = entries.length;
			var can;
			for (var i = 0; i<len;i+=1){
				can = {};
				if (entries[i].gsx$optionaladdacomment['$t'] !== "") can['comment'] = entries[i].gsx$optionaladdacomment['$t'];
				if (entries[i].gsx$candidateid['$t'] !== "") can['cid'] = entries[i].gsx$candidateid['$t'];
				if (entries[i].gsx$candidatename['$t'] !== "") can['name'] = entries[i].gsx$candidatename['$t'];
				if (entries[i].gsx$doyousupportthecontentsofthepeopleshealthcarecharter['$t'] !== "")
					can['support'] = entries[i].gsx$doyousupportthecontentsofthepeopleshealthcarecharter['$t'];

				if (can.cid) returnObj[can['cid']] = can;

			}
		}
		candidateResponses = returnObj;
		// But always return an object literal
		return returnObj;
	};
  var getResponses = new DataService(candidateResponses
	,  "https://spreadsheets.google.com/feeds/list/" 
	+"1Ou6L7Yp8vE-WWCTog47548o_MpqouSIwwZkHNuXxx68"
	+"/o1vbyfb/public/values?alt=json"
	, formatCandidateResponses
  );

  function gotResponses(data){
	  console.log(candidateResponses);
  }
	function addSupport(constituency){
		var chunked = [
			{ position: 'for',
				description: 'Candidates who support the charter',
				hasCandidates: false,
				candidates:	[]
			},
			{ position: 'unknown',
				description: 'Candidates who haven\'t responded yet',
				hasCandidates: false,
				candidates:	[]
			},
			{ position: 'against',
				description: 'Candidates who do not support the health charter',
				hasCandidates: false,
				candidates:	[]
			}
		], addCand = function(int, cand){
			chunked[int].candidates.push(cand);
			chunked[int].hasCandidates = true;
		};
		for(var i=0; i< candidates[constituency].length; i++){
			var sl = candidates[constituency][i].cid || null;
			if (candidateResponses && candidateResponses.hasOwnProperty(sl)){
				candidates[constituency][i]['healthResponse'] = candidateResponses[sl];
			}
		}
		candidates[constituency].sort(function sortByName(a, b){
			var textA = (a.last_name +" "+ a.first_name).toUpperCase();
			var textB = (b.last_name +" "+ b.first_name).toUpperCase();
			return textA.localeCompare(textB);
		}).map(function sortBySupport(a){
			if (a.hasOwnProperty('healthResponse')){
				a.healthResponse.support === "Yes"
						? addCand(0, a)
						: addCand(2, a);
			}
			else{
				addCand(1, a);
			}
		});
		return chunked;
	}

  
  return {
	  constituencies : getConstituencies,
	  responses: getResponses,
	  candidates: getCandidates,
		addSupport: addSupport
  }
});