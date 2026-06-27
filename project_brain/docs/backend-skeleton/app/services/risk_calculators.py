"""Cardiology risk score calculators. 100% unit-test coverage required."""

from __future__ import annotations

from typing import Literal


def heart_score(
    *,
    history: Literal[0, 1, 2],
    ecg: Literal[0, 1, 2],
    age_years: int,
    risk_factors_count: int,
    troponin_x_uln: float,
) -> int:
    """HEART score for chest-pain risk stratification (0-10)."""
    age_pts = 0 if age_years < 45 else (1 if age_years < 65 else 2)
    rf_pts = 0 if risk_factors_count == 0 else (1 if risk_factors_count <= 2 else 2)
    trop_pts = 0 if troponin_x_uln < 1 else (1 if troponin_x_uln <= 3 else 2)
    return history + ecg + age_pts + rf_pts + trop_pts


def cha2ds2_vasc(
    *,
    chf: bool, hypertension: bool, age_years: int, dm: bool,
    stroke_tia: bool, vascular: bool, sex_female: bool,
) -> int:
    """CHA2DS2-VASc for AF stroke risk."""
    score = 0
    score += 1 if chf else 0
    score += 1 if hypertension else 0
    score += 2 if age_years >= 75 else (1 if age_years >= 65 else 0)
    score += 1 if dm else 0
    score += 2 if stroke_tia else 0
    score += 1 if vascular else 0
    score += 1 if sex_female else 0
    return score


def has_bled(
    *,
    htn_uncontrolled: bool, abnormal_renal: bool, abnormal_liver: bool,
    stroke_history: bool, bleeding_history: bool, labile_inr: bool,
    age_over_65: bool, drugs: bool, alcohol: bool,
) -> int:
    """HAS-BLED for bleeding risk on anticoagulation."""
    return sum([
        htn_uncontrolled, abnormal_renal, abnormal_liver,
        stroke_history, bleeding_history, labile_inr,
        age_over_65, drugs, alcohol,
    ])


def grace_score_simplified(
    *,
    age_years: int, hr: int, sbp: int, creatinine: float,
    killip_class: Literal[1, 2, 3, 4],
    cardiac_arrest: bool, st_deviation: bool, elevated_markers: bool,
) -> int:
    """Simplified GRACE for ACS in-hospital mortality.
    Reference: Fox 2006 / Granger 2003. This is an approximation; production should
    use the validated nomogram or vendor-licensed calculator.
    """
    s = 0
    s += max(0, (age_years - 30)) * 1.4
    s += max(0, (hr - 50)) * 0.5
    s += max(0, (200 - sbp)) * 0.4
    s += creatinine * 28
    s += [0, 0, 20, 39, 59][killip_class]
    s += 39 if cardiac_arrest else 0
    s += 28 if st_deviation else 0
    s += 14 if elevated_markers else 0
    return int(s)


def crcl_cockcroft_gault(*, age: int, weight_kg: float, creatinine_mgdl: float, sex_female: bool) -> float:
    """Cockcroft-Gault creatinine clearance (mL/min)."""
    crcl = ((140 - age) * weight_kg) / (72 * creatinine_mgdl)
    return crcl * (0.85 if sex_female else 1.0)


def doac_dose_decision(*, drug: Literal["apixaban", "rivaroxaban", "dabigatran", "edoxaban"],
                      age: int, weight_kg: float, creatinine_mgdl: float, sex_female: bool) -> dict:
    """Returns recommended DOAC dose + cautions for AF stroke prevention."""
    crcl = crcl_cockcroft_gault(age=age, weight_kg=weight_kg, creatinine_mgdl=creatinine_mgdl, sex_female=sex_female)
    cautions: list[str] = []
    dose: str = ""
    if drug == "apixaban":
        criteria = sum([age >= 80, weight_kg <= 60, creatinine_mgdl >= 1.5])
        dose = "2.5 mg PO BID" if criteria >= 2 else "5 mg PO BID"
        if crcl < 15:
            cautions.append("Avoid: severe renal impairment.")
    elif drug == "rivaroxaban":
        if crcl >= 50:
            dose = "20 mg PO once daily with food"
        elif crcl >= 15:
            dose = "15 mg PO once daily with food"
        else:
            dose = "Avoid"
            cautions.append("Avoid: CrCl < 15.")
    elif drug == "dabigatran":
        if crcl > 30:
            dose = "150 mg PO BID"
        elif crcl >= 15:
            dose = "75 mg PO BID"
        else:
            dose = "Avoid"
            cautions.append("Avoid: CrCl < 15.")
    elif drug == "edoxaban":
        if 50 <= crcl <= 95:
            dose = "60 mg PO once daily"
        elif 15 <= crcl < 50:
            dose = "30 mg PO once daily"
        else:
            dose = "Avoid"
            cautions.append("Avoid: CrCl > 95 or < 15.")
    return {"drug": drug, "dose": dose, "crcl_ml_min": round(crcl, 1), "cautions": cautions}
