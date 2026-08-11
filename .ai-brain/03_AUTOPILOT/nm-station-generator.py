#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
nm-station-generator.py
Generates Vanilla JS station files for missing departments.
Output: namaweb/public/js/<dept>-station.js
"""
import io
import os
import sys
import yaml
from pathlib import Path
from datetime import datetime

if hasattr(sys.stdout, 'buffer'):
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')

WORKSPACE = Path(r"c:\Users\ice\Desktop\NMEDCALVSCODE")
OUT_DIR = WORKSPACE / "namaweb/public/js"

STATION_TEMPLATE = """// filepath: namaweb/public/js/{code_short}-station.js
// {name_en} ({code}) Station — Generated {date}
// Vanilla JS + Tailwind, RTL/LTR, AR primary

(function(global){{
  'use strict';

  const escapeHTML = (s) => String(s||'').replace(/[&<>"']/g, c => ({{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}}[c]));

  const {{code_short_pascal}}Station = {{
    id: '{code}',
    code_short: '{code_short}',
    name: {{ ar: '{name_ar}', en: '{name_en}' }},
    routes: ['/station/{code_short}'],
    state: {{ patient: null, encounter: null, alerts: [], tab: 'overview' }},

    mount(rootSel, ctx) {{
      this.root = document.querySelector(rootSel);
      if (!this.root) return console.error('Root not found:', rootSel);
      this.ctx = ctx || {{}};
      this.lang = this.ctx.lang || 'ar';
      this.dir = this.lang === 'ar' ? 'rtl' : 'ltr';
      this.render();
      this.bindEvents();
      this.loadData();
    }},

    render() {{
      this.root.innerHTML = this.tpl();
    }},

    tpl() {{
      const title = escapeHTML(this.name[this.lang]);
      return `
        <div class="dept-station" dir="${{this.dir}}" lang="${{this.lang}}">
          <header class="dept-station__header">
            <h1 class="dept-station__title">${{title}}</h1>
            <div class="dept-station__tabs" role="tablist">
              <button class="tab tab--active" data-tab="overview" role="tab">
                ${{this.lang === 'ar' ? 'نظرة عامة' : 'Overview'}}
              </button>
              <button class="tab" data-tab="orders" role="tab">
                ${{this.lang === 'ar' ? 'الطلبات' : 'Orders'}}
              </button>
              <button class="tab" data-tab="results" role="tab">
                ${{this.lang === 'ar' ? 'النتائج' : 'Results'}}
              </button>
              <button class="tab" data-tab="notes" role="tab">
                ${{this.lang === 'ar' ? 'الملاحظات' : 'Notes'}}
              </button>
            </div>
          </header>

          <div class="dept-station__layout">
            <aside class="dept-station__sidebar">
              <div class="patient-id-card" id="patient-card">
                <div class="patient-id-card__avatar" aria-hidden="true">--</div>
                <div class="patient-id-card__info">
                  <div class="patient-id-card__name">--</div>
                  <div class="patient-id-card__meta">--</div>
                </div>
              </div>
              <div class="allergy-banner" id="allergy-banner" style="display:none">
                <span class="allergy-banner__icon" aria-hidden="true">⚠</span>
                <span class="allergy-banner__text">--</span>
              </div>
              <div class="risk-stratifier" id="risk-stratifier">
                <div class="risk-stratifier__label">--</div>
                <div class="risk-stratifier__score">--</div>
                <div class="risk-stratifier__level">--</div>
              </div>
            </aside>

            <main class="dept-station__main" id="dept-body">
              <div class="vital-panel" id="vital-panel">
                <div class="vital-card"><span class="vital-label">HR</span><span class="vital-value" id="v-hr">--</span><span class="vital-unit">bpm</span></div>
                <div class="vital-card"><span class="vital-label">BP</span><span class="vital-value" id="v-bp">--</span><span class="vital-unit">mmHg</span></div>
                <div class="vital-card"><span class="vital-label">SpO₂</span><span class="vital-value" id="v-spo2">--</span><span class="vital-unit">%</span></div>
                <div class="vital-card"><span class="vital-label">RR</span><span class="vital-value" id="v-rr">--</span><span class="vital-unit">/min</span></div>
              </div>

              <div class="cds-alert cds-alert--info" id="cds-alert" style="display:none" role="status"></div>

              <div id="orders-list" class="orders-list" hidden></div>
              <div id="results-list" class="results-list" hidden></div>
              <div id="notes-editor" class="notes-editor" hidden>
                <textarea class="notes-editor__textarea" placeholder="S/O: ... A/P: ..." rows="8"></textarea>
                <div class="notes-editor__actions">
                  <button class="btn btn--ghost" id="btn-save-draft">${{this.lang === 'ar' ? 'حفظ مسودة' : 'Save Draft'}}</button>
                  <button class="btn btn--primary" id="btn-sign">${{this.lang === 'ar' ? 'توقيع' : 'Sign'}}</button>
                </div>
              </div>
            </main>
          </div>
        </div>
      `;
    }},

    bindEvents() {{
      this.root.querySelectorAll('.tab').forEach(btn => {{
        btn.addEventListener('click', e => {{
          this.root.querySelectorAll('.tab').forEach(b => b.classList.remove('tab--active'));
          btn.classList.add('tab--active');
          this.switchTab(btn.dataset.tab);
        }});
      }});
      const saveBtn = this.root.querySelector('#btn-save-draft');
      const signBtn = this.root.querySelector('#btn-sign');
      if (saveBtn) saveBtn.addEventListener('click', () => this.saveNote('draft'));
      if (signBtn) signBtn.addEventListener('click', () => this.saveNote('signed'));
    }},

    switchTab(tab) {{
      this.state.tab = tab;
      const tabs = ['overview', 'orders', 'results', 'notes'];
      tabs.forEach(t => {{
        const el = this.root.querySelector(`#${{t === 'overview' ? 'vital-panel' : t + (t === 'orders' || t === 'results' ? '-list' : '-editor')}}`);
        if (el) el.hidden = (t !== tab && t !== 'overview');
      }});
      // Vital panel + CDS always shown in overview
      const vital = this.root.querySelector('#vital-panel');
      const cds = this.root.querySelector('#cds-alert');
      if (tab === 'overview') {{
        if (vital) vital.hidden = false;
        if (cds) cds.hidden = !cds.textContent;
      }} else {{
        if (vital) vital.hidden = true;
        if (cds) cds.hidden = true;
      }}
    }},

    async loadData() {{
      const api = (window.DeptStations && window.DeptStations.api) || null;
      const tenantId = this.ctx.tenantId;
      const patientId = this.ctx.patientId;
      if (!api || !tenantId) return;

      try {{
        const enc = await api.get(`${{this.code_short}}/list?patient_id=${{patientId}}`, {{ tenantId }});
        if (enc && enc.items && enc.items[0]) this.renderEncounter(enc.items[0]);
        const orders = await api.get(`${{this.code_short}}/orders?patient_id=${{patientId}}`, {{ tenantId }});
        if (orders && orders.items) this.renderOrders(orders.items);
        const results = await api.get(`${{this.code_short}}/results?patient_id=${{patientId}}`, {{ tenantId }});
        if (results && results.items) this.renderResults(results.items);
      }} catch (e) {{
        console.error('Failed to load {code_short} data:', e);
      }}
    }},

    renderEncounter(enc) {{
      this.state.encounter = enc;
      const card = this.root.querySelector('#patient-card');
      if (card) {{
        card.querySelector('.patient-id-card__name').textContent = enc.patient_name || '—';
        card.querySelector('.patient-id-card__meta').textContent = `MRN: ${{enc.patient_id || '—'}}`;
      }}
      const banner = this.root.querySelector('#allergy-banner');
      if (banner && enc.allergies && enc.allergies.length > 0) {{
        banner.style.display = '';
        banner.querySelector('.allergy-banner__text').textContent = enc.allergies.join(', ');
      }}
    }},

    renderOrders(orders) {{
      const list = this.root.querySelector('#orders-list');
      if (!list) return;
      list.innerHTML = orders.map(o => `
        <div class="order-card">
          <header class="order-card__header">
            <span class="order-card__title">${{escapeHTML(o.order_type + ': ' + o.order_code)}}</span>
            <span class="badge badge--priority-${{escapeHTML(o.priority)}}">${{escapeHTML(o.priority)}}</span>
          </header>
          <div class="order-card__meta">${{escapeHTML(o.status)}} · ${{escapeHTML(new Date(o.ordered_at).toLocaleString())}}</div>
        </div>
      `).join('');
    }},

    renderResults(results) {{
      const list = this.root.querySelector('#results-list');
      if (!list) return;
      list.innerHTML = results.map(r => `
        <div class="result-card ${{r.abnormal_flag && r.abnormal_flag !== 'N' ? 'result-card--abnormal' : ''}}">
          <span class="result-card__type">${{escapeHTML(r.result_type)}}</span>
          <span class="result-card__value">${{escapeHTML(r.result_value || '')}} ${{escapeHTML(r.result_unit || '')}}</span>
        </div>
      `).join('');
    }},

    async saveNote(action) {{
      const ta = this.root.querySelector('.notes-editor__textarea');
      if (!ta || !ta.value) return;
      const api = window.DeptStations && window.DeptStations.api;
      if (!api) return;
      try {{
        await api.post(`${{this.code_short}}/notes`, {{
          patient_id: this.ctx.patientId,
          encounter_id: this.state.encounter?.id,
          note_text: ta.value,
          action,
        }}, {{ tenantId: this.ctx.tenantId }});
        if (action === 'signed') {{
          this.root.querySelector('#btn-sign').textContent = this.lang === 'ar' ? '✓ موقّعة' : '✓ Signed';
          this.root.querySelector('#btn-sign').disabled = true;
        }}
      }} catch (e) {{
        console.error('Failed to save note:', e);
      }}
    }},

    unload() {{
      if (this.root) this.root.innerHTML = '';
    }}
  }};

  global.DeptStations = global.DeptStations || {{}};
  global.DeptStations['{code}'] = {{code_short_pascal}}Station;
  global.DeptStations['{code_short}'] = {{code_short_pascal}}Station;
}})(window);
"""


def generate_station(dept, out_root, date):
    code = dept["code"]
    code_short = dept["code_short"]
    code_short_pascal = "".join(p.capitalize() for p in code_short.split("_"))
    name_en = dept["name_en"]
    name_ar = dept.get("name_ar", code)
    # Manual replacement to avoid .format() issues with other placeholders
    content = STATION_TEMPLATE
    content = content.replace("{code}", code)
    content = content.replace("{code_short}", code_short)
    content = content.replace("{code_short_pascal}", code_short_pascal)
    content = content.replace("{name_en}", name_en)
    content = content.replace("{name_ar}", name_ar)
    content = content.replace("{date}", date)
    out_path = out_root / f"{code_short}-station.js"
    out_path.write_text(content, encoding="utf-8")
    return str(out_path)


def main():
    cfg_path = WORKSPACE / ".ai-brain/03_AUTOPILOT/dept_config_all.yaml"
    with open(cfg_path, "r", encoding="utf-8") as f:
        cfg = yaml.safe_load(f)

    date = datetime.now().strftime("%Y-%m-%d")
    written, skipped = [], []
    for dept in cfg["depts"]:
        code_short = dept["code_short"]
        station_path = OUT_DIR / f"{code_short}-station.js"
        if station_path.exists():
            skipped.append(str(station_path))
            continue
        path = generate_station(dept, OUT_DIR, date)
        written.append(path)

    print(f"[STATS] Stations generated: {len(written)}")
    print(f"[STATS] Skipped (existing): {len(skipped)}")
    for p in written[:5]:
        print(f"  [+] {p}")
    if len(written) > 5:
        print(f"  ... and {len(written) - 5} more")


if __name__ == "__main__":
    main()
