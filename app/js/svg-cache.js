// //кэширование SVG
;( function(window, document) {
  'use strict';
  // при обновлении svg-спрайта, нужно обновить номер ревизии
  var file     = '/img/sprite.svg',
      revision = 0.1;

  if (!document.createElementNS || !document.createElementNS('http://www.w3.org/2000/svg', 'svg').createSVGRect) {
    return true;
  }

  var isLocalStorage = 'localStorage' in window && window['localStorage'] !== null,
      request,
      data,
      insertIT       = function() {
        document.body.insertAdjacentHTML('afterbegin', data);
      },
      insert         = function() {
        if (document.body) {
          insertIT();s
        } else {
          document.addEventListener('DOMContentLoaded', insertIT);
        }
      };

  if (isLocalStorage && localStorage.getItem('inlineSVGrev') == revision) {
    data = localStorage.getItem('inlineSVGdata');
    if (data) {
      insert();
      return true;
    }
  }

  try {
    request = new XMLHttpRequest();
    request.open('GET', file, true);
    request.onload = function() {
      if (request.status >= 200 && request.status < 400) {
        data = request.responseText;
        insert();
        if (isLocalStorage) {
          localStorage.setItem('inlineSVGdata', data);
          localStorage.setItem('inlineSVGrev', revision);
        }
      }
    }
    request.send();
  }
  catch (e) {
  }

}(window, document) );
