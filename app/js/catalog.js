// Каталог

// см. делаем кликабельным картинку и title, см. _catalog.scss
(function($) {
  $(document).ready(function() {
    // По клику на элемент перейти на страницу, адрес которой находится в кнопке
    $('.js-item-click').on('click', function() {
      location.assign($(this).siblings('.js-item-link').attr('href'));
    });
  });
})(jQuery);