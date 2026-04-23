document.addEventListener('DOMContentLoaded', () => {
    const grid = document.getElementById('servicesGrid');
    const searchInput = document.getElementById('searchInput');
    const categoryNav = document.getElementById('categoryNav');
    const currentCategoryTitle = document.getElementById('currentCategoryTitle');
    const serviceCount = document.getElementById('serviceCount');
    const noResults = document.getElementById('noResults');
    const timeDisplay = document.getElementById('timeDisplay');
    const dateDisplay = document.getElementById('dateDisplay');
    const gridViewBtn = document.getElementById('gridViewBtn');
    const listViewBtn = document.getElementById('listViewBtn');
    const particles = document.getElementById('particles');

    let currentCategory = 'all';
    let currentView = 'grid';

    // ═══ Particles ═══
    function createParticles() {
        for (let i = 0; i < 20; i++) {
            const p = document.createElement('div');
            p.className = 'particle';
            p.style.left = Math.random() * 100 + '%';
            p.style.animationDuration = (6 + Math.random() * 8) + 's';
            p.style.animationDelay = (Math.random() * 10) + 's';
            p.style.width = p.style.height = (2 + Math.random() * 3) + 'px';
            particles.appendChild(p);
        }
    }
    createParticles();

    // ═══ Clock ═══
    function updateTime() {
        const now = new Date();
        const timeOpts = { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false };
        const dateOpts = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        timeDisplay.textContent = now.toLocaleTimeString('ar-SA', timeOpts);
        dateDisplay.textContent = now.toLocaleDateString('ar-SA', dateOpts);
    }
    setInterval(updateTime, 1000);
    updateTime();

    // ═══ Build Sidebar Categories ═══
    function buildCategories() {
        const catKeys = Object.keys(categoriesConfig);
        catKeys.forEach(key => {
            const cat = categoriesConfig[key];
            const count = key === 'all' ? servicesData.length : servicesData.filter(s => s.category === key).length;
            const btn = document.createElement('button');
            btn.className = 'cat-btn' + (key === 'all' ? ' active' : '');
            btn.dataset.cat = key;
            btn.innerHTML = `
                <i class="${cat.icon}" style="color: ${cat.color}"></i>
                <span>${cat.titleAr}</span>
                <span class="cat-count">${count}</span>
            `;
            btn.addEventListener('click', () => {
                document.querySelectorAll('.cat-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                currentCategory = key;
                currentCategoryTitle.textContent = cat.titleAr;
                searchInput.value = '';
                renderServices();
            });
            categoryNav.appendChild(btn);
        });
    }
    buildCategories();

    // ═══ Render Services ═══
    function renderServices(searchTerm = '') {
        grid.innerHTML = '';
        let filtered = servicesData;

        if (currentCategory !== 'all') {
            filtered = filtered.filter(s => s.category === currentCategory);
        }

        if (searchTerm) {
            const term = searchTerm.toLowerCase();
            filtered = filtered.filter(s =>
                s.titleEn.toLowerCase().includes(term) ||
                s.titleAr.includes(term) ||
                (s.descAr && s.descAr.includes(term))
            );
        }

        // Update count
        const countEl = serviceCount.querySelector('span') || serviceCount;
        serviceCount.innerHTML = `<i class="ri-function-line"></i><span>${filtered.length}</span> خدمة`;

        if (filtered.length === 0) {
            noResults.classList.remove('hidden');
            return;
        }
        noResults.classList.add('hidden');

        filtered.forEach((service, i) => {
            const catConfig = categoriesConfig[service.category] || {};
            const card = document.createElement('a');
            card.href = service.url || '#';
            card.target = service.url && service.url.startsWith('http') ? '_blank' : '_self';
            card.rel = 'noopener noreferrer';
            card.className = 'service-card';
            card.style.animationDelay = `${i * 0.04}s`;
            card.style.setProperty('--card-accent', catConfig.color || '#00d4ff');

            card.innerHTML = `
                <div class="card-icon-wrap ${service.category}">
                    <i class="${service.icon}"></i>
                </div>
                <div class="card-body">
                    <h3>${service.titleAr}</h3>
                    <div class="card-en">${service.titleEn}</div>
                    <div class="card-desc">${service.descAr || ''}</div>
                </div>
                <div class="card-status" title="نشط"></div>
                <div class="card-arrow"><i class="ri-arrow-left-line"></i></div>
            `;
            grid.appendChild(card);
        });
    }

    // ═══ Search ═══
    searchInput.addEventListener('input', (e) => renderServices(e.target.value));

    // Ctrl+K shortcut
    document.addEventListener('keydown', (e) => {
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            searchInput.focus();
        }
        if (e.key === 'Escape') searchInput.blur();
    });

    // ═══ View Toggle ═══
    gridViewBtn.addEventListener('click', () => {
        currentView = 'grid';
        grid.classList.remove('list-view');
        gridViewBtn.classList.add('active');
        listViewBtn.classList.remove('active');
    });
    listViewBtn.addEventListener('click', () => {
        currentView = 'list';
        grid.classList.add('list-view');
        listViewBtn.classList.add('active');
        gridViewBtn.classList.remove('active');
    });

    // ═══ Initial Render ═══
    renderServices();
});
