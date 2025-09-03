export async function getData(titleSpare = null, is_popular = null, count = 10, offset = 0) {
    const url = new URL('/api/truck/get-spares', window.location.origin);
    // Добавляем параметры, если они есть
    url.searchParams.set('count', count);
    url.searchParams.set('offset', offset);

    if (titleSpare !== null && titleSpare !== '') {
        url.searchParams.set('title', titleSpare);
    } else {
        url.searchParams.delete('title');
    }

    if (is_popular !== null && is_popular !== '' && is_popular !== 'null') {
        url.searchParams.set('is_popular', is_popular);
    } else {
        url.searchParams.delete('is_popular');
    }

    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`Ошибка HTTP: ${response.status}`);
    }

    return await response.json();
};