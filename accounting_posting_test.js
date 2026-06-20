/**
 * accounting_posting_test.js
 * ==========================================
 * اختبار محرك الترحيل المحاسبي (دوال نقية، بلا قاعدة بيانات).
 * يثبت: قيود متوازنة لكل عملية، فصل الضريبة، مرجع idempotency فريد، والقيد العكسي.
 *
 * الاستخدام: node accounting_posting_test.js
 */
const A = require('./accounting_posting');
const RED='\x1b[31m',GREEN='\x1b[32m',BLUE='\x1b[34m',RESET='\x1b[0m',BOLD='\x1b[1m';
let passed=0,failed=0; const failures=[];
function assert(c,n,d=''){ if(c){console.log(`  ${GREEN}✅ PASS${RESET} — ${n}`);passed++;} else {console.log(`  ${RED}❌ FAIL${RESET} — ${n}${d?' | '+d:''}`);failed++;failures.push(n);} }

console.log(`\n${BOLD}${BLUE}===== Medical Accounting Posting Engine Test =====${RESET}\n`);

// 1) فصل الضريبة (إجمالي شامل 115 → صافي 100 + ضريبة 15)
console.log(`${BOLD}[1] فصل الضريبة${RESET}`);
const sp = A.splitVatInclusive(115);
assert(sp.net === 100 && sp.vat === 15 && sp.total === 115, 'splitVatInclusive(115) = {net:100, vat:15}', JSON.stringify(sp));

// 2) فاتورة مريض نقدية متوازنة + حسابات صحيحة
console.log(`\n${BOLD}[2] فاتورة مريض${RESET}`);
const inv = A.buildPatientInvoicePosting({ id: 1, invoice_number: 'INV-2026-00001', total: 115 });
let b = A.validateBalanced(inv.lines);
assert(b.balanced && b.debit === 115, 'فاتورة نقدية متوازنة (مدين 115)', JSON.stringify(b));
assert(inv.lines.find(l=>l.accountCode===A.ACCOUNT_CODES.AR_PATIENT && l.debit===115), 'Dr ذمم مريض 115');
assert(inv.lines.find(l=>l.accountCode===A.ACCOUNT_CODES.REVENUE && l.credit===100), 'Cr إيراد 100');
assert(inv.lines.find(l=>l.accountCode===A.ACCOUNT_CODES.VAT_PAYABLE && l.credit===15), 'Cr ضريبة 15');
const invIns = A.buildPatientInvoicePosting({ id: 2, total: 115 }, { insurance: true });
assert(invIns.lines.find(l=>l.accountCode===A.ACCOUNT_CODES.AR_INSURANCE && l.debit===115), 'فاتورة تأمين → Dr ذمم تأمين');

// 3) سند قبض يقلّل الذمم
console.log(`\n${BOLD}[3] سند قبض${RESET}`);
const rc = A.buildReceiptPosting({ id: 5, amount: 50 });
b = A.validateBalanced(rc.lines);
assert(b.balanced && b.debit===50, 'سند قبض متوازن (50)');
assert(rc.lines.find(l=>l.accountCode===A.ACCOUNT_CODES.CASH && l.debit===50), 'Dr نقد 50');
assert(rc.lines.find(l=>l.accountCode===A.ACCOUNT_CODES.AR_PATIENT && l.credit===50), 'Cr ذمم مريض 50 (تقليل الذمم)');

// 4) استرداد + إشعار دائن
console.log(`\n${BOLD}[4] استرداد/إشعار دائن${RESET}`);
const rf = A.buildRefundPosting({ id: 7, amount: 30 });
assert(A.validateBalanced(rf.lines).balanced, 'استرداد متوازن');
assert(rf.lines.find(l=>l.accountCode===A.ACCOUNT_CODES.CASH && l.credit===30), 'استرداد: Cr نقد 30');
const cn = A.buildCreditNotePosting({ id: 9, total: 115 });
b = A.validateBalanced(cn.lines);
assert(b.balanced && b.debit===115, 'إشعار دائن متوازن (يعكس الفاتورة)');
assert(cn.lines.find(l=>l.accountCode===A.ACCOUNT_CODES.AR_PATIENT && l.credit===115), 'إشعار دائن: Cr ذمم مريض 115');

