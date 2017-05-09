// Отзывы
(function($){
  $(document).ready(function(){
    // var reviewText = $('.review-text-js');
    var reviewLink = $('.review-link-js');

    reviewLink.on('click', function(e){
      e.preventDefault();

      $(this).toggleClass('review__link--up');
      $(this).siblings('.review-text-js').toggleClass('closed');
    })
  });
})(jQuery);
