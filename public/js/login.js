document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = document.getElementById('loginBtn');
    const errEl = document.getElementById('errorMsg');
    btn.classList.add('loading');
    btn.textContent = '...';
    errEl.classList.remove('show');
    try {
        const res = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                username: document.getElementById('username').value.trim(),
                password: document.getElementById('password').value.trim()
            })
        });
        const data = await res.json();
        if (data.success) {
            window.location.href = '/';
        } else {
            errEl.textContent = 'اسم المستخدم أو كلمة المرور غير صحيحة!';
            errEl.classList.add('show');
        }
    } catch (err) {
        errEl.textContent = 'خطأ في الاتصال بالخادم';
        errEl.classList.add('show');
    }
    btn.classList.remove('loading');
    btn.textContent = 'دخول';
});

// Check if already logged in
fetch('/api/auth/me').then(r => r.json()).then(d => {
    if (d.user) window.location.href = '/';
}).catch(() => { });

// Load Theme
fetch('/api/settings').then(r => r.json()).then(s => {
    if (s.theme) document.documentElement.setAttribute('data-theme', s.theme);
}).catch(() => { });
