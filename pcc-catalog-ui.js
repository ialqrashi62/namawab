// PCC Catalog UI - Auto-discovers all 789 PCC modules and renders a search-able grid.
// Calls real /api/v1/pcc-{module}/list and /api/v1/pcc-{module}/call/{fn} endpoints.
// No hardcoded module names — the catalog is live from the server.
(function () {
    "use strict";
    var API_BASE = "/api/v1";
    var CATALOG_URL = API_BASE + "/pcc-catalog/modules";
    var CACHE_TTL_MS = 5 * 60 * 1000; // 5 min cache
    var cache = { ts: 0, modules: [], meta: {} };

    function $(id) { return document.getElementById(id); }
    function escapeHTML(s) {
        if (s == null) return "";
        return String(s).replace(/[&<>"'\/]/g, function (c) {
            return ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "\"": "&quot;", "'": "&#39;", "/": "&#x2F;" })[c];
        });
    }

    function fetchCatalog() {
        return fetch(CATALOG_URL, { credentials: "same-origin" })
            .then(function (r) {
                if (!r.ok) throw new Error("HTTP " + r.status);
                return r.json();
            })
            .then(function (data) {
                cache.ts = Date.now();
                cache.modules = data.modules || [];
                cache.meta = { version: data.version, count: data.count };
                return cache;
            });
    }

    function fetchModuleMeta(moduleName) {
        var url = API_BASE + "/pcc-" + moduleName + "/list";
        return fetch(url, { credentials: "same-origin" })
            .then(function (r) {
                if (!r.ok) throw new Error("HTTP " + r.status);
                return r.json();
            })
            .catch(function () { return null; });
    }

    function callFunction(moduleName, fnName, payload) {
        var url = API_BASE + "/pcc-" + moduleName + "/call/" + encodeURIComponent(fnName);
        return fetch(url, {
            method: "POST",
            credentials: "same-origin",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload || {})
        }).then(function (r) { return r.json(); });
    }

    function humanize(name) {
        return name.replace(/^pcc_/, "").replace(/_ext\d+$/, "").replace(/_/g, " ");
    }

    function renderPanel() {
        var host = $("pageContent");
        if (!host) return;
        host.innerHTML = "" +
            "<section dir=\"rtl\" lang=\"ar\" class=\"pcc-catalog\">" +
            "<div class=\"pcc-catalog-header\">" +
            "<h2 class=\"pcc-catalog-title\">كتالوج وحدات PCC السريرية</h2>" +
            "<p class=\"pcc-catalog-sub\">يعرض كل وحدات PCC النشطة على السيرفر ويستدعي APIs حقيقية.</p>" +
            "</div>" +
            "<div class=\"pcc-catalog-toolbar\">" +
            "<input type=\"text\" id=\"pccSearch\" placeholder=\"ابحث باسم الوحدة أو التخصص...\" />" +
            "<span id=\"pccStats\" class=\"pcc-catalog-stats\"></span>" +
            "<button type=\"button\" id=\"pccRefreshBtn\" class=\"pcc-btn-secondary\">تحديث</button>" +
            "</div>" +
            "<div id=\"pccGrid\" class=\"pcc-catalog-grid\"><div class=\"pcc-loading\">جاري التحميل...</div></div>" +
            "</section>" +
            "<div id=\"pccModal\" class=\"pcc-modal\" hidden>" +
            "<div class=\"pcc-modal-card\">" +
            "<button type=\"button\" id=\"pccModalClose\" class=\"pcc-modal-close\" aria-label=\"إغلاق\">&times;</button>" +
            "<h3 id=\"pccModalTitle\"></h3>" +
            "<div id=\"pccModalBody\"></div>" +
            "</div></div>" +
            "<style>" +
            ".pcc-catalog{padding:24px;max-width:1400px;margin:0 auto;}" +
            ".pcc-catalog-title{font-size:24px;font-weight:700;color:#0f172a;margin:0 0 8px;}" +
            ".pcc-catalog-sub{color:#64748b;margin:0 0 20px;}" +
            ".pcc-catalog-toolbar{display:flex;gap:12px;align-items:center;margin-bottom:20px;flex-wrap:wrap;}" +
            "#pccSearch{flex:1;min-width:280px;padding:10px 14px;border:1px solid #cbd5e1;border-radius:8px;font-size:15px;}" +
            ".pcc-catalog-stats{color:#475569;font-weight:600;font-size:14px;}" +
            ".pcc-btn-secondary{padding:8px 16px;background:#e2e8f0;border:none;border-radius:6px;cursor:pointer;font-weight:600;}" +
            ".pcc-btn-secondary:hover{background:#cbd5e1;}" +
            ".pcc-catalog-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:14px;}" +
            ".pcc-card{background:#fff;border:1px solid #e2e8f0;border-radius:10px;padding:16px;cursor:pointer;transition:all 0.15s;box-shadow:0 1px 2px rgba(0,0,0,0.04);}" +
            ".pcc-card:hover{border-color:#3b82f6;box-shadow:0 4px 12px rgba(59,130,246,0.15);transform:translateY(-1px);}" +
            ".pcc-card-title{font-size:16px;font-weight:700;color:#0f172a;margin:0 0 6px;}" +
            ".pcc-card-sub{font-size:13px;color:#64748b;margin:0 0 10px;direction:ltr;text-align:left;}" +
            ".pcc-card-meta{display:flex;justify-content:space-between;font-size:12px;color:#475569;}" +
            ".pcc-loading{padding:40px;text-align:center;color:#64748b;}" +
            ".pcc-modal{position:fixed;inset:0;background:rgba(15,23,42,0.55);display:flex;align-items:center;justify-content:center;z-index:9999;}" +
            ".pcc-modal[hidden]{display:none;}" +
            ".pcc-modal-card{background:#fff;max-width:780px;width:92%;max-height:88vh;overflow-y:auto;border-radius:14px;padding:24px;position:relative;box-shadow:0 24px 48px rgba(0,0,0,0.25);}" +
            ".pcc-modal-close{position:absolute;top:10px;left:10px;background:none;border:none;font-size:28px;cursor:pointer;color:#64748b;}" +
            ".pcc-modal-close:hover{color:#0f172a;}" +
            ".pcc-fn-list{list-style:none;padding:0;margin:0;display:flex;flex-direction:column;gap:8px;}" +
            ".pcc-fn-item{display:flex;justify-content:space-between;align-items:center;padding:10px 12px;background:#f8fafc;border-radius:8px;}" +
            ".pcc-fn-name{font-family:monospace;font-size:13px;color:#0f172a;direction:ltr;}" +
            ".pcc-fn-call{background:#2563eb;color:#fff;border:none;padding:6px 14px;border-radius:6px;cursor:pointer;font-weight:600;font-size:13px;}" +
            ".pcc-fn-call:hover{background:#1d4ed8;}" +
            ".pcc-result{margin-top:16px;padding:14px;background:#0f172a;color:#e2e8f0;border-radius:8px;font-family:monospace;font-size:12px;white-space:pre-wrap;word-break:break-all;direction:ltr;text-align:left;max-height:340px;overflow-y:auto;}" +
            "</style>";

        $("pccSearch").addEventListener("input", function () { renderGrid(); });
        $("pccRefreshBtn").addEventListener("click", function () {
            cache.ts = 0;
            loadAndRender();
        });
        $("pccModalClose").addEventListener("click", closeModal);
        $("pccModal").addEventListener("click", function (e) {
            if (e.target === $("pccModal")) closeModal();
        });
    }

    function renderGrid() {
        var grid = $("pccGrid");
        var stats = $("pccStats");
        var q = ($("pccSearch") && $("pccSearch").value || "").trim().toLowerCase();
        var filtered = cache.modules.filter(function (m) {
            return !q || m.toLowerCase().indexOf(q) !== -1 || humanize(m).toLowerCase().indexOf(q) !== -1;
        });
        stats.textContent = "إجمالي: " + cache.modules.length + " | معروض: " + filtered.length + (cache.meta.version ? " | إصدار: " + cache.meta.version : "");
        if (!filtered.length) {
            grid.innerHTML = "<div class=\"pcc-loading\">لا توجد وحدات مطابقة.</div>";
            return;
        }
        var html = filtered.map(function (m) {
            return "<div class=\"pcc-card\" data-mod=\"" + escapeHTML(m) + "\">" +
                "<div class=\"pcc-card-title\">" + escapeHTML(humanize(m)) + "</div>" +
                "<div class=\"pcc-card-sub\">" + escapeHTML(m) + "</div>" +
                "<div class=\"pcc-card-meta\"><span>اضغط للتفاصيل</span><span>10 دوال</span></div>" +
                "</div>";
        }).join("");
        grid.innerHTML = html;
        Array.prototype.forEach.call(grid.querySelectorAll(".pcc-card"), function (card) {
            card.addEventListener("click", function () { openModule(card.getAttribute("data-mod")); });
        });
    }

    function openModule(moduleName) {
        var modal = $("pccModal");
        var title = $("pccModalTitle");
        var body = $("pccModalBody");
        title.textContent = humanize(moduleName);
        body.innerHTML = "<div class=\"pcc-loading\">جاري جلب الدوال...</div>";
        modal.hidden = false;
        fetchModuleMeta(moduleName).then(function (meta) {
            if (!meta) {
                body.innerHTML = "<p style=\"color:#dc2626;\">تعذر الاتصال بالـ API. تأكد أن الوحدة على السيرفر.</p>";
                return;
            }
            var fns = meta.functions || [];
            var html = "<p style=\"color:#475569;margin:0 0 14px;\">" +
                "الوحدة: <code>" + escapeHTML(moduleName) + "</code> | الإصدار: " + escapeHTML(meta.version || "?") + " | الدوال: <strong>" + fns.length + "</strong></p>" +
                "<ul class=\"pcc-fn-list\">" +
                fns.map(function (fn) {
                    return "<li class=\"pcc-fn-item\"><span class=\"pcc-fn-name\">" + escapeHTML(fn) + "</span>" +
                        "<button type=\"button\" class=\"pcc-fn-call\" data-fn=\"" + escapeHTML(fn) + "\">تشغيل تجريبي</button></li>";
                }).join("") +
                "</ul>" +
                "<div id=\"pccResult\"></div>";
            body.innerHTML = html;
            Array.prototype.forEach.call(body.querySelectorAll(".pcc-fn-call"), function (btn) {
                btn.addEventListener("click", function () {
                    var fn = btn.getAttribute("data-fn");
                    btn.disabled = true;
                    btn.textContent = "جاري التنفيذ...";
                    callFunction(moduleName, fn, { test: 1, sample: true, v: 1 })
                        .then(function (out) {
                            var r = $("pccResult");
                            if (r) r.outerHTML = "<div id=\"pccResult\" class=\"pcc-result\">" + escapeHTML(JSON.stringify(out, null, 2)) + "</div>";
                            btn.disabled = false;
                            btn.textContent = "تشغيل تجريبي";
                        })
                        .catch(function (e) {
                            btn.disabled = false;
                            btn.textContent = "تشغيل تجريبي";
                            var r = $("pccResult");
                            if (r) r.outerHTML = "<div id=\"pccResult\" class=\"pcc-result\" style=\"color:#fca5a5;\">خطأ: " + escapeHTML(String(e)) + "</div>";
                        });
                });
            });
        });
    }

    function closeModal() { $("pccModal").hidden = true; }

    function loadAndRender() {
        renderPanel();
        var grid = $("pccGrid");
        grid.innerHTML = "<div class=\"pcc-loading\">جاري جلب الكتالوج من السيرفر...</div>";
        var p = (cache.modules.length && (Date.now() - cache.ts) < CACHE_TTL_MS)
            ? Promise.resolve(cache)
            : fetchCatalog();
        p.then(function () { renderGrid(); })
         .catch(function (e) {
             grid.innerHTML = "<div class=\"pcc-loading\" style=\"color:#dc2626;\">فشل التحميل: " + escapeHTML(String(e)) + "</div>";
         });
    }

    window.PCCCatalog = { show: loadAndRender, refresh: function () { cache.ts = 0; loadAndRender(); } };

    document.addEventListener("DOMContentLoaded", function () {
        document.body.addEventListener("click", function (e) {
            var t = e.target;
            if (t && t.id === "openPccCatalog") {
                e.preventDefault();
                loadAndRender();
            }
        });
        if (window.location.hash === "#pcc-catalog") {
            loadAndRender();
        }
    });
})();
