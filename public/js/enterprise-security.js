/**
 * public/js/enterprise-security.js
 * Safe Enterprise RBAC/ABAC & Audit Hardening Module.
 * Defines roles, actions, risk levels, scope validations, and simulated audit logs.
 */

window.ROLES = {
  ADMIN: 'ADMIN',
  PHYSICIAN: 'PHYSICIAN',
  NURSE: 'NURSE',
  PHARMACIST: 'PHARMACIST',
  BILLING_OFFICER: 'BILLING_OFFICER',
  LAB_TECH: 'LAB_TECH',
  RADIOLOGY_TECH: 'RADIOLOGY_TECH',
  RECEPTIONIST: 'RECEPTIONIST',
  QUALITY_OFFICER: 'QUALITY_OFFICER',
  READ_ONLY_AUDITOR: 'READ_ONLY_AUDITOR'
};

window.SECURITY_ACTIONS = {
  VIEW_FACILITY: 'VIEW_FACILITY',
  VIEW_DEPARTMENT: 'VIEW_DEPARTMENT',
  PREVIEW_APPOINTMENT: 'PREVIEW_APPOINTMENT',
  PREVIEW_QUEUE: 'PREVIEW_QUEUE',
  PREVIEW_ENCOUNTER: 'PREVIEW_ENCOUNTER',
  PREVIEW_ORDER: 'PREVIEW_ORDER',
  PREVIEW_RESULT: 'PREVIEW_RESULT',
  PREVIEW_DOCUMENTATION: 'PREVIEW_DOCUMENTATION',
  PREVIEW_PHARMACY: 'PREVIEW_PHARMACY',
  PREVIEW_BILLING: 'PREVIEW_BILLING',
  
  // Final Actions (Always blocked in this phase)
  FINAL_BOOKING: 'FINAL_BOOKING',
  FINAL_CHECKIN: 'FINAL_CHECKIN',
  FINAL_CLINICAL_ORDER: 'FINAL_CLINICAL_ORDER',
  FINAL_SIGNATURE: 'FINAL_SIGNATURE',
  FINAL_DISPENSE: 'FINAL_DISPENSE',
  FINAL_INVOICE: 'FINAL_INVOICE',
  SUBMIT_CLAIM: 'SUBMIT_CLAIM',
  FINANCIAL_POSTING: 'FINANCIAL_POSTING'
};

window.canPreviewAction = function(role, action) {
  // Auditors and Admins can preview everything
  if (role === window.ROLES.ADMIN || role === window.ROLES.READ_ONLY_AUDITOR) {
    return true;
  }
  
  // Role-specific preview allowances
  if (action === window.SECURITY_ACTIONS.PREVIEW_BILLING && role !== window.ROLES.BILLING_OFFICER) {
    return false;
  }
  if (action === window.SECURITY_ACTIONS.PREVIEW_PHARMACY && role !== window.ROLES.PHARMACIST) {
    return false;
  }
  
  return true;
};

window.canPerformFinalAction = function(role, action) {
  // All final actions are strictly blocked in this simulation phase
  return false;
};

window.getActionRiskLevel = function(action) {
  const highRiskActions = [
    window.SECURITY_ACTIONS.FINAL_SIGNATURE,
    window.SECURITY_ACTIONS.FINAL_DISPENSE,
    window.SECURITY_ACTIONS.FINAL_INVOICE,
    window.SECURITY_ACTIONS.SUBMIT_CLAIM,
    window.SECURITY_ACTIONS.FINANCIAL_POSTING
  ];
  return highRiskActions.includes(action) ? 'high' : 'normal';
};

window.getRequiredRoleForAction = function(action) {
  switch (action) {
    case window.SECURITY_ACTIONS.PREVIEW_PHARMACY:
    case window.SECURITY_ACTIONS.FINAL_DISPENSE:
      return window.ROLES.PHARMACIST;
    case window.SECURITY_ACTIONS.PREVIEW_BILLING:
    case window.SECURITY_ACTIONS.FINAL_INVOICE:
    case window.SECURITY_ACTIONS.SUBMIT_CLAIM:
    case window.SECURITY_ACTIONS.FINANCIAL_POSTING:
      return window.ROLES.BILLING_OFFICER;
    case window.SECURITY_ACTIONS.FINAL_SIGNATURE:
      return window.ROLES.PHYSICIAN;
    default:
      return window.ROLES.READ_ONLY_AUDITOR;
  }
};

window.getHumanReviewRequirement = function(action) {
  return window.getActionRiskLevel(action) === 'high';
};

window.getDisabledFinalActionReason = function(action) {
  return 'Simulated read-only environment. Final actions require live environment authorization.';
};

window.buildAuditPreviewEvent = function(role, action, context = {}) {
  return {
    timestamp: new Date().toISOString(),
    event: 'simulated_audit_log',
    role: role,
    action: action,
    riskLevel: window.getActionRiskLevel(action),
    facility: context.facility || 'unspecified',
    department: context.department || 'unspecified',
    status: 'BLOCKED_BY_GUARD'
  };
};
