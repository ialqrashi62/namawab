/**
 * accounting_posting.js
 * ==========================================
 * محرك الترحيل المحاسبي الطبي (Medical Accounting Posting Engine) — أساس code-first.
 * دوال نقية وقابلة للاختبار تبني قيوداً متوازنة (مدين=دائن) لكل عملية طبية/مالية.
 *
 * الحالة: مكتبة أساس (غير موصولة بمسارات الإنتاج بعد). التفعيل الكامل يتطلب:
 *   (1) تعبئة شجرة الحسابات (CoA) — بيانات،
 *   (2) عمود source_type/source_id + فهرس فريد للـ idempotency — DDL،
 *   (3) ربط المسارات (invoice/receipt/...) + نشر محكوم.
 * كلها مراحل فرعية مُعتمَدة لاحقاً (انظر تقارير P1 المحاسبة).
 *
 * مبادئ:
 *  - كل قيد يجب أن يكون متوازناً: Σ debit == Σ credit (> 0).
 *  - الترحيل idempotent عبر مرجع فريد لكل مستند (source_type:source_id).
 *  - السجلات المرحَّلة (is_posted=1) لا تُعدَّل؛ التصحيح بقيد عكسي.
 *  - يُحترم tenant context (tenant_id على entries/lines).
 *  - معدل ضريبة القيمة المضافة الافتراضي 15% (السعودية)؛ الإجمالي شامل الضريبة.
 */

const VAT_RATE = 0.15;

// رموز الحسابات القياسية المتوقّعة في شجرة الحسابات (تُعبّأ عند التفعيل).
const ACCOUNT_CODES = {
    AR_PATIENT: '1100',     // ذمم مرضى مدينة
    AR_INSURANCE: '1110',   // ذمم شركات تأمين
    CASH: '1000',           // الصندوق
    BANK: '1010',           // البنك
    INVENTORY: '1200',      // المخزون
    AP_SUPPLIER: '2100',    // ذمم موردين دائنة
    VAT_PAYABLE: '2300',    // ضريبة القيمة المضافة المستحقة
    REVENUE: '4000',        // إيرادات الخدمات الطبية
    SALES_RETURNS: '4090',  // مردودات/خصومات الإيراد
    COGS: '5000',           // تكلفة المبيعات / مستلزمات طبية مستهلكة
};

function round2(n) { return Math.round((Number(n) || 0) * 100) / 100; }

// يفصل الإجمالي الشامل للضريبة إلى صافٍ + ضريبة.
function splitVatInclusive(totalInclVat) {
    const total = round2(totalInclVat);
    const net = round2(total / (1 + VAT_RATE));
    const vat = round2(total - net);
    return { total, net, vat };
}

// مرجع idempotency فريد لكل مستند.
function buildPostingReference(sourceType, sourceId) {
    return `POST:${String(sourceType).toUpperCase()}:${sourceId}`;
}

// يتحقق من توازن القيد: Σ debit == Σ credit و > 0.
function validateBalanced(lines) {
    const debit = round2(lines.reduce((s, l) => s + (Number(l.debit) || 0), 0));
    const credit = round2(lines.reduce((s, l) => s + (Number(l.credit) || 0), 0));
    return { balanced: debit === credit && debit > 0, debit, credit };
}

// ===== بناة القيود (تعيد { sourceType, sourceId, description, reference, lines:[{accountCode,debit,credit}] }) =====

// فاتورة مريض (نقدي/تأمين): Dr الذمم ، Cr الإيراد ، Cr الضريبة.
function buildPatientInvoicePosting(invoice, { insurance = false } = {}) {
    const { total, net, vat } = splitVatInclusive(invoice.total);
    const arCode = insurance ? ACCOUNT_CODES.AR_INSURANCE : ACCOUNT_CODES.AR_PATIENT;
    const lines = [
        { accountCode: arCode, debit: total, credit: 0 },
        { accountCode: ACCOUNT_CODES.REVENUE, debit: 0, credit: net },
    ];
    if (vat > 0) lines.push({ accountCode: ACCOUNT_CODES.VAT_PAYABLE, debit: 0, credit: vat });
    return { sourceType: 'invoice', sourceId: invoice.id, description: `فاتورة ${invoice.invoice_number || invoice.id}`,
        reference: buildPostingReference('invoice', invoice.id), lines };
}