// 5) فاتورة مورّد + سند صرف
console.log(`\n${BOLD}[5] فاتورة مورّد/سند صرف${RESET}`);
const si = A.buildSupplierInvoicePosting({ id: 11, total: 115 });
b = A.validateBalanced(si.lines);
assert(b.balanced && b.credit===115, 'فاتورة مورّد متوازنة (Cr ذمم موردين 115)');
assert(si.lines.find(l=>l.accountCode===A.ACCOUNT_CODES.INVENTORY && l.debit===100), 'فاتورة مورّد: Dr مخزون 100');
assert(si.lines.find(l=>l.accountCode===A.ACCOUNT_CODES.AP_SUPPLIER && l.credit===115), 'فاتورة مورّد: Cr ذمم موردين 115');
const pv = A.buildPaymentVoucherPosting({ id: 12, amount: 115 });
assert(pv.lines.find(l=>l.accountCode===A.ACCOUNT_CODES.AP_SUPPLIER && l.debit===115) && A.validateBalanced(pv.lines).balanced, 'سند صرف: Dr ذمم موردين 115');

// 6) استهلاك مخزون
console.log(`\n${BOLD}[6] استهلاك مخزون${RESET}`);
const ic = A.buildInventoryConsumptionPosting({ id: 20, cost_amount: 40 });
b = A.validateBalanced(ic.lines);
assert(b.balanced, 'استهلاك مخزون متوازن');
assert(ic.lines.find(l=>l.accountCode===A.ACCOUNT_CODES.COGS && l.debit===40), 'استهلاك: Dr تكلفة 40');
assert(ic.lines.find(l=>l.accountCode===A.ACCOUNT_CODES.INVENTORY && l.credit===40), 'استهلاك: Cr مخزون 40');

// 7) idempotency reference فريد لكل مستند
console.log(`\n${BOLD}[7] مرجع idempotency${RESET}`);
assert(A.buildPostingReference('invoice', 1) === 'POST:INVOICE:1', 'مرجع فاتورة 1');
assert(A.buildPostingReference('invoice', 1) === A.buildPostingReference('invoice', 1), 'نفس المستند → نفس المرجع (يمنع التكرار)');
assert(A.buildPostingReference('invoice', 1) !== A.buildPostingReference('invoice', 2), 'مستندان مختلفان → مرجعان مختلفان');
assert(inv.reference === 'POST:INVOICE:1', 'بانية الفاتورة تُضمّن المرجع');

// 8) قيد عكسي (تصحيح)
console.log(`\n${BOLD}[8] قيد عكسي${RESET}`);
const rev = A.buildReversalLines(inv.lines);
assert(A.validateBalanced(rev).balanced, 'القيد العكسي متوازن');
assert(rev.find(l=>l.accountCode===A.ACCOUNT_CODES.AR_PATIENT && l.credit===115), 'العكس يبدّل: ذمم مريض تصبح دائنة');

// 9) رفض غير المتوازن
console.log(`\n${BOLD}[9] رفض غير المتوازن${RESET}`);
assert(!A.validateBalanced([{accountCode:'1100',debit:100,credit:0},{accountCode:'4000',debit:0,credit:90}]).balanced, 'قيد غير متوازن (100≠90) مرفوض');
assert(!A.validateBalanced([{accountCode:'1100',debit:0,credit:0}]).balanced, 'قيد صفري مرفوض');

console.log(`\n${BOLD}${BLUE}النتيجة: ${GREEN}${passed} PASS${RESET} | ${failed?RED:GREEN}${failed} FAIL${RESET}\n`);
if (failed) { failures.forEach(f=>console.log(`${RED} - ${f}${RESET}`)); process.exit(1); }
process.exit(0);
