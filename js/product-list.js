import {
    getData
} from './fetch_data.js';

const productList = document.getElementById('product-list');
const modalWindow = document.getElementById('modal-product-detail');

// Popular select 
const select = document.getElementById('is_popular');

const closeBtn = modalWindow.querySelector('.ic-close-window');
closeBtn.addEventListener('click', () => {
    modalWindow.style.display = 'none';
});

let page = 1;
let count = 10;
let offset = count - 10;

function fillColorPage(paginationLinks, page) {
    for (const link of paginationLinks) {

        if (link.textContent === String(page)) {
            link.classList.add('active-page');
            link.classList.remove('inactive-page');
        } else {
            link.classList.remove('active-page');
            link.classList.add('inactive-page');
        }
    }
};

async function fillPage(titleSpare = null, queryFilter = null, count = 10, offset = 0) {
    try {
        console.log('Запуск заполнения страницы');
        const body = await getData(titleSpare, queryFilter, count, offset);

        const temlate = productList.firstElementChild.cloneNode(true); // true — копируем с содержимым
        productList.innerHTML = '';

        for (const product of body) {
            // Копируем его
            const clone = temlate.cloneNode(true); // true — копируем с содержимым
            clone.style.display = "grid"; // убираем скрытие

            clone.id = product.id

            const img = clone.querySelector('.product-img');
            const title = clone.querySelector('.product-title');
            const productPrice = clone.querySelector('.product-price');

            img.src = product.photo;
            title.textContent = product.title;
            productPrice.textContent = `${product.price} сом`;

            productList.appendChild(clone)

            clone.addEventListener('click', () => {
                const imgModal = modalWindow.querySelector('.product-detail-img img');
                const titleModal = modalWindow.querySelector('.product-detail-content h3');
                const priceModal = modalWindow.querySelector('.price');
                const inStockModal = modalWindow.querySelector('.in-stock');

                imgModal.src = product.photo;
                titleModal.textContent = product.title;
                priceModal.textContent = `${product.price} сом`;
                console.log(product.count);
                if (product.count < 1) {
                    inStockModal.textContent = 'Нет в наличии';
                } else {
                    inStockModal.textContent = 'В наличии';
                };

                modalWindow.style.display = 'flex';
            })
        }
    } catch (error) {
        console.error('Ошибка запроса:', error);
    }
}

document.addEventListener('DOMContentLoaded', async () => {

    // Читаем query параметры
    const params = new URLSearchParams(window.location.search);
    const titleSpare = params.get('titleSpare'); // вернёт "query параметры" или null
    let queryFilter = null;

    const url = new URL('/api/truck/get-spares-count'); // url получения кол-ва товара для заполненпя пагинации
    if (titleSpare !== null && titleSpare !== '') {
        url.searchParams.append('title', titleSpare);
    }

    // обработчик при изменении
    select.addEventListener('change', function () {
        queryFilter = select.value; // получаем выбранное значение

        if (queryFilter === "null") {
            console.log("Показать все");
            url.searchParams.delete('is_popular');
            paginationFunc();
        } else if (queryFilter === "true") {
            console.log("Показать только популярные");
            url.searchParams.set('is_popular', true);
            paginationFunc();
        };
    });

    paginationFunc();

    async function paginationFunc() {
        const paginationList = document.querySelector('.pagination-block__numb');
        paginationList.innerHTML = '';
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Ошибка HTTP: ${response.status}`);
        }

        const countSpares = await response.text()

        const totalPages = Math.ceil(countSpares / 10);

        for (let i = 1; i <= totalPages; i++) {

            const a = document.createElement('a');
            a.classList.add('pagination-block__numb__link');
            a.href = '#'
            a.textContent = i;
            paginationList.appendChild(a);

            if (i > 5) {
                break;
            };
        }

        const paginationLinks = Array.from(
            paginationList.querySelectorAll('.pagination-block__numb__link')
        );

        if (totalPages > 5) {
            paginationLinks.pop();
            paginationLinks[paginationLinks.length - 1].textContent = totalPages;
            paginationLinks[paginationLinks.length - 2].textContent = '...';
        }
        fillColorPage(paginationLinks, 1); // красим первую ссылку страницы

        for (let linkId = 0; linkId < paginationLinks.length; linkId++) {

            if (paginationLinks[linkId].textContent === '...') { // ссылка с многоточием
                paginationLinks[linkId].style.pointerEvents = "none";
                continue;
            }

            paginationLinks[linkId].addEventListener('click', (e) => {
                e.preventDefault();
                count = (Number(linkId) + 1) * 10;
                offset = count - 10;
                page = linkId + 1;
                fillColorPage(paginationLinks, page);
                fillPage(titleSpare, queryFilter, count, offset);
            });
        };

        fillPage(titleSpare, queryFilter, count, offset)

        // обработчики кнопок вперед назад
        const btnLeft = document.querySelector('.btn-left');
        const btnRight = document.querySelector('.btn-right');

        btnLeft.addEventListener('click', () => {
            if (count === 10) {
                return;
            }
            count -= 10;
            offset = count - 10;
            page -= 1;
            fillColorPage(paginationLinks, page);
            fillPage(titleSpare, queryFilter, count, offset);
        });
        btnRight.addEventListener('click', () => {
            if (page === totalPages) {
                return;
            }
            count += 10;
            offset = count - 10;
            page += 1;
            fillColorPage(paginationLinks, page);
            fillPage(titleSpare, queryFilter, count, offset);
        })
    };
});