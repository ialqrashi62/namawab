"""Unit tests for risk calculators — must hit 100% coverage."""

import pytest

from app.services.risk_calculators import (
    cha2ds2_vasc, crcl_cockcroft_gault, doac_dose_decision,
    grace_score_simplified, has_bled, heart_score,
)


class TestHEART:
    @pytest.mark.parametrize(
        ("h", "ecg", "age", "rf", "trop", "expected"),
        [
            (0, 0, 30, 0, 0.5, 0),       # all low
            (2, 2, 70, 4, 4.0, 10),      # all max
            (1, 1, 50, 1, 1.5, 5),       # mid
            (1, 0, 65, 2, 0.9, 4),       # boundary
            (2, 2, 44, 0, 0.0, 4),       # young + bad ecg/history
        ],
    )
    def test_heart(self, h, ecg, age, rf, trop, expected):
        assert heart_score(history=h, ecg=ecg, age_years=age,
                           risk_factors_count=rf, troponin_x_uln=trop) == expected


class TestCHA2DS2VASc:
    def test_zero(self):
        assert cha2ds2_vasc(chf=False, hypertension=False, age_years=50, dm=False,
                            stroke_tia=False, vascular=False, sex_female=False) == 0

    def test_max(self):
        assert cha2ds2_vasc(chf=True, hypertension=True, age_years=80, dm=True,
                            stroke_tia=True, vascular=True, sex_female=True) == 9

    def test_age_65_to_74_one_pt(self):
        assert cha2ds2_vasc(chf=False, hypertension=False, age_years=70, dm=False,
                            stroke_tia=False, vascular=False, sex_female=False) == 1

    def test_age_75_plus_two_pt(self):
        assert cha2ds2_vasc(chf=False, hypertension=False, age_years=75, dm=False,
                            stroke_tia=False, vascular=False, sex_female=False) == 2


class TestHASBLED:
    def test_max(self):
        assert has_bled(htn_uncontrolled=True, abnormal_renal=True, abnormal_liver=True,
                        stroke_history=True, bleeding_history=True, labile_inr=True,
                        age_over_65=True, drugs=True, alcohol=True) == 9


class TestCrCl:
    def test_male_norm(self):
        v = crcl_cockcroft_gault(age=40, weight_kg=70, creatinine_mgdl=1.0, sex_female=False)
        assert 90 < v < 100

    def test_female_lower(self):
        m = crcl_cockcroft_gault(age=40, weight_kg=70, creatinine_mgdl=1.0, sex_female=False)
        f = crcl_cockcroft_gault(age=40, weight_kg=70, creatinine_mgdl=1.0, sex_female=True)
        assert f == pytest.approx(m * 0.85)


class TestDOAC:
    def test_apixaban_dose_reduction_age_weight_cr(self):
        d = doac_dose_decision(drug="apixaban", age=82, weight_kg=55, creatinine_mgdl=1.6, sex_female=True)
        assert d["dose"] == "2.5 mg PO BID"

    def test_apixaban_full(self):
        d = doac_dose_decision(drug="apixaban", age=60, weight_kg=85, creatinine_mgdl=1.0, sex_female=False)
        assert d["dose"] == "5 mg PO BID"

    def test_dabigatran_avoid_below_15(self):
        d = doac_dose_decision(drug="dabigatran", age=80, weight_kg=60, creatinine_mgdl=4.0, sex_female=True)
        assert d["dose"] == "Avoid"
        assert any("CrCl" in c for c in d["cautions"])

    def test_rivaroxaban_full(self):
        d = doac_dose_decision(drug="rivaroxaban", age=60, weight_kg=80, creatinine_mgdl=0.9, sex_female=False)
        assert d["dose"].startswith("20 mg")

    def test_edoxaban_band(self):
        d = doac_dose_decision(drug="edoxaban", age=70, weight_kg=70, creatinine_mgdl=1.6, sex_female=False)
        assert d["dose"].startswith("30 mg")


class TestGRACE:
    def test_zero_to_high(self):
        s = grace_score_simplified(age_years=80, hr=110, sbp=90, creatinine=1.6,
                                   killip_class=3, cardiac_arrest=True,
                                   st_deviation=True, elevated_markers=True)
        assert s > 200