// سند قبض: Dr نقد/بنك ، Cr ذمم المريض.
function buildReceiptPosting(receipt, { toBank = false } = {}) {
    const amount = round2(receipt.amount);
    return { sourceType: 'receipt', sourceId: receipt.id, description: `سند قبض ${receipt.voucher_number || receipt.id}`,
        reference: buildPostingReference('receipt', receipt.id),
        lines: [
            { accountCode: toBank ? ACCOUNT_CODES.BANK : ACCOUNT_CODES.CASH, debit: amount, credit: 0 },
            { accountCode: ACCOUNT_CODES.AR_PATIENT, debit: 0, credit: amount },
        ] };
}

// استرداد نقدي: Dr مردودات الإيراد ، Cr نقد/بنك.
function buildRefundPosting(refund, { fromBank = false } = {}) {
    const amount = round2(refund.amount);
    return { sourceType: 'refund', sourceId: refund.id, description: `استرداد ${refund.id}`,
        reference: buildPostingReference('refund', refund.id),
        lines: [
            { accountCode: ACCOUNT_CODES.SALES_RETURNS, debit: amount, credit: 0 },
            { accountCode: fromBank ? ACCOUNT_CODES.BANK : ACCOUNT_CODES.CASH, debit: 0, credit: amount },
        ] };
}

// إشعار دائن (إلغاء فاتورة): Dr مردودات/إيراد + Dr ضريبة ، Cr ذمم المريض.
function buildCreditNotePosting(creditNote) {
    const { total, net, vat } = splitVatInclusive(creditNote.total);
    const lines = [{ accountCode: ACCOUNT_CODES.SALES_RETURNS, debit: net, credit: 0 }];
    if (vat > 0) lines.push({ accountCode: ACCOUNT_CODES.VAT_PAYABLE, debit: vat, credit: 0 });
    lines.push({ accountCode: ACCOUNT_CODES.AR_PATIENT, debit: 0, credit: total });
    return { sourceType: 'credit_note', sourceId: creditNote.id, description: `إشعار دائن ${creditNote.id}`,
        reference: buildPostingReference('credit_note', creditNote.id), lines };
}

// فاتورة مورّد: Dr مخزون/مصروف ، Cr ذمم موردين.
function buildSupplierInvoicePosting(si, { toInventory = true } = {}) {
    const { total, net, vat } = splitVatInclusive(si.total);
    const lines = [{ accountCode: toInventory ? ACCOUNT_CODES.INVENTORY : ACCOUNT_CODES.COGS, debit: net, credit: 0 }];
    if (vat > 0) lines.push({ accountCode: ACCOUNT_CODES.VAT_PAYABLE, debit: vat, credit: 0 });
    lines.push({ accountCode: ACCOUNT_CODES.AP_SUPPLIER, debit: 0, credit: total });
    return { sourceType: 'supplier_invoice', sourceId: si.id, description: `فاتورة مورّد ${si.id}`,
        reference: buildPostingReference('supplier_invoice', si.id), lines };
}

// سند صرف (دفع لمورّد): Dr ذمم موردين ، Cr نقد/بنك.
function buildPaymentVoucherPosting(pv, { fromBank = false } = {}) {
    const amount = round2(pv.amount);
    return { sourceType: 'payment_voucher', sourceId: pv.id, description: `سند صرف ${pv.voucher_number || pv.id}`,
        reference: buildPostingReference('payment_voucher', pv.id),
        lines: [
            { accountCode: ACCOUNT_CODES.AP_SUPPLIER, debit: amount, credit: 0 },
            { accountCode: fromBank ? ACCOUNT_CODES.BANK : ACCOUNT_CODES.CASH, debit: 0, credit: amount },
        ] };
}

// استهلاك مخزون/صرف مستلزمات طبية: Dr تكلفة ، Cr مخزون.
function buildInventoryConsumptionPosting(consumption) {
    const amount = round2(consumption.cost_amount);
    return { sourceType: 'inventory_consumption', sourceId: consumption.id, description: `استهلاك مخزون ${consumption.id}`,
        reference: buildPostingReference('inventory_consumption', consumption.id),
        lines: [
            { accountCode: ACCOUNT_CODES.COGS, debit: amount, credit: 0 },
            { accountCode: ACCOUNT_CODES.INVENTORY, debit: 0, credit: amount },
        ] };
}

// قيد عكسي (للتصحيح): يبدّل المدين والدائن.
function buildReversalLines(lines) {
    return lines.map(l => ({ accountCode: l.accountCode, debit: round2(l.credit), credit: round2(l.debit) }));
}

module.exports = {
    VAT_RATE, ACCOUNT_CODES, round2, splitVatInclusive, buildPostingReference, validateBalanced,
    buildPatientInvoicePosting, buildReceiptPosting, buildRefundPosting, buildCreditNotePosting,
    buildSupplierInvoicePosting, buildPaymentVoucherPosting, buildInventoryConsumptionPosting, buildReversalLines,
};
