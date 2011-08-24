$(document).bind("mobileinit", function(){
  //apply overrides here
  $.extend(  $.mobile,
    {
      //ajaxEnabled: false,   //for jqm b1
      loadingMessage: "Syncing..."
    }
  );
  $.mobile.page.prototype.options.addBackBtn = true;
});

