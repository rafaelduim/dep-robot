var widthWindow = $(window).width(),
    body = $('body'),
    $toastlast = null,
    $toast = '';
var scripts = {
    Init: function() {
        console.log('Start');
        
    },
}

$(window).on('load', function() {
    scripts.Init();
    // $('body .page').scroll(navSlide);
});
