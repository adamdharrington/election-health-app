/**
 * Created by Adam on 24/02/2016.
 */
define([],function () {
  var
    readQuery = function () {
      var query = {};
      if (history.pushState) {
        var q;
        location.href.indexOf('?') ? q = location.href.split('?')[1] : q = "";
        if (q) {
          var pairs = q.split('&');
          for (var i = 0; i < pairs.length; i++) {
            var a = pairs[i].split('=');
            query[a[0]] = a[1];
          }
        }
      } else {
        var hash = location.hash.slice(1).split("=");
        if (hash.length == 2) {
          query[hash[0]] = hash[1]
        }
      }
      return query;
    },
    pushHistory = function (item, value) {
      if (history.pushState) {
        var newurl = window.location.protocol + "//" + window.location.host + window.location.pathname + '?' + item + '=' + value;
        window.history.pushState({
          path: newurl
        }, '', newurl);
      } else {
        location.hash = item + "=" + value;
      }
    },
    clearQuery = function () {
      if (history.pushState) {
        var newurl = window.location.protocol + "//" + window.location.host + window.location.pathname;
        window.history.pushState({
          path: newurl
        }, '', newurl);
      } else {
        location.hash = "";
      }
    };

  return {
    readQuery: readQuery,
    pushQuery: pushHistory,
    clearQuery: clearQuery
  };
});