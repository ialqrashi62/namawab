/**
 * Family Medicine — Engine
 * NamaMedical Department
 *
 * Pure function engine for family-medicine domain logic.
 * Family medicine covers primary care, preventive medicine,
 * chronic disease management, and care coordination across the lifespan.
 *
 * @module engines/family-medicine
 */

'use strict';

class ValidationError extends Error {
  constructor(code, message, details = {}) {
    super(message);
    this.name = 'ValidationError';
    this.code = code;
    this.details = details;
  }
}

/**
 * Cardiovascular Risk Assessment (Framingham / ASCVD)
 * 10-year risk of cardiovascular event
 *
 * @param {Object} input
 * @param {number} input.age - Age in years (30-79)
 * @param {'male'|'female'} input.gender
 * @param {number} input.total_cholesterol - mg/dL
 * @param {number} input.hdl_cholesterol - mg/dL
 * @param {number} input.systolic_bp - mmHg
 * @param {boolean} input.on_bp_treatment
 * @param {boolean} input.smoker
 * @param {boolean} input.diabetes
 * @returns {Object} { risk_pct, category, recommendations, codes }
 */
function ascvdRisk(input) {
  if (!input || typeof input !== 'object') {
    throw new ValidationError('INVALID_INPUT', 'Input must be an object');
  }
  const required = ['age', 'gender', 'total_cholesterol', 'hdl_cholesterol', 'systolic_bp'];
  for (const field of required) {
    if (input[field] === undefined || input[field] === null) {
      throw new ValidationError('MISSING_FIELD', `${field} is required`, { field });
    }
  }
  if (input.age < 30 || input.age > 79) {
    throw new ValidationError('OUT_OF_RANGE', 'Age must be 30-79', { age: input.age });
  }

  // Simplified ASCVD using pooled cohort equations approximation
  // Real implementation uses exact ACC/AHA coefficients
  const lnAge = Math.log(input.age);
  const lnTC = Math.log(input.total_cholesterol);
  const lnHDL = Math.log(input.hdl_cholesterol);
  const lnSBP = Math.log(input.systolic_bp);

  let baseline;
  let coefficients;
  if (input.gender === 'male') {
    baseline = -12.823;
    coefficients = {
      lnAge: 0.252, lnTC: 0.139, lnHDL: -0.302,
      lnSBP_treated: 1.998, lnSBP_untreated: 1.933,
      smoker: 0.549, diabetes: 0.645,
    };
  } else {
    baseline = -13.222;
    coefficients = {
      lnAge: 0.262, lnTC: 0.107, lnHDL: -0.298,
      lnSBP_treated: 2.821, lnSBP_untreated: 2.761,
      smoker: 0.535, diabetes: 0.658,
    };
  }

  const lnSBP_coef = input.on_bp_treatment ? coefficients.lnSBP_treated : coefficients.lnSBP_untreated;
  let sum = baseline;
  sum += coefficients.lnAge * lnAge;
  sum += coefficients.lnTC * lnTC;
  sum += coefficients.lnHDL * lnHDL;
  sum += lnSBP_coef * lnSBP;
  if (input.smoker) sum += coefficients.smoker;
  if (input.diabetes) sum += coefficients.diabetes;

  const risk = 1 - Math.pow(0.999989, Math.exp(sum));
  const riskPct = Math.round(risk * 1000) / 10; // 1 decimal

  let category, recommendations;
  if (riskPct < 5) {
    category = 'low';
    recommendations = [
      'الحفاظ على نمط حياة صحي (غذاء متوازن، رياضة 150 دقيقة/أسبوع)',
      'إعادة التقييم كل 4-6 سنوات',
      'فحص شامل سنوي',
    ];
  } else if (riskPct < 7.5) {
    category = 'borderline';
    recommendations = [
      'تحسين نمط الحياة (حمية البحر المتوسط، رياضة)',
      'إعادة التقييم كل 3-5 سنوات',
      'مناقشة العلاج بالستاتين مع الطبيب',
    ];
  } else if (riskPct < 20) {
    category = 'intermediate';
    recommendations = [
      'علاج بالستاتين (متوسط الشدة)',
      'علاج ضغط الدم إن كان مرتفعاً',
      'إعادة التقييم كل 2-3 سنوات',
      'استشارة طبيب قلب',
    ];
  } else {
    category = 'high';
    recommendations = [
      'علاج بالستاتين (عالي الشدة)',
      'علاج ضغط الدم والسكر إن وُجدا',
      'استشارة طبيب قلب عاجلة',
      'إعادة التقييم سنوياً',
    ];
  }

  const codes = ['Z13.6']; // Encounter for screening for cardiovascular disorders
  if (riskPct >= 7.5) codes.push('E78.5'); // Hyperlipidemia, unspecified
  if (input.systolic_bp >= 140) codes.push('I10'); // Essential hypertension
  if (input.diabetes) codes.push('E11.9'); // Type 2 diabetes without complications

  return {
    risk_pct: riskPct,
    category,
    recommendations,
    codes,
    metadata: {
      engine: 'family-medicine',
      method: 'ascvd_risk',
      version: '1.0.0',
      guidelines: 'ACC/AHA 2018',
      computed_at: new Date().toISOString(),
    },
  };
}

