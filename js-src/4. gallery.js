// Инициализация скрипта галереи lightbox на странице логотипы
// http://osvaldas.info/image-lightbox-responsive-touch-friendly
(function($) {
  $(document).ready(function() {
    $('a[data-imagelightbox="gallery"]').imageLightbox({
      activity: true,
      // arrows: true,                        // Стрелки
      button  : true,                        // Кнопка выключения
      //caption: true,                       // Описание из Alt
      // navigation: true, s
      overlay : true,
      selector: 'a[data-imagelightbox="gallery"]'
    });

    $('a[data-imagelightbox="subcatalog-2-item"]').imageLightbox({
      activity: true,
      // arrows: true,                        // Стрелки
      button  : true,                        // Кнопка выключения
      caption: true,                       // Описание из Alt
      // navigation: true,
      overlay : true,
      selector: 'a[data-imagelightbox="subcatalog-2-item"]'
    });
  });
})(jQuery);
