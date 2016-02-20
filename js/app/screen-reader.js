/**
 * Created by Adam on 20/02/2016.
 */
define([],function(){
  var $ = window.jQuery,
    $map = $('.map'),
    $constituencySelect;
  $map.before('<select class="visually-hidden select-constituency" />');
  $constituencySelect = $('.select-constituency');
  function init(constituencies){
    var opts = [];
    for (var opt in constituencies){
      if (constituencies.hasOwnProperty(opt) && constituencies[opt].hasOwnProperty('slug')){
        opts.push('<option value="'+constituencies[opt].slug+'">'+constituencies[opt].name+'</option>');
      }
    }
    opts = opts.sort(function(a,b){
      if (a == b) return 0;
      else if(a>b) return 1;
      else return -1;
    });
    $constituencySelect.html(opts.join('')).on('change', function(e){
      $map.find('path#'+this.value).trigger('click');
    });
  }


  return {
    init : init
  };
});