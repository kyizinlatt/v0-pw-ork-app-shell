/**
 * PWORK — Single source of truth for all UI text labels, messages, and copy.
 *
 * All button labels, status labels, tooltips, and action text live here.
 * Import from this file rather than hardcoding strings in components.
 */

// ---------------------------------------------------------------------------
// CASE ACTION LABELS
// These map directly to getAvailableTransitions() actions in status-badge.tsx
// ---------------------------------------------------------------------------
export const CASE_ACTION_LABELS = {
  // RECEIVE → CHECKING
  START_CHECKING: "Start Checking",

  // CHECKING → SUBMITTED
  SEND_TO_PARTNER: "Send to Partner",
  COMPLETE_NO_PARTNER: "Complete (No Partner)",
  REJECT_CASE: "Reject Case",

  // SUBMITTED → WORKING
  CONFIRM_PARTNER_START: "Confirm Partner Start",
  RETURN_TO_CHECKING: "Return to Checking",

  // WORKING (PARTNER actions)
  MARK_COMPLETE: "Mark as Complete",
  RETURN_TO_PWIN: "Return to PWIN",
  REJECT_BLOCK: "Reject / Block",

  // WORKING (PWIN recall)
  RECALL_FROM_PARTNER: "Recall from Partner",

  // DONE → PUBLISH
  REVIEW_AND_PUBLISH: "Review & Publish",
  RETURN_TO_PARTNER: "Return to Partner",

  // PUBLISH
  SET_AWAITING_PICKUP: "Set Awaiting Pickup",
  START_DELIVERY: "Start Delivery",
  CLOSE_CASE: "Close Case",
  UNPUBLISH: "Unpublish",

  // AWAITING_PICKUP
  PROCESS_FINAL_DOC: "Process Final Doc Request",
  CLOSE_EXPIRED: "Close (Expired)",

  // DELIVERY
  CONFIRM_DELIVERED: "Confirm Delivered",

  // CLOSED
  REOPEN_CASE: "Reopen Case",
} as const

// ---------------------------------------------------------------------------
// CASE STATUS LABELS  (mirrors STATUS_CONFIG but as a standalone map)
// ---------------------------------------------------------------------------
export const STATUS_LABELS = {
  RECEIVE: "Received",
  CHECKING: "Checking",
  SUBMITTED: "Sent to Partner",
  WORKING: "Partner Working",
  DONE: "Partner Complete",
  PUBLISH: "Published",
  AWAITING_PICKUP: "Awaiting Pickup",
  DELIVERY: "Delivery",
  CLOSED: "Closed",
} as const

// ---------------------------------------------------------------------------
// FLOW OWNER LABELS
// ---------------------------------------------------------------------------
export const FLOW_OWNER_LABELS = {
  PWIN: "PWIN",
  PARTNER: "Partner",
  SYSTEM: "System",
  CUSTOMER: "Customer",
} as const

// ---------------------------------------------------------------------------
// SECTION / CARD TITLES  (used in drawers, detail pages)
// ---------------------------------------------------------------------------
export const SECTION_TITLES = {
  CUSTOMER: "Customer",
  SERVICE_AND_SLA: "Service & SLA",
  ACTIONS: "Actions",
  PWIN_STAFF: "PWIN Staff",
  PARTNER_STAFF: "Partner Staff",
  INTERNAL_NOTES: "Block Notes",
  TIMELINE: "Timeline",
  MESSAGES: "Messages",
  DOCUMENTS: "Documents",
  FINANCE: "Finance",
  QUICK_INFO: "Quick Info",
} as const

// ---------------------------------------------------------------------------
// TABLE COLUMN HEADERS
// ---------------------------------------------------------------------------
export const TABLE_HEADERS = {
  CASE_NUMBER: "Case No.",
  CUSTOMER: "Customer",
  SERVICE: "Service",
  STATUS: "Status",
  SLA_DUE: "SLA Due",
  PWIN_STAFF: "PWIN Staff",
  PARTNER_STAFF: "Partner Staff",
  CREATED: "Created",
  ACTIONS: "",
} as const

// ---------------------------------------------------------------------------
// QUEUE / TAB LABELS
// ---------------------------------------------------------------------------
export const QUEUE_LABELS = {
  ALL: "All Cases",
  PWIN_QUEUE: "PWIN Queue",
  PARTNER_QUEUE: "Partner Queue",
} as const

// ---------------------------------------------------------------------------
// CRITICAL ISSUE TOOLTIPS
// ---------------------------------------------------------------------------
export const CRITICAL_TOOLTIPS = {
  SLA_WARNING: "SLA deadline is approaching — action required",
  SLA_OVERDUE: "SLA deadline has passed — case is overdue",
  NO_PARTNER_ASSIGNED: "No partner has been assigned to this case",
  BLOCKED: "Case is blocked — requires attention",
  PAYMENT_PENDING: "Payment is pending — case cannot proceed",
  MISSING_DOCUMENTS: "Required documents are missing",
  AWAITING_CUSTOMER: "Awaiting customer response or documents",
} as const

// ---------------------------------------------------------------------------
// FORM LABELS & PLACEHOLDERS
// ---------------------------------------------------------------------------
export const FORM_LABELS = {
  // Branch
  BRANCH_CODE: "Branch Code",
  BRANCH_NAME: "Branch Name",
  BRANCH_LOCATION: "Location",
  BRANCH_STATUS: "Status",

  // Service Type
  SERVICE_CODE: "Service Code",
  SERVICE_NAME: "Service Name",
  SERVICE_DESCRIPTION: "Description",
  SERVICE_SLA_DAYS: "SLA Days",
  SERVICE_PRICE: "Price (THB)",
  SERVICE_STATUS: "Status",

  // Partner
  PARTNER_NAME: "Partner Name",
  PARTNER_CODE: "Partner Code",
  PARTNER_CONTACT: "Contact Person",
  PARTNER_PHONE: "Phone",
  PARTNER_EMAIL: "Email",
  PARTNER_STATUS: "Status",

  // User
  USER_NAME: "Full Name",
  USER_EMAIL: "Email",
  USER_ROLE: "Role",
  USER_ORG: "Organization",
  USER_STATUS: "Status",
  USER_PASSWORD: "Password",
} as const

export const FORM_PLACEHOLDERS = {
  BRANCH_CODE: "e.g. HQ, BKK",
  BRANCH_NAME: "e.g. Bangkok HQ",
  SERVICE_CODE: "e.g. KS, WP, 90D",
  SERVICE_NAME: "e.g. Kyant Sal",
  PARTNER_CODE: "e.g. PTR001",
  SEARCH: "Search...",
  REASON: "Enter reason for this action...",
  NOTES: "Add internal notes...",
} as const

// ---------------------------------------------------------------------------
// BUTTON LABELS  (general UI)
// ---------------------------------------------------------------------------
export const BTN = {
  ADD: "Add",
  EDIT: "Edit",
  DELETE: "Delete",
  SAVE: "Save",
  CANCEL: "Cancel",
  CONFIRM: "Confirm",
  CLOSE: "Close",
  SEARCH: "Search",
  EXPORT: "Export",
  IMPORT: "Import",
  FILTER: "Filter",
  RESET: "Reset",
  VIEW: "View",
  CREATE: "Create",
  SUBMIT: "Submit",
  BACK: "Back",
  NEXT: "Next",
} as const

// ---------------------------------------------------------------------------
// EMPTY STATES
// ---------------------------------------------------------------------------
export const EMPTY_STATE = {
  NO_CASES: "No cases found",
  NO_BRANCHES: "No branches yet",
  NO_SERVICE_TYPES: "No service types yet",
  NO_PARTNERS: "No partners yet",
  NO_USERS: "No users yet",
  NO_RESULTS: "No results match your search",
  NO_DOCUMENTS: "No documents uploaded",
  NO_MESSAGES: "No messages yet",
} as const

// ---------------------------------------------------------------------------
// ROLE LABELS
// ---------------------------------------------------------------------------
export const ROLE_LABELS = {
  SUPER_ADMIN: "Super Admin",
  HQ_ADMIN: "HQ Admin",
  BRANCH_ADMIN: "Branch Admin",
  STAFF: "Staff",
  PARTNER_ADMIN: "Partner Admin",
  PARTNER_STAFF: "Partner Staff",
} as const

export const ORG_TYPE_LABELS = {
  PWIN_HQ: "PWIN HQ",
  PWIN_BRANCH: "PWIN Branch",
  PARTNER: "Partner",
} as const