/**
 * Diabetes Risk Assessment (ADA / FINDRISC simplified)
 *
 * @param {Object} input
 * @param {number} input.age
 * @param {'male'|'female'} input.gender
 * @param {number} input.bmi - Body Mass Index
 * @param {number} input.waist_circumference_cm
 * @param {boolean} input.family_history_diabetes
 * @param {boolean} input.history_high_blood_sugar
 * @param {boolean} input.physically_active
 * @returns {Object} { score, risk_pct, category, recommendations, codes }
 */
function diabetesRisk(input) {
  if (!input || typeof input !== 'object') {
    throw new ValidationError('INVALID_INPUT', 'Input must be an object');
  }
  if (input.bmi === undefined) {
    throw new ValidationError('MISSING_FIELD', 'bmi is required', { field: 'bmi' });
  }

  let score = 0;
  // Age
  if (input.age >= 65) score += 4;
  else if (input.age >= 55) score += 3;
  else if (input.age >= 45) score += 2;
  // BMI
  if (input.bmi >= 30) score += 3;
  else if (input.bmi >= 25) score += 1;
  // Waist
  if (input.gender === 'male') {
    if (input.waist_circumference_cm >= 102) score += 4;
    else if (input.waist_circumference_cm >= 94) score += 3;
  } else {
    if (input.waist_circumference_cm >= 88) score += 4;
    else if (input.waist_circumference_cm >= 80) score += 3;
  }
  // Risk factors
  if (input.family_history_diabetes) score += 5;
  if (input.history_high_blood_sugar) score += 5;
  if (!input.physically_active) score += 2;

  let riskPct, category, recommendations;
  if (score < 7) {
    riskPct = 1;
    category = 'low';
    recommendations = ['فحص السكر كل 3 سنوات', 'الحفاظ على وزن صحي'];
  } else if (score < 12) {
    riskPct = 4;
    category = 'slightly_elevated';
    recommendations = ['فحص السكر كل سنتين', 'إنقاص الوزن 5-7%', 'رياضة 150 دقيقة/أسبوع'];
  } else if (score < 15) {
    riskPct = 17;
    category = 'moderate';
    recommendations = ['فحص السكر سنوياً', 'استشارة طبيب لتقييم شامل', 'برنامج إنقاص وزن'];
  } else if (score < 20) {
    riskPct = 33;
    category = 'high';
    recommendations = ['فحص السكر (HbA1c) عاجلاً', 'استشارة طبيب غدد صماء', 'تدخل دوائي محتمل'];
  } else {
    riskPct = 50;
    category = 'very_high';
    recommendations = ['فحص السكر فورياً', 'استشارة طبيب غدد صماء', 'تدخل دوائي مكثف'];
  }

  const codes = ['Z13.1']; // Encounter for screening for diabetes
  if (score >= 12) codes.push('R73.09'); // Other abnormal glucose

  return {
    score,
    risk_pct: riskPct,
    category,
    recommendations,
    codes,
    metadata: {
      engine: 'family-medicine',
      method: 'diabetes_risk_findrisc',
      version: '1.0.0',
      guidelines: 'ADA 2024',
      computed_at: new Date().toISOString(),
    },
  };
}

/**
 * Smoking Cessation Assessment (5As)
 * Ask, Advise, Assess, Assist, Arrange
 *
 * @param {Object} input
 * @param {boolean} input.currently_smokes
 * @param {number} input.cigarettes_per_day
 * @param {number} input.years_smoking
 * @param {number} input.minutes_to_first_cigarette
 * @returns {Object} { pack_years, fagerstrom_score, dependency, plan, recommendations, codes }
 */
function smokingCessation(input) {
  if (!input || typeof input !== 'object') {
    throw new ValidationError('INVALID_INPUT', 'Input must be an object');
  }
  if (!input.currently_smokes) {
    return {
      status: 'non_smoker',
      pack_years: 0,
      fagerstrom_score: 0,
      dependency: 'none',
      plan: 'تهانينا! الإقلاع عن التدخين يحمي صحتك بشكل كبير',
      recommendations: ['الحفاظ على عدم التدخين', 'تجنب التدخين السلبي'],
      codes: [],
    };
  }

  // Pack-years = (cigarettes_per_day / 20) * years_smoking
  const packYears = ((input.cigarettes_per_day || 0) / 20) * (input.years_smoking || 0);
  const fagerstrom = computeFagerstrom(input);
  const dependency = fagerstrom >= 7 ? 'high' : fagerstrom >= 4 ? 'moderate' : 'low';

  const plan = generateCessationPlan(fagerstrom, packYears);

  return {
    status: 'smoker',
    pack_years: Math.round(packYears * 10) / 10,
    fagerstrom_score: fagerstrom,
    dependency,
    plan,
    recommendations: [
      'استشارة طبيب الإقلاع عن التدخين',
      'العلاج ببدائل النيكوتين (لصقات، علكة)',
      'الأدوية المساعدة (Varenicline, Bupropion) إن لزم',
      'متابعة أسبوعية خلال الشهر الأول',
    ],
    codes: ['F17.2'] /* Nicotine dependence */,
    metadata: {
      engine: 'family-medicine',
      method: 'smoking_cessation_5as',
      version: '1.0.0',
      guidelines: 'USPHS 2021',
      computed_at: new Date().toISOString(),
    },
  };
}

function computeFagerstrom(input) {
  let score = 0;
  if (input.minutes_to_first_cigarette < 5) score += 3;
  else if (input.minutes_to_first_cigarette < 30) score += 2;
  else if (input.minutes_to_first_cigarette < 60) score += 1;
  if (input.cigarettes_per_day >= 31) score += 3;
  else if (input.cigarettes_per_day >= 21) score += 2;
  else if (input.cigarettes_per_day >= 11) score += 1;
  return score;
}

function generateCessationPlan(fagerstrom, packYears) {
  if (fagerstrom >= 7) {
    return 'برنامج مكثف: استشارة أسبوعية + علاج دوائي + بدائل نيكوتين';
  }
  if (fagerstrom >= 4) {
    return 'برنامج متوسط: استشارة نصف شهرية + بدائل نيكوتين';
  }
  return 'برنامج بسيط: استشارة شهرية + متابعة';
}

/**
 * Wellness Visit Screening (Annual Checkup)
 * Determines which screenings are due based on age, gender, risk
 *
 * @param {Object} input
 * @param {number} input.age
 * @param {'male'|'female'} input.gender
 * @param {string[]} input.family_history - list of conditions
 * @param {string[]} input.personal_history - list of conditions
 * @returns {Object} { due_screenings, overdue, recommendations }
 */
function wellnessScreenings(input) {
  if (!input || typeof input !== 'object') {
    throw new ValidationError('INVALID_INPUT', 'Input must be an object');
  }
  const screenings = [];
  const today = new Date();

  // Universal (all adults)
  screenings.push({ name: 'ضغط الدم', frequency: 'سنوي', due: true });
  screenings.push({ name: 'BMI', frequency: 'سنوي', due: true });
  screenings.push({ name: 'فحص بصر', frequency: 'كل 1-2 سنة', due: input.age >= 40 });
  screenings.push({ name: 'فحص سكري', frequency: 'كل 3 سنوات (أو سنوياً عالي الخطورة)', due: input.age >= 35 });

  // Gender-specific
  if (input.gender === 'female') {
    screenings.push({ name: 'مسحة عنق الرحم (Pap)', frequency: 'كل 3 سنوات (21-65)', due: input.age >= 21 && input.age <= 65 });
    screenings.push({ name: 'ماموغرام', frequency: 'كل 1-2 سنة (40+)', due: input.age >= 40 && input.age <= 74 });
  } else {
    screenings.push({ name: 'PSA (استشاري)', frequency: 'سنوي (50+) أو 45+ لذوي التاريخ العائلي', due: input.age >= 50 });
  }

  // Age-specific
  if (input.age >= 50 && input.age <= 75) {
    screenings.push({ name: 'تنظير القولون', frequency: 'كل 10 سنوات (أو 5 للمناظير الجزئية)', due: true });
    screenings.push({ name: 'فحص هشاشة العظام (DEXA)', frequency: 'كل 2-5 سنوات', due: input.gender === 'female' });
  }
  if (input.age >= 65) {
    screenings.push({ name: 'AAA (تمدد الشريان الأبهر)', frequency: 'مرة واحدة للرجال المدخنين', due: input.gender === 'male' });
  }

  // Family history-driven
  if (input.family_history?.includes('breast_cancer')) {
    screenings.push({ name: 'ماموغرام مبكر (تاريخ عائلي)', frequency: 'سنوي من 40 أو قبل 10 سنوات من تشخيص الأقارب', due: true });
  }
  if (input.family_history?.includes('colon_cancer')) {
    screenings.push({ name: 'تنظير قولون مبكر', frequency: 'كل 5 سنوات من 40 أو 10 سنوات قبل تشخيص الأقارب', due: true });
  }

  return {
    due_screenings: screenings,
    overdue: screenings.filter((s) => s.due),
    recommendations: [
      'جدولة جميع الفحوصات في زيارة واحدة',
      'مناقشة اللقاحات المطلوبة',
      'تقييم الصحة النفسية',
    ],
    metadata: {
      engine: 'family-medicine',
      method: 'wellness_screenings',
      version: '1.0.0',
      guidelines: 'USPSTF 2024',
      computed_at: today.toISOString(),
    },
  };
}

module.exports = {
  ascvdRisk,
  diabetesRisk,
  smokingCessation,
  wellnessScreenings,
  ValidationError,
  _internal: {
    computeFagerstrom,
    generateCessationPlan,
  },
};
