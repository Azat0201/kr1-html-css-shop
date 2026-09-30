(() => {
    const productSection = document.getElementById('product-section');
    if (!productSection) return;

    const cards = Array.from(productSection.querySelectorAll('.product-card'));
    const searchInput = document.getElementById('filter-search');
    const categoryCheckboxes = document.querySelectorAll('input[name="category"]');
    const priceMinInput = document.getElementById('price-min');
    const priceMaxInput = document.getElementById('price-max');
    const sortSelect = document.getElementById('filter-sort');
    const resetButton = document.getElementById('filters-reset');
    const countEl = document.getElementById('catalog-count');
    const emptyEl = document.getElementById('catalog-empty');

    // Применить все фильтры
    function applyFilters() {
        const searchValue = (searchInput?.value || '').trim().toLowerCase();
        const minPrice = priceMinInput?.value ? Number(priceMinInput.value) : null;
        const maxPrice = priceMaxInput?.value ? Number(priceMaxInput.value) : null;

        const activeCategories = Array.from(categoryCheckboxes)
            .filter((cb) => cb.checked)
            .map((cb) => cb.value);

        let visibleCount = 0;

        cards.forEach((card) => {
            const name = (card.dataset.name || '').toLowerCase();
            const price = Number(card.dataset.price || 0);
            const category = card.dataset.category || '';

            const matchesSearch = !searchValue || name.includes(searchValue);
            const matchesCategory = activeCategories.length === 0 || activeCategories.includes(category);
            const matchesMin = minPrice === null || price >= minPrice;
            const matchesMax = maxPrice === null || price <= maxPrice;

            const isVisible = matchesSearch && matchesCategory && matchesMin && matchesMax;
            card.hidden = !isVisible;
            if (isVisible) visibleCount++;
        });

        if (countEl) countEl.textContent = `Найдено товаров: ${visibleCount}`;
        if (emptyEl) emptyEl.hidden = visibleCount !== 0;
    }

    // Сортировка карточек
    function applySort() {
        const sortValue = sortSelect?.value || 'default';
        if (sortValue === 'default') return;

        const sorted = [...cards].sort((a, b) => {
            const priceA = Number(a.dataset.price || 0);
            const priceB = Number(b.dataset.price || 0);
            const nameA = (a.dataset.name || '').toLowerCase();
            const nameB = (b.dataset.name || '').toLowerCase();

            switch (sortValue) {
                case 'price-asc':  return priceA - priceB;
                case 'price-desc': return priceB - priceA;
                case 'name-asc':   return nameA.localeCompare(nameB, 'ru');
                case 'name-desc':  return nameB.localeCompare(nameA, 'ru');
                default:           return 0;
            }
        });

        sorted.forEach((card) => productSection.appendChild(card));
    }

    // Сброс всех фильтров
    function resetFilters() {
        if (searchInput) searchInput.value = '';
        if (priceMinInput) priceMinInput.value = '';
        if (priceMaxInput) priceMaxInput.value = '';
        if (sortSelect) sortSelect.value = 'default';
        categoryCheckboxes.forEach((cb) => (cb.checked = true));
        applyFilters();
        applySort();
    }

    // Навешиваем обработчики
    searchInput?.addEventListener('input', applyFilters);
    categoryCheckboxes.forEach((cb) => cb.addEventListener('change', applyFilters));
    priceMinInput?.addEventListener('input', applyFilters);
    priceMaxInput?.addEventListener('input', applyFilters);
    sortSelect?.addEventListener('change', applySort);
    resetButton?.addEventListener('click', resetFilters);

    // Инициализация
    applyFilters();
})();