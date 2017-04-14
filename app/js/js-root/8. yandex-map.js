// Инициализация яндекс-кар

(function(){
  ymaps.ready(init);
  var myMap;
  var myPlacemark;

  function init(){
    myMap = new ymaps.Map("map", {
      center: [53.198397, 44.993864],
      zoom: 17,
      controls: ['zoomControl', 'typeSelector',  'fullscreenControl']
    });

    myPlacemark = new ymaps.Placemark([53.198397, 44.993864], {
      hintContent: 'Ветеринарная клиника "на Пушкина"',
      balloonContent: 'Ветеринарная клиника "на Пушкина"'
    });

    myMap.geoObjects.add(myPlacemark);
  }
})();