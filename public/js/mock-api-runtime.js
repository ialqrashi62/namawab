/**
 * public/js/mock-api-runtime.js
 * =============================================================================
 * Local Mock API Runtime Prototype for NamaMedical.
 * Provides a 100% read-only, client-side mock runtime for enterprise modules.
 * Strictly decoupled from any real database, external network, or staging/production servers.
 * =============================================================================
 */

(function() {
  const root = typeof window !== 'undefined' ? window : (global.window || {});

  // 1. Core Flags & Config
  root.mockApiRuntimeEnabled = true;
  root.liveApiRuntimeEnabled = false;
  root.writeRuntimeEnabled = false;

  root.supportedResources = [
    'facilities',
    'departments',
    'appointments',
    'queue',
    'encounters',
    'clinical-orders',
    'clinical-results',
    'clinical-pharmacy',
    'clinical-billing',
    'audit-events'
  ];

  // 2. Mock Data Store (Purely synthetic, 100% compliant with enterprise DTO contracts, zero PHI)
  root.MOCK_DATA_STORE = {
    facilities: [
      { id: 'FAC-001', name_en: 'Al-Faisal Medical City', name_ar: 'مدينة الفيصل الطبية', type: 'HOSPITAL' },
      { id: 'FAC-002', name_en: 'Nama Outpatient Clinic', name_ar: 'عيادات نما الخارجية', type: 'CLINIC' }
    ],
    departments: [
      { id: 101, name_en: 'Cardiology Clinic', name_ar: 'عيادة القلب والأوعية الدموية', facilityType: 'HOSPITAL' },
      { id: 102, name_en: 'Radiology Imaging Unit', name_ar: 'وحدة الأشعة والتصوير الطبي', facilityType: 'HOSPITAL' },
      { id: 103, name_en: 'Main Pharmacy', name_ar: 'الصيدلية الرئيسية', facilityType: 'HOSPITAL' }
    ],
    appointments: [
      { id: 'APT-9901', type: 'CARDIOLOGY', preferredDate: '2026-07-01T10:00:00Z' },
      { id: 'APT-9902', type: 'RADIOLOGY', preferredDate: '2026-07-01T11:30:00Z' }
    ],
    queue: [
      { queueNo: 'C-01', type: 'CLINIC', status: 'WAITING', priority: 'NORMAL', waitTimeMin: 15, deptPage: 101 },
      { queueNo: 'R-02', type: 'RADIOLOGY', status: 'ACTIVE', priority: 'URGENT', waitTimeMin: 5, deptPage: 102 }
    ],
    encounters: [
      { id: 'ENC-2026-001', patientId: 'PAT-MOCK-8801', encounterTypeId: 'OPD_CONSULTATION' },
      { id: 'ENC-2026-002', patientId: 'PAT-MOCK-8802', encounterTypeId: 'IPD_ADMISSION' }
    ],
    'clinical-orders': [
      { id: 'ORD-5501', type: 'LABORATORY', itemCode: 'CBC_TEST', status: 'PENDING' },
      { id: 'ORD-5502', type: 'RADIOLOGY', itemCode: 'CHEST_XRAY', status: 'COMPLETED' }
    ],
    'clinical-results': [
      { id: 'RES-3301', code: 'WBC_COUNT', value: '7.5 x10^9/L', abnormal: false },
      { id: 'RES-3302', code: 'HEMOGLOBIN', value: '11.2 g/dL', abnormal: true }
    ],
    'clinical-pharmacy': [
      { id: 'RX-7701', medicationCode: 'AMOXICILLIN_500MG', status: 'REVIEWED' },
      { id: 'RX-7702', medicationCode: 'WARFARIN_5MG', status: 'HOLD_INTERACTION_RISK' }
    ],
    'clinical-billing': [
      { encounterId: 'ENC-2026-001', totalAmount: 150.00, copayPercent: 20 },
      { encounterId: 'ENC-2026-002', totalAmount: 2500.00, copayPercent: 10 }
    ],
    'audit-events': [
      { timestamp: '2026-06-30T04:00:00Z', role: 'PHYSICIAN', action: 'READ_CLINICAL_RECORD', status: 'SUCCESS' },
      { timestamp: '2026-06-30T04:15:00Z', role: 'PHARMACIST', action: 'REVIEW_MEDICATION', status: 'SUCCESS' }
    ]
  };

  // 3. Safety Assertion Helpers
  root.assertNoWriteOperation = function(action) {
    const upperAction = (action || '').toUpperCase();
    if (['POST', 'PUT', 'DELETE', 'PATCH', 'WRITE', 'FINALIZE', 'DISPENSE', 'SUBMIT'].includes(upperAction)) {
      throw new Error('WRITE_OPERATION_DISABLED: Cannot perform write/final actions in local mock runtime.');
    }
  };

  root.assertNoLiveEndpoint = function(endpoint) {
    if (root.isLiveEndpointEnabled && root.isLiveEndpointEnabled()) {
      throw new Error('SECURITY_VIOLATION: Live endpoints must remain disabled.');
    }
    const isLiveUrl = /(http|https):\/\/(?!localhost|127\.0\.0\.1)/i.test(endpoint || '');
    if (isLiveUrl) {
      throw new Error('SECURITY_VIOLATION: Production or external URLs are strictly forbidden in this local mock runtime.');
    }
  };

  root.assertNoPhiPayload = function(payload) {
    if (!payload) return;
    const phiKeys = ['ssn', 'nationalid', 'iqama', 'phone', 'patientname', 'realname', 'creditcard'];
    const jsonStr = JSON.stringify(payload).toLowerCase();
    for (const key of phiKeys) {
      if (jsonStr.includes(`"${key}"`)) {
        throw new Error('SECURITY_VIOLATION: PHI payload or sensitive personal data is strictly forbidden in this mock runtime.');
      }
    }
  };

  // 4. Core Query & Router Simulation
  root.validateMockRequestScope = function(resource, action) {
    if (!root.supportedResources.includes(resource)) {
      return { valid: false, reason: 'RESOURCE_NOT_SUPPORTED' };
    }
    try {
      root.assertNoWriteOperation(action);
      return { valid: true };
    } catch (err) {
      return { valid: false, reason: 'WRITE_OPERATION_DISABLED', message: err.message };
    }
  };

  root.buildReadOnlyResponse = function(resource, data) {
    return {
      status: 'SUCCESS',
      source: 'LOCAL_MOCK_API_RUNTIME',
      timestamp: new Date().toISOString(),
      resource: resource,
      count: Array.isArray(data) ? data.length : 1,
      data: data
    };
  };

  root.buildErrorResponse = function(status, reason, message) {
    return {
      status: status || 'ERROR',
      source: 'LOCAL_MOCK_API_RUNTIME',
      timestamp: new Date().toISOString(),
      reason: reason || 'UNKNOWN_ERROR',
      message: message || 'An error occurred.'
    };
  };

  root.getMockAuditPreview = function(resource, action, userRole) {
    return {
      timestamp: new Date().toISOString(),
      role: userRole || 'GUEST',
      action: `${action || 'READ'}_${(resource || '').toUpperCase()}`,
      status: 'MOCK_AUDITED'
    };
  };

  root.getMockApiResponse = function(resource, params = {}) {
    const action = params.action || 'GET';
    const endpoint = params.endpoint || `/api/v1/${resource}`;
    
    // Safety boundaries check
    root.assertNoLiveEndpoint(endpoint);
    if (params.payload) {
      root.assertNoPhiPayload(params.payload);
    }

    const scope = root.validateMockRequestScope(resource, action);
    if (!scope.valid) {
      return root.buildErrorResponse('BLOCKED', scope.reason, scope.message);
    }

    const data = root.MOCK_DATA_STORE[resource];
    if (!data) {
      return root.buildErrorResponse('NOT_FOUND', 'RESOURCE_NOT_FOUND', `Resource ${resource} has no mock data.`);
    }

    // Attempt DTO shape validation if enterprise-contracts.js is loaded
    if (root.validateDtoShapePreview && root.getResourceContract) {
      // Find DTO name based on resource mapping
      const dtoMap = {
        facilities: 'FacilityDTO',
        departments: 'DepartmentDTO',
        appointments: 'AppointmentDTO',
        queue: 'QueueItemDTO',
        encounters: 'EncounterDTO',
        'clinical-orders': 'ClinicalOrderDTO',
        'clinical-results': 'ClinicalResultDTO',
        'clinical-pharmacy': 'PharmacyReviewDTO',
        'clinical-billing': 'BillingPreviewDTO',
        'audit-events': 'AuditPreviewDTO'
      };
      
      const dtoName = dtoMap[resource];
      if (dtoName) {
        const items = Array.isArray(data) ? data : [data];
        for (const item of items) {
          const isValid = root.validateDtoShapePreview(dtoName, item);
          if (!isValid) {
            return root.buildErrorResponse(
              'CONTRACT_VIOLATION',
              'DTO_SHAPE_MISMATCH',
              `Mock data item in ${resource} does not match the contract DTO: ${dtoName}`
            );
          }
        }
      }
    }

    return root.buildReadOnlyResponse(resource, data);
  };

  // Expose to Node.js if applicable
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = root;
  }
})();
