/**
 * public/js/facility-catalog.js
 * Static Facility Catalog and Helper Functions for Multi-Facility Platform.
 */

window.FACILITY_CATALOG = {
  medical_cities: [
    { id: 1, name_en: 'King Fahad Medical City', name_ar: 'مدينة الملك فهد الطبية', region: 'Riyadh' },
    { id: 2, name_en: 'King Abdullah Medical City', name_ar: 'مدينة الملك عبدالله الطبية', region: 'Makkah' }
  ],
  facilities: [
    { id: 101, city_id: 1, type: 'medical_city', name_en: 'KFMC Main Campus', name_ar: 'حرم مدينة الملك فهد الطبية الرئيسي', status: 'Active', deptsCount: 45, desc: 'Central medical city with advanced tertiary care.' },
    { id: 102, city_id: 1, type: 'general_hospital', name_en: 'KFMC General Hospital', name_ar: 'مستشفى مدينة الملك فهد العام', status: 'Active', deptsCount: 28, desc: 'General hospital serving emergency and surgery.' },
    { id: 103, city_id: 1, type: 'polyclinic', name_en: 'Sulaimaniyah Complex', name_ar: 'مجمع السليمانية الطبي', status: 'Active', deptsCount: 15, desc: 'Outpatient polyclinic with primary care.' },
    { id: 104, city_id: 1, type: 'health_unit', name_en: 'Olaya Primary Care Unit', name_ar: 'وحدة الرعاية الصحية بالعليا', status: 'Active', deptsCount: 6, desc: 'Basic primary care and vaccinations.' },
    { id: 201, city_id: 2, type: 'specialized_hospital', name_en: 'KAMC Oncology Center', name_ar: 'مركز الأورام بمدينة الملك عبدالله', status: 'Active', deptsCount: 20, desc: 'Cancer treatment and research center.' }
  ]
};

window.getFacilitiesByMedicalCity = function(cityId) {
  return window.FACILITY_CATALOG.facilities.filter(f => f.city_id === cityId);
};

window.getDepartmentsByFacilityType = function(type) {
  // Returns list of departments enabled for a given facility type
  const map = {
    medical_city: null,
    general_hospital: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 30, 33, 34, 42],
    polyclinic: [0, 1, 2, 3, 4, 6, 8, 9, 13, 14, 15, 20, 34, 42],
    phc: [0, 1, 2, 3, 4, 6, 14, 15, 33, 34],
    health_unit: [0, 1, 2, 3, 14, 15, 33]
  };
  return map[type] !== undefined ? map[type] : map.general_hospital;
};
