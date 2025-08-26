const form = document.getElementById('search-form');
form.addEventListener('submit', (e) => {
    e.preventDefault();

    const formData = new FormData(form);
    const title = formData.get("title"); // значение поля input

    window.location.href = `catalog-list.html?titleSpare=${encodeURIComponent(title)}`;
});
