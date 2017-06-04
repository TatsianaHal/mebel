// Навигационное меню в шапке сайта
(function(){
  let searchForm = document.getElementById('js-header-search');

  // ставим обработчики на фазе перехвата, последний аргумент true
  searchForm.addEventListener("focus", function() {
    this.classList.add('focused');
  }, true);

  searchForm.addEventListener("blur", function() {
    this.classList.remove('focused');
  }, true);
})();