// Фильтр в разделе 'Портфолио';
(function($) {
  $(document).ready(function() {
    var filter        = $('.filter-js');
    var filterWrapper = $('.filter-wrapper-js');

    filter.on('click', function() {
      $(this).toggleClass('opened');
      filterWrapper.toggle(500);
    })
  });
})(jQuery);
