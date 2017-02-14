// magnific-popup https://github.com/dimsemenov/Magnific-Popup

(function($) {
  $(document).ready(function() {
    let magnificPopup = $.magnificPopup.instance; // save instance in magnificPopup variable

    // инициализация
    $('.js-popup').magnificPopup({
      type          : 'inline',
      midClick      : true,
      //closeBtnInside: true
    });

    // кнопка закрыть
    $('.js-popup-submit').on('click', function() {
      magnificPopup.close();
    });
  });
})(jQuery);