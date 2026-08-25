'use strict';
class ValidationError extends Error { constructor(m){super(m);this.name='ValidationError';} }
const CITATIONS = {
  usmf: 'Dixon MF, et al. Classification and Grading of Gastritis. Houston 1996 (Updated Sydney)',
  who_gi: 'WHO Classification of Tumours of the Digestive System 2019'
};
function ensureNumber(v, name) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(name+' must be number'); return v; }
function ensureEnum(v, opts, name) { if (!opts.includes(v)) throw new ValidationError(name+' must be one of '+opts.join(',')); return v; }
function ensureObj(v, name) { if (!v || typeof v !== 'object') throw new ValidationError(name+' required'); return v; }

function dysplasiaGrade(input) {
  ensureObj(input, 'input');
  const lesion = ensureEnum(input.lesion, ['barretts','gastric_adenoma','ibd_colitis','colonic_polyp'], 'lesion');
  const dysplasia = ensureEnum(input.dysplasia, ['none','indefinite','low_grade','high_grade'], 'dysplasia');
  const map = {
    barretts: { none: 'surveillance_3_5yr', indefinite: 'surveillance_12mo', low_grade: 'endoscopic_er_or_surveillance_6mo', high_grade: 'endoscopic_er_or_esophagectomy' },
    gastric_adenoma: { none: 'surveillance', indefinite: 'repeat_biopsy', low_grade: 'endoscopic_resection', high_grade: 'endoscopic_or_surgical' },
    ibd_colitis: { none: 'surveillance_1_3yr', indefinite: 'surveillance_6mo', low_grade: 'endoscopic_resection_chromo', high_grade: 'colectomy_discuss' },
    colonic_polyp: { none: 'surveillance_per_polyp', indefinite: 'repeat_biopsy', low_grade: 'polypectomy', high_grade: 'polypectomy_or_surgical' }
  };
  return { lesion, dysplasia, recommendation: map[lesion][dysplasia] };
}

function helicobacterBiopsy(input) {
  ensureObj(input, 'input');
  const h_pylori = ensureEnum(input.h_pylori, ['positive','negative','equivocal'], 'h_pylori');
  const inflammation = ensureEnum(input.inflammation, ['none','mild','moderate','severe'], 'inflammation');
  const atrophy = ensureEnum(input.atrophy, ['none','mild','moderate','severe'], 'atrophy');
  const intestinal_metaplasia = !!input.intestinal_metaplasia;
  const map = { positive: 'triple_therapy_14d', negative: 'no_eradication', equivocal: 'immunostain_repeat_biopsy' };
  return { h_pylori, inflammation, atrophy, intestinal_metaplasia, treatment: map[h_pylori], olga_olgapr: 'see_atrophy_metaplasia', citations:['usmf'] };
}

module.exports = { dysplasiaGrade, helicobacterBiopsy, CITATIONS, ValidationError };
