// Навигационное меню в шапке сайта
(function($) {
  $(document).ready(function() {

    const BREAKPOINT = 1200;
    let navButton    = $('#nav-button-js');
    let navList      = $('#nav-list-js');
    let navSubList   = $('.nav-sublist-js');
    let caret        = $('.caret'); // Стрелки у выпадающего меню

    //navList.find('li ul').parent().addClass('has-sub');

    navButton.on('click', function() {
      $(this).toggleClass('opened');
      navList.toggle(500);
    });

    navList.find('has-sub').on('click', function() {
      $(this).toggleClass('opened');
    });

    caret.click(function(e) {

      /*
       if ($( window ).width() > 1025) {
       cssmenu.find('ul').show();
       }
       */
      if ($(window).width() < BREAKPOINT) {
        e.preventDefault();
      }

      $(this)
          .parents('.has-sub')
          .toggleClass('opened')
          .find('.nav-sublist-js')
          .slideToggle();
      //navSubList.toggle(500);

    });

  });
})(jQuery);