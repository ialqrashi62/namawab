document.addEventListener('DOMContentLoaded', () => {
    const grid = document.getElementById('servicesGrid');
    const searchInput = document.getElementById('searchInput');
    const catBtns = document.querySelectorAll('.cat-btn');
    const currentCategoryTitle = document.getElementById('currentCategoryTitle');
    const serviceCount = document.getElementById('serviceCount');
    const timeDisplay = document.getElementById('timeDisplay');

    let currentCategory = 'all';

    // Clock Function
    function updateTime() {
        const now = new Date();
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
        timeDisplay.textContent = now.toLocaleDateString('ar-SA', options);
    }
    setInterval(updateTime, 1000);
    updateTime();

    // Render Cards
    function renderServices(searchTerm = '') {
        grid.innerHTML = '';
        
        let filtered = servicesData;

        // Filter by category
        if (currentCategory !== 'all') {
            filtered = filtered.filter(s => s.category === currentCategory);
        }

        // Filter by search term
        if (searchTerm) {
            const term = searchTerm.toLowerCase();
            filtered = filtered.filter(s => 
                s.titleEn.toLowerCase().includes(term) || 
                s.titleAr.includes(term)
            );
        }

        // Update count
        serviceCount.textContent = `${filtered.length} خدمة`;

        // Create DOM Elements
        if (filtered.length === 0) {
            grid.innerHTML = `<div class="no-results">
                <i class="ri-search-eye-line"></i>
                <p>عذراً، لم نجد أي خدمة تطابق بحثك.</p>
            </div>`;
            return;
        }

        filtered.forEach(service => {
            const card = document.createElement('a');
            card.href = '#'; // Placeholder link
            card.className = 'service-card fade-in';
            
            card.innerHTML = `
                <div class="card-icon">
                    <i class="${service.icon}"></i>
                </div>
                <div class="card-content">
                    <h3>${service.titleAr}</h3>
                    <p>${service.titleEn}</p>
                </div>
                <div class="card-arrow">
                    <i class="ri-arrow-left-line"></i>
                </div>
            `;
            grid.appendChild(card);
        });
    }

    // Search Event
    searchInput.addEventListener('input', (e) => {
        renderServices(e.target.value);
    });

    // Category Click Event
    catBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active from all
            catBtns.forEach(b => b.classList.remove('active'));
            // Add active to clicked
            btn.classList.add('active');
            
            currentCategory = btn.getAttribute('data-cat');
            currentCategoryTitle.textContent = btn.textContent.trim();
            
            // Clear search when switching categories
            searchInput.value = '';
            
            renderServices();
        });
    });

    // Initial Render
    renderServices();
});
