document.querySelectorAll('.category-card').forEach(card => {
    card.addEventListener('click', () => {
        const category = card.dataset.category; // например data-category="турбина"
        window.location.href = `catalog-list.html?titleSpare=${encodeURIComponent(category)}`;
    });
});