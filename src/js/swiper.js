// слайдер в карточке продукта

(function($){
  $(document).ready(function(){
    var mainSlider = new Swiper('.ms-c-js', {
        pagination: '.ms-pag-js',
        nextButton: '.ms-next-js',
        prevButton: '.ms-prev-js',
        slidesPerView: 1,
        grabCursor: true,
        // simulateTouch: false,
        // autoplay: 5000,
        paginationClickable: true,
        paginationType: 'bullets',
        spaceBetween: 0,
        keyboardControl: false,
        loop: true
    });

    var productSlider = new Swiper('.ps-c-js', {
        // pagination: '.ms-pag-js',
        nextButton: '.ps-next-js',
        prevButton: '.ps-prev-js',
        slidesPerView: 5,
        // grabCursor: false,
        // simulateTouch: false,
        // autoplay: 5000,
        // paginationClickable: true,
        // paginationType: 'bullets',
        spaceBetween: 17,
        keyboardControl: false,
        loop: true,
        breakpoints: {
          1200: {
            spaceBetween: 18,
            slidesPerView: 4
          },
          991: {
            spaceBetween: 20,
            slidesPerView: 3
          },
          767: {
            spaceBetween: 15,
            slidesPerView: 2
          },
          543: {
            spaceBetween: 0,
            slidesPerView: 1
          }
        }
    });

    var subcatalogSlider = new Swiper('.scs-c-js', {
        // pagination: '.ms-pag-js',
        nextButton: '.scs-next-js',
        prevButton: '.scs-prev-js',
        slidesPerView: 4,
        // grabCursor: false,
        // simulateTouch: false,
        // autoplay: 5000,
        // paginationClickable: true,
        // paginationType: 'bullets',
        spaceBetween: 0,
        keyboardControl: false,
        loop: true,
        breakpoints: {
          992: {
            slidesPerView: 3
          },
          768: {
            slidesPerView: 2
          },
          544: {
            slidesPerView: 1
          }
        }
    });

    var mainSlider = new Swiper('.ns-c-js', {
        // pagination: '.ms-pag-js',
        nextButton: '.ns-next-js',
        prevButton: '.ns-prev-js',
        slidesPerView: 1,
        grabCursor: true,
        // simulateTouch: false,
        // autoplay: 5000,
        paginationClickable: true,
        paginationType: 'bullets',
        spaceBetween: 0,
        keyboardControl: false,
        loop: true
    });

    var articlesSlider = new Swiper('.ars-c-js', {
        // pagination: '.ms-pag-js',
        nextButton: '.ars-next-js',
        prevButton: '.ars-prev-js',
        slidesPerView: 4,
        // grabCursor: false,
        // simulateTouch: false,
        // autoplay: 5000,
        // paginationClickable: true,
        // paginationType: 'bullets',
        spaceBetween: 30,
        keyboardControl: false,
        loop: true,
        breakpoints: {
          992: {
            spaceBetween: 30,
            slidesPerView: 3
          },
          768: {
            spaceBetween: 30,
            slidesPerView: 2
          },
          544: {
            spaceBetween: 0,
            slidesPerView: 1
          }
        }
    });


  });

})(jQuery);


