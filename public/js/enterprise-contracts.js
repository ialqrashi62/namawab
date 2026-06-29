/**
 * public/js/enterprise-contracts.js
 * Safe Enterprise Module Contracts and DTO / Schema Definitions.
 * Prepares the platform for API integration by defining read-only contracts and DTO shapes.
 */

window.CONTRACT_VERSIONS = {
  v1: '1.0.0-draft'
};

window.RESOURCE_TYPES = {
  FACILITY: 'FACILITY',
  DEPARTMENT: 'DEPARTMENT',
  APPOINTMENT: 'APPOINTMENT',
  QUEUE: 'QUEUE',
  ENCOUNTER: 'ENCOUNTER',
  ORDER: 'ORDER',
  RESULT: 'RESULT',
  DOCUMENTATION: 'DOCUMENTATION',
  PHARMACY: 'PHARMACY',
  BILLING: 'BILLING',
  AUDIT: 'AUDIT'
};

window.ENDPOINT_DRAFTS = {
  GET_FACILITIES: '/api/v1/facilities',
  GET_DEPARTMENTS: '/api/v1/departments',
  GET_QUEUE: '/api/v1/queue',
  GET_ENCOUNTERS: '/api/v1/encounters',
  GET_ORDERS: '/api/v1/clinical-orders',
  GET_RESULTS: '/api/v1/clinical-results',
  GET_PHARMACY_REVIEW: '/api/v1/clinical-pharmacy',
  GET_BILLING_PREVIEW: '/api/v1/clinical-billing',
  POST_DISABLED_FINAL_ACTION: '/api/v1/actions/finalize'
};

window.DTO_SCHEMAS = {
  FacilityDTO: {
    id: 'string',
    name_en: 'string',
    name_ar: 'string',
    type: 'string'
  },
  DepartmentDTO: {
    id: 'number',
    name_en: 'string',
    name_ar: 'string',
    facilityType: 'string'
  },
  AppointmentDTO: {
    id: 'string',
    type: 'string',
    preferredDate: 'string'
  },
  QueueItemDTO: {
    queueNo: 'string',
    type: 'string',
    status: 'string',
    priority: 'string',
    waitTimeMin: 'number',
    deptPage: 'number'
  },
  EncounterDTO: {
    id: 'string',
    patientId: 'string',
    encounterTypeId: 'string'
  },
  ClinicalOrderDTO: {
    id: 'string',
    type: 'string',
    itemCode: 'string',
    status: 'string'
  },
  ClinicalResultDTO: {
    id: 'string',
    code: 'string',
    value: 'string',
    abnormal: 'boolean'
  },
  PharmacyReviewDTO: {
    id: 'string',
    medicationCode: 'string',
    status: 'string'
  },
  BillingPreviewDTO: {
    encounterId: 'string',
    totalAmount: 'number',
    copayPercent: 'number'
  },
  AuditPreviewDTO: {
    timestamp: 'string',
    role: 'string',
    action: 'string',
    status: 'string'
  }
};

window.getContractVersion = function() {
  return window.CONTRACT_VERSIONS.v1;
};

window.getResourceContract = function(resourceType) {
  return window.DTO_SCHEMAS[`${resourceType.charAt(0) + resourceType.slice(1).toLowerCase()}DTO`] || null;
};

window.getEndpointDraft = function(actionKey) {
  return window.ENDPOINT_DRAFTS[actionKey] || null;
};

window.validateDtoShapePreview = function(dtoName, data) {
  const schema = window.DTO_SCHEMAS[dtoName];
  if (!schema) return false;
  
  // Basic structural validation
  for (const key in schema) {
    if (!data.hasOwnProperty(key)) {
      return false;
    }
  }
  return true;
};

window.isLiveEndpointEnabled = function() {
  return false;
};

window.isWriteOperationEnabled = function() {
  return false;
};
