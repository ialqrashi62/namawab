# 01_clinical_spec.md - Advanced Radiology Specifications
**Expert: Chief Medical Officer (CMO)**

## 1. Scope of Radiology Ecosystem
High-precision medical imaging and interventional radiology.

### Specialized Units:
- **Diagnostic Radiology:** X-Ray, Ultrasound, and general reporting.
- **Interventional Radiology:** Angiography, Embolization, and Tumor Ablation.
- **CT Scan:** Dual Energy CT, Cardiac CT, and Angiography.
- **MRI:** fMRI, Spectroscopy, DTI, and MRA/MRV.
- **Nuclear Medicine:** PET-CT, PET-MRI, and Radioisotope Therapy.

## 2. Clinical Protocols & KPIs
- **Imaging Workflow:** Order $\rightarrow$ Scheduling $\rightarrow$ Acquisition $\rightarrow$ Interpretation $\rightarrow$ Report.
- **KPIs:** Turnaround Time (TAT) for critical reports, Radiation dose (ALARA), and Diagnostic accuracy.
- **Required Data:** DICOM metadata, Contrast agent volume, and Radiation dose (mSv).

## 3. Compliance
- **JCI:** Strict adherence to radiation safety and contrast allergy screening.
- **PDPL:** Extreme encryption for DICOM images stored in `phi_vault/`.
