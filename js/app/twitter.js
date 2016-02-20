/**
 * Created by Adam on 20/02/2016.
 */
define([], function(){
  var page = encodeURIComponent(location.href),
    twitterMessages = ['are you supporting the People\'s Health Charter?',
      'I\'m voting for #Health in #GE16, have you supported the People\'s Health Charter',
      'if you want votes #GE16, show you support universal #Health'],
    intent = "http://twitter.com/intent/tweet?status=";
  function getTweet(uName){
    var message = (function(){
      return twitterMessages[Math.floor(Math.random() * twitterMessages.length)];
    })();
    return intent
      + encodeURIComponent(uName + " ")
      + encodeURIComponent(message + " ")
      + page;
  }
  function makeTweet(url){
    if (url == undefined) return null;
    var user = "@" + url.substring(url.lastIndexOf('/')+1,url.length);
    user = user.split(/[\?#&]/)[0];
    if (user.length < 4) return null;
    return getTweet(user);
  }

  return{
    makeTweet: makeTweet
  }
});