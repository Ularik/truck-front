// В результате действия данного скрипта,
// по клику на кнопку с id="catalogBtn"
// элемент с id="catalog" будет плавно,  появляться, если он скрыт
//  и скрываться, если он виден.

// Для того, чтобы этот скрипт работал корректно,
// у элемента с id="catalog" (в вашей верстке это будет див в который завернут список ссылок на раздеоы каталога)
// изначально должен быть атрибут style в котором должна быть указана нулевая высота заданная в атрибуте style="height: 0px"
// и в файле style.css должны быть свойства
//   overflow: hidden;
//   transition: height 1s;


function catalogToggle() {

  const catalogBtn = document.getElementById('catalogBtn');
  const catalog = document.getElementById('catalog');


  catalogBtn.addEventListener('click', function () {
    
    if (catalog.style.height === '0px') {
      let heightCatalogList = catalog.firstElementChild.offsetHeight;     
      catalog.style.height = heightCatalogList + 'px';
    } else {
      catalog.style.height = 0;
    }

  })

}

catalogToggle();