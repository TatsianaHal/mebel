// Инициализация скрипта галереи lightbox на странице логотипы
// http://osvaldas.info/image-lightbox-responsive-touch-friendly
(function($) {
  $(document).ready(function() {
    $('a[data-imagelightbox="gallery"]').imageLightbox({
      activity: true,
      // arrows: true,                        // Стрелки
      button  : true,                        // Кнопка выключения
      // caption: true,                       // Описание из Alt
      // navigation: true,
      overlay : true,
      selector: 'a[data-imagelightbox="gallery"]'
    });
  });
})(jQuery);
