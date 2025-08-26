import {
    getData
} from './fetch_data.js';

const modalWindow = document.getElementById('modal-product-detail');
const actualCardsList = document.querySelectorAll('.card');

async function fillActualSection() {
    const body = await getData(null, true);
    console.log(body);
    for (let i = 0; i < body.length; i++) {

        if (i > 2) {
            break;
        };

        const card = actualCardsList[i];
        const product = body[i];

        card.querySelector('.card-img img').src = `http://127.0.0.1:8000${product.photo}`;
        card.querySelector('.card-title').textContent = product.title;
        card.querySelector('.card-price').textContent = `${product.price} сом`;
        
        card.addEventListener('click', () => {
            const imgModal = modalWindow.querySelector('.product-detail-img img');
            const titleModal = modalWindow.querySelector('.product-detail-content h3');
            const priceModal = modalWindow.querySelector('.price');
            const inStockModal = modalWindow.querySelector('.in-stock');

            imgModal.src = `http://127.0.0.1:8000${product.photo}`;
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
    };
};

document.addEventListener('DOMContentLoaded', async () => {
    await fillActualSection();

    const closeBtn = modalWindow.querySelector('.ic-close-window');
    closeBtn.addEventListener('click', () => {
        modalWindow.style.display = 'none';
    });

});