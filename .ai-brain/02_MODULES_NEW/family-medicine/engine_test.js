/**
 * Family Medicine — Engine Tests
 * NamaMedical Department
 *
 * @module tests/family-medicine
 */

const { describe, it, expect } = require('vitest');
const {
  ascvdRisk,
  diabetesRisk,
  smokingCessation,
  wellnessScreenings,
  ValidationError,
} = require('../engine.js');

describe('ascvdRisk', () => {
  it('computes low risk for young healthy female', () => {
    const result = ascvdRisk({
      age: 35, gender: 'female',
      total_cholesterol: 180, hdl_cholesterol: 60,
      systolic_bp: 110, on_bp_treatment: false,
      smoker: false, diabetes: false,
    });
    expect(result.risk_pct).toBeLessThan(2);
    expect(result.category).toBe('low');
    expect(result.codes).toContain('Z13.6');
  });

  it('computes high risk for older male with multiple risk factors', () => {
    const result = ascvdRisk({
      age: 65, gender: 'male',
      total_cholesterol: 250, hdl_cholesterol: 35,
      systolic_bp: 160, on_bp_treatment: true,
      smoker: true, diabetes: true,
    });
    expect(result.risk_pct).toBeGreaterThan(20);
    expect(result.category).toBe('high');
    expect(result.codes).toContain('E78.5');
    expect(result.codes).toContain('I10');
    expect(result.codes).toContain('E11.9');
  });

  it('rejects age out of range', () => {
    expect(() => ascvdRisk({
      age: 25, gender: 'male',
      total_cholesterol: 200, hdl_cholesterol: 50,
      systolic_bp: 120, on_bp_treatment: false,
    })).toThrow(ValidationError);
  });

  it('rejects missing field', () => {
    expect(() => ascvdRisk({
      age: 50, gender: 'male',
      hdl_cholesterol: 50, systolic_bp: 120,
    })).toThrow(ValidationError);
  });

  it('returns Arabic recommendations', () => {
    const result = ascvdRisk({
      age: 50, gender: 'male',
      total_cholesterol: 220, hdl_cholesterol: 40,
      systolic_bp: 130, on_bp_treatment: false,
      smoker: false, diabetes: false,
    });
    expect(result.recommendations[0]).toMatch(/[\u0600-\u06FF]/); // Arabic
  });
});

describe('diabetesRisk', () => {
  it('computes low risk for healthy young person', () => {
    const result = diabetesRisk({
      age: 30, gender: 'female',
      bmi: 22, waist_circumference_cm: 75,
      family_history_diabetes: false,
      history_high_blood_sugar: false,
      physically_active: true,
    });
    expect(result.score).toBeLessThan(7);
    expect(result.category).toBe('low');
  });

  it('computes very high risk for older obese with family history', () => {
    const result = diabetesRisk({
      age: 70, gender: 'male',
      bmi: 35, waist_circumference_cm: 110,
      family_history_diabetes: true,
      history_high_blood_sugar: true,
      physically_active: false,
    });
    expect(result.score).toBeGreaterThanOrEqual(20);
    expect(result.category).toBe('very_high');
  });

  it('uses correct waist thresholds by gender', () => {
    const maleResult = diabetesRisk({
      age: 60, gender: 'male', bmi: 28, waist_circumference_cm: 100,
      family_history_diabetes: false, history_high_blood_sugar: false, physically_active: true,
    });
    const femaleResult = diabetesRisk({
      age: 60, gender: 'female', bmi: 28, waist_circumference_cm: 100,
      family_history_diabetes: false, history_high_blood_sugar: false, physically_active: true,
    });
    // Female with 100cm waist has more risk than male with 100cm (female threshold 88, male 102)
    expect(femaleResult.score).toBeGreaterThan(maleResult.score);
  });

  it('rejects missing bmi', () => {
    expect(() => diabetesRisk({ age: 30, gender: 'male' })).toThrow(ValidationError);
  });
});

describe('smokingCessation', () => {
  it('returns non_smoker status when not smoking', () => {
    const result = smokingCessation({ currently_smokes: false });
    expect(result.status).toBe('non_smoker');
    expect(result.pack_years).toBe(0);
    expect(result.codes).toEqual([]);
  });

  it('computes pack-years correctly', () => {
    const result = smokingCessation({
      currently_smokes: true,
      cigarettes_per_day: 20,
      years_smoking: 10,
      minutes_to_first_cigarette: 10,
    });
    expect(result.pack_years).toBe(10); // (20/20) * 10
    expect(result.status).toBe('smoker');
    expect(result.codes).toContain('F17.2');
  });

  it('classifies high dependency for heavy morning smokers', () => {
    const result = smokingCessation({
      currently_smokes: true,
      cigarettes_per_day: 30,
      years_smoking: 20,
      minutes_to_first_cigarette: 2,
    });
    expect(result.fagerstrom_score).toBeGreaterThanOrEqual(6);
    expect(result.dependency).toBe('high');
  });
});

describe('wellnessScreenings', () => {
  it('includes age-appropriate screenings for 50yo male', () => {
    const result = wellnessScreenings({
      age: 50, gender: 'male', family_history: [], personal_history: [],
    });
    expect(result.due_screenings).toContainEqual(
      expect.objectContaining({ name: 'تنظير القولون' })
    );
    expect(result.due_screenings).toContainEqual(
      expect.objectContaining({ name: 'PSA (استشاري)' })
    );
  });

  it('includes mammo for 45yo female', () => {
    const result = wellnessScreenings({
      age: 45, gender: 'female', family_history: [], personal_history: [],
    });
    expect(result.due_screenings).toContainEqual(
      expect.objectContaining({ name: 'ماموغرام' })
    );
  });

  it('adds early mammo with family history of breast cancer', () => {
    const result = wellnessScreenings({
      age: 35, gender: 'female',
      family_history: ['breast_cancer'], personal_history: [],
    });
    expect(result.due_screenings).toContainEqual(
      expect.objectContaining({ name: 'ماموغرام مبكر (تاريخ عائلي)' })
    );
  });
});
