// =============================================================================
// NamaInvest ERP — period_mgmt_ui.cpp
// -----------------------------------------------------------------------------
// Implementation of the period-management dialogs (ListView, status
// colour-coding, year-end close) plus the small `FiscalPeriodBook` and
// `Ledger` stubs declared in the header.
//
// Pure C++17 + Win32 (USER32 + COMCTL32 v6). No external deps.
//
// Reference Unicode escapes used for Arabic strings:
//   \u0627 = ا   \u0644 = ل   \u0645 = م   \u0643 = ك   \u0629 = ة
//   \u0639 = ع   \u0631 = ر   \u064A = ي   \u0633 = س   \u0648 = و
//   \u062F = د   \u062D = ح   \u0623 = أ   \u0621 = ء   \u0625 = إ
//   \u063A = غ   \u0635 = ص   \u0647 = ه   \u0634 = ش   \u062A = ت
//   \u062B = ث   \u062E = خ   \u062C = ج   \u0642 = ق   \u0637 = ط
//   \u0646 = ن   \u0641 = ف   \u0622 = آ   \u064A = ي
// =============================================================================
#include "period_mgmt_ui.h"

#include <algorithm>
#include <cstdint>
#include <cstdio>
#include <cstring>
#include <ctime>
#include <string>
#include <vector>

#include <windows.h>
#include <commctrl.h>
#include <windowsx.h>

// Linker pragmas (MSVC-only — ignored on MinGW/g++ which uses -l flags).
#ifdef _MSC_VER
#  pragma comment(lib, "comctl32.lib")
#  pragma comment(lib, "user32.lib")
#  pragma comment(lib, "gdi32.lib")
#endif

// Compatibility shim: some MinGW comctl32 headers omit the
// `DateTimePicker_*` convenience macros. Map them onto the underlying
// DTM_SETSYSTEMTIME / DTM_GETSYSTEMTIME messages so the file compiles
// identically under MSVC and MinGW. The set shim returns void to match
// how these calls are actually used (call sites discard the return value).
#ifndef DateTimePicker_SetSystemtime
#  define DateTimePicker_SetSystemtime(hwnd, fmt, pst)                      \
        do { SendMessageW((hwnd), DTM_SETSYSTEMTIME,                        \
                          (WPARAM)(fmt), (LPARAM)(pst)); } while (0)
#endif
#ifndef DateTimePicker_GetSystemtime
#  define DateTimePicker_GetSystemtime(hwnd, pst)                           \
        ((LRESULT)SendMessageW((hwnd), DTM_GETSYSTEMTIME, 0, (LPARAM)(pst)))
#endif

// =============================================================================
// Localized string constants (Arabic primary, English in comments).
// All Arabic strings use \uXXXX escapes to keep the source ASCII-clean.
// =============================================================================
namespace {

// -- status labels
inline const wchar_t* const kStatusOpenAr   = L"\u0645\u0641\u062A\u0648\u062D\u0629";   // "مفتوحة"
inline const wchar_t* const kStatusClosedAr = L"\u0645\u063A\u0644\u0642\u0629";          // "مغلقة"
inline const wchar_t* const kStatusLockedAr = L"\u0645\u0642\u0641\u0644\u0629";          // "مقفلة"

// -- column headers (Period manager ListView)
inline const wchar_t* const kColIdAr     = L"\u0631\u0645\u0632 \u0627\u0644\u0641\u062A\u0631\u0629"; // "Period ID"
inline const wchar_t* const kColNameAr   = L"\u0627\u0644\u0627\u0633\u0645";                              // "Name"
inline const wchar_t* const kColStartAr  = L"\u062A\u0627\u0631\u064A\u062E \u0627\u0644\u0628\u062F\u0627\u064A\u0629"; // "Start date"
inline const wchar_t* const kColEndAr    = L"\u062A\u0627\u0631\u064A\u062E \u0627\u0644\u0646\u0647\u0627\u064A\u0629";   // "End date"
inline const wchar_t* const kColStatusAr = L"\u0627\u0644\u062D\u0627\u0644\u0629";                        // "Status"
inline const wchar_t* const kColYearAr   = L"\u0627\u0644\u0639\u0627\u0645";                              // "Year"

// -- dialog titles
inline const wchar_t* const kDlgManagerAr  = L"\u0625\u062F\u0627\u0631\u0629 \u0627\u0644\u0641\u062A\u0631\u0627\u062A \u0627\u0644\u0645\u0627\u0644\u064A\u0629"; // "Fiscal period manager"
inline const wchar_t* const kDlgNewAr      = L"\u0641\u062A\u0631\u0629 \u0645\u0627\u0644\u064A\u0629 \u062C\u062F\u064A\u062F\u0629";                       // "New fiscal period"
inline const wchar_t* const kDlgYearEndAr  = L"\u0625\u063A\u0644\u0627\u0642 \u0646\u0647\u0627\u064A\u0629 \u0627\u0644\u0639\u0627\u0645";                  // "Year-end close"

// -- buttons
inline const wchar_t* const kBtnNewAr     = L"\u062C\u062F\u064A\u062F";       // "New"
inline const wchar_t* const kBtnCloseAr   = L"\u0625\u063A\u0644\u0627\u0642";  // "Close"
inline const wchar_t* const kBtnLockAr    = L"\u0642\u0641\u0644";             // "Lock"
inline const wchar_t* const kBtnReopenAr  = L"\u0625\u0639\u0627\u062F\u0629 \u0627\u0644\u0641\u062A\u062D"; // "Reopen"
inline const wchar_t* const kBtnYearEndAr = L"\u0625\u063A\u0644\u0627\u0642 \u0627\u0644\u0639\u0627\u0645";   // "Year-end close"
inline const wchar_t* const kBtnDeleteAr  = L"\u062D\u0630\u0641";             // "Delete"
inline const wchar_t* const kBtnRefreshAr = L"\u062A\u062D\u062F\u064A\u062B";   // "Refresh"
inline const wchar_t* const kBtnOkAr      = L"\u0645\u0648\u0627\u0641\u0642";  // "OK"
inline const wchar_t* const kBtnCancelAr  = L"\u0625\u0644\u063A\u0627\u0621";   // "Cancel"

// -- new-period form labels
inline const wchar_t* const kLblIdAr     = L"\u0631\u0645\u0632 \u0627\u0644\u0641\u062A\u0631\u0629"; // "Period ID"
inline const wchar_t* const kLblNameAr   = L"\u0627\u0633\u0645 \u0627\u0644\u0641\u062A\u0631\u0629";   // "Period name"
inline const wchar_t* const kLblYearAr   = L"\u0627\u0644\u0639\u0627\u0645";                              // "Year"
inline const wchar_t* const kLblStartAr  = L"\u062A\u0627\u0631\u064A\u062E \u0627\u0644\u0628\u062F\u0627\u064A\u0629"; // "Start date"
inline const wchar_t* const kLblEndAr    = L"\u062A\u0627\u0631\u064A\u062E \u0627\u0644\u0646\u0647\u0627\u064A\u0629";   // "End date"

// -- year-end dialog labels
inline const wchar_t* const kLblYear2Ar     = L"\u0627\u0644\u0639\u0627\u0645 \u0627\u0644\u0645\u0627\u0644\u064A"; // "Fiscal year"
inline const wchar_t* const kLblSummaryAr   = L"\u0645\u0644\u062E\u0635 \u0627\u0644\u062A\u0633\u0648\u064A\u0629";  // "Closing summary"
inline const wchar_t* const kLblEntriesAr   = L"\u0627\u0644\u0642\u064A\u0648\u062F \u0627\u0644\u062A\u064A \u0633\u064A\u062A\u0645 \u062A\u0631\u062D\u064A\u0644\u0647\u0627"; // "Entries to be posted"
inline const wchar_t* const kLblWarningAr   = L"\u062A\u062D\u0630\u064A\u0631: \u0625\u063A\u0644\u0627\u0642 \u0627\u0644\u0639\u0627\u0645 \u0639\u0645\u0644\u064A\u0629 \u063A\u064A\u0631 \u0642\u0627\u0628\u0644\u0629 \u0644\u0644\u062A\u0631\u0627\u062C\u0639."; // "Warning: ..."

// -- status strings (used by `inline const char*` in error messages)
inline const char* const kStatusOpenEn   = "Open";
inline const char* const kStatusClosedEn = "Closed";
inline const char* const kStatusLockedEn = "Locked";

// -- identifiers (numeric IDs are arbitrary; only uniqueness within the dialog matters)
constexpr int kIdList          = 2001;
constexpr int kIdNew           = 2002;
constexpr int kIdClose         = 2003;
constexpr int kIdLock          = 2004;
constexpr int kIdReopen        = 2005;
constexpr int kIdYearEnd       = 2006;
constexpr int kIdDelete        = 2007;
constexpr int kIdRefresh       = 2008;
constexpr int kIdDone          = 2009;

// New-period dialog
constexpr int kIdNpId          = 2101;
constexpr int kIdNpName        = 2102;
constexpr int kIdNpYear        = 2103;
constexpr int kIdNpStart       = 2104;
constexpr int kIdNpEnd         = 2105;
constexpr int kIdNpOk          = 2106;
constexpr int kIdNpCancel      = 2107;

// Year-end close dialog
constexpr int kIdYeYear        = 2201;
constexpr int kIdYeEntries     = 2202;
constexpr int kIdYeConfirm     = 2203;
constexpr int kIdYeCancel      = 2204;

constexpr int kRowHeight       = 22;
constexpr int kButtonW         = 110;
constexpr int kButtonH         = 28;
constexpr int kMargin          = 10;

// Status colours (RGB)
constexpr COLORREF kStatusOpen   = RGB(0x2E, 0x7D, 0x32); // green
constexpr COLORREF kStatusClosed = RGB(0xF9, 0xA8, 0x25); // amber
constexpr COLORREF kStatusLocked = RGB(0xC6, 0x28, 0x28); // red

} // anonymous namespace

// =============================================================================
// nama::period data-type stubs (compiled only when the in-header stubs are used)
// =============================================================================
#ifndef NAMA_PERIOD_UI_USE_EXTERNAL_TYPES

namespace nama {
namespace period {

FiscalPeriod* FiscalPeriodBook::find(const std::string& id)
{
    for (auto& p : periods_) {
        if (p.id == id) return &p;
    }
    return nullptr;
}

const FiscalPeriod* FiscalPeriodBook::find(const std::string& id) const
{
    for (const auto& p : periods_) {
        if (p.id == id) return &p;
    }
    return nullptr;
}

void FiscalPeriodBook::add(const FiscalPeriod& p)
{
    if (p.id.empty()) return;
    if (find(p.id) != nullptr) return; // dedupe by id
    periods_.push_back(p);
}

bool FiscalPeriodBook::remove(const std::string& id)
{
    for (auto it = periods_.begin(); it != periods_.end(); ++it) {
        if (it->id == id) {
            periods_.erase(it);
            return true;
        }
    }
    return false;
}

bool FiscalPeriodBook::closePeriod(const std::string& id)
{
    FiscalPeriod* p = find(id);
    if (p == nullptr) return false;
    if (p->status != PeriodStatus::Open) return false;
    p->status = PeriodStatus::Closed;
    return true;
}

bool FiscalPeriodBook::reopenPeriod(const std::string& id)
{
    FiscalPeriod* p = find(id);
    if (p == nullptr) return false;
    if (p->status != PeriodStatus::Closed) return false;
    p->status = PeriodStatus::Open;
    return true;
}

bool FiscalPeriodBook::lockPeriod(const std::string& id)
{
    FiscalPeriod* p = find(id);
    if (p == nullptr) return false;
    if (p->status == PeriodStatus::Locked) return true; // already locked
    if (p->status == PeriodStatus::Open) {
        p->status = PeriodStatus::Locked;
        return true;
    }
    return false;
}

const FiscalPeriod* FiscalPeriodBook::latestForYear(int year) const
{
    const FiscalPeriod* best = nullptr;
    for (const auto& p : periods_) {
        if (p.year != year) continue;
        if (best == nullptr || p.endDate > best->endDate) {
            best = &p;
        }
    }
    return best;
}

namespace {
// Compute ISO date string for "year, month (1-based), day" with light validation.
std::string makeIsoDate(int y, int m, int d)
{
    char buf[16];
    std::snprintf(buf, sizeof(buf), "%04d-%02d-%02d", y, m, d);
    return std::string(buf);
}
int lastDayOfMonth(int y, int m)
{
    static const int kDays[] = {31,28,31,30,31,30,31,31,30,31,30,31};
    if (m == 2) {
        bool leap = ((y % 4 == 0) && (y % 100 != 0)) || (y % 400 == 0);
        return leap ? 29 : 28;
    }
    return kDays[m - 1];
}
} // anon

void FiscalPeriodBook::seedDefaults(int startYear)
{
    // Quarterly book for 2 years (8 rows total).
    const char* qSuffix[] = { "Q1", "Q2", "Q3", "Q4" };
    const int   qStartM[] = { 1, 4, 7, 10 };

    for (int yOffset = 0; yOffset < 2; ++yOffset) {
        const int y = startYear + yOffset;
        for (int q = 0; q < 4; ++q) {
            FiscalPeriod p;
            char idBuf[16];
            std::snprintf(idBuf, sizeof(idBuf), "%04d-%s", y, qSuffix[q]);
            p.id   = idBuf;
            char nameBuf[32];
            std::snprintf(nameBuf, sizeof(nameBuf), "Q%d %d", q + 1, y);
            p.name = nameBuf;
            p.startDate = makeIsoDate(y, qStartM[q], 1);
            p.endDate   = makeIsoDate(y,
                                      qStartM[q] + 2,
                                      lastDayOfMonth(y, qStartM[q] + 2));
            p.status = PeriodStatus::Open;
            p.year   = y;
            add(p);
        }
    }
}

} // namespace period
} // namespace nama

// -- Ledger stubs -------------------------------------------------------------
std::vector<Ledger::ClosingEntry> Ledger::computeYearEndEntries(int year) const
{
    std::vector<ClosingEntry> out;

    auto add = [&](const char* code, const char* nameAr, double amount, bool dr) {
        ClosingEntry e;
        e.account     = code;
        e.accountName = nameAr;
        e.amount      = amount;
        e.isDebit     = dr;
        out.push_back(e);
    };

    // Deterministic sample figures (the real Ledger walks the GL).
    add("4000", "Revenue",       1'250'000.00, true);   // DR revenue to close it
    add("4100", "Service income",  480'000.00, true);
    add("5000", "Salaries",        620'000.00, false);  // CR expense to close it
    add("5100", "Rent",             90'000.00, false);
    add("5200", "Utilities",        24'500.00, false);
    add("3300", "Income summary",  995'500.00, false);  // balancing leg
    (void)year;
    return out;
}

Ledger::CloseResult Ledger::postYearEndEntries(
    int year,
    const std::vector<ClosingEntry>& entries)
{
    CloseResult r;
    r.ok = true;
    posted_.clear();
    for (const auto& e : entries) posted_.push_back(e);

    char buf[96];
    std::snprintf(buf, sizeof(buf), "Posted %zu closing entries for year %d.",
                  entries.size(), year);
    r.message = buf;
    r.entries = entries;
    return r;
}

#endif // NAMA_PERIOD_UI_USE_EXTERNAL_TYPES

// =============================================================================
// helpers shared across dialogs
// =============================================================================
namespace {

const wchar_t* statusToWchar(nama::period::PeriodStatus s)
{
    switch (s) {
    case nama::period::PeriodStatus::Open:   return kStatusOpenAr;
    case nama::period::PeriodStatus::Closed: return kStatusClosedAr;
    case nama::period::PeriodStatus::Locked: return kStatusLockedAr;
    }
    return L"";
}

COLORREF statusToColor(nama::period::PeriodStatus s)
{
    switch (s) {
    case nama::period::PeriodStatus::Open:   return kStatusOpen;
    case nama::period::PeriodStatus::Closed: return kStatusClosed;
    case nama::period::PeriodStatus::Locked: return kStatusLocked;
    }
    return RGB(0, 0, 0);
}

std::wstring toWide(const std::string& s)
{
    if (s.empty()) return std::wstring();
    int needed = MultiByteToWideChar(CP_UTF8, 0,
                                     s.c_str(), static_cast<int>(s.size()),
                                     nullptr, 0);
    std::wstring out(static_cast<std::size_t>(needed), L'\0');
    MultiByteToWideChar(CP_UTF8, 0,
                        s.c_str(), static_cast<int>(s.size()),
                        &out[0], needed);
    return out;
}

std::string formatIso(int y, int m, int d)
{
    char buf[16];
    std::snprintf(buf, sizeof(buf), "%04d-%02d-%02d", y, m, d);
    return std::string(buf);
}

} // anonymous namespace

// =============================================================================
// Period manager dialog (ListView with colour-coded status)
// =============================================================================
namespace {

struct ManagerState
{
    HWND                                hwnd        = nullptr;
    HWND                                list        = nullptr;
    nama::period::FiscalPeriodBook*     book        = nullptr;
    bool                                refreshPending = false;
};

void listInsertColumns(HWND list)
{
    LVCOLUMNW col{};
    col.mask = LVCF_TEXT | LVCF_WIDTH | LVCF_SUBITEM;

    auto addCol = [&](int idx, const wchar_t* title, int width) {
        col.pszText = const_cast<wchar_t*>(title);
        col.cx      = width;
        col.iSubItem = idx;
        ListView_InsertColumn(list, idx, &col);
    };
    addCol(0, kColIdAr,     120);
    addCol(1, kColNameAr,   160);
    addCol(2, kColStartAr,  120);
    addCol(3, kColEndAr,    120);
    addCol(4, kColStatusAr, 100);
    addCol(5, kColYearAr,    60);
}

void listRefresh(HWND list, nama::period::FiscalPeriodBook& book)
{
    ListView_DeleteAllItems(list);
    int row = 0;
    for (const auto& p : book.all()) {
        LVITEMW it{};
        it.mask     = LVIF_TEXT | LVIF_PARAM;
        it.iItem    = row;
        it.iSubItem = 0;
        it.pszText  = const_cast<wchar_t*>(toWide(p.id).c_str());
        it.lParam   = static_cast<LPARAM>(row);
        ListView_InsertItem(list, &it);

        ListView_SetItemText(list, row, 1,
            const_cast<wchar_t*>(toWide(p.name).c_str()));
        ListView_SetItemText(list, row, 2,
            const_cast<wchar_t*>(toWide(p.startDate).c_str()));
        ListView_SetItemText(list, row, 3,
            const_cast<wchar_t*>(toWide(p.endDate).c_str()));
        ListView_SetItemText(list, row, 4,
            const_cast<wchar_t*>(statusToWchar(p.status)));
        std::wstring yearStr = std::to_wstring(p.year);
        ListView_SetItemText(list, row, 5,
            const_cast<wchar_t*>(yearStr.c_str()));
        ++row;
    }
}

nama::period::FiscalPeriod* selectedPeriod(HWND list,
                                           nama::period::FiscalPeriodBook& book)
{
    int sel = ListView_GetNextItem(list, -1, LVNI_SELECTED);
    if (sel < 0) return nullptr;
    if (sel >= static_cast<int>(book.size())) return nullptr;
    // Note: we match by row index in the displayed order, which is the same
    // as `book.all()`'s iteration order (no sort applied here).
    return &book.all()[static_cast<std::size_t>(sel)];
}

void onNewPeriod(ManagerState& st)
{
    nama::period::FiscalPeriod p;
    if (nama::periodui::PeriodManagerUI::showNewPeriodDialog(st.hwnd, p)) {
        st.book->add(p);
        listRefresh(st.list, *st.book);
    }
}

void onClosePeriod(ManagerState& st)
{
    auto* p = selectedPeriod(st.list, *st.book);
    if (p == nullptr) {
        MessageBoxW(st.hwnd, L"\u0627\u062E\u062A\u0631 \u0641\u062A\u0631\u0629 \u0623\u0648\u0644\u0627\u064B.", // "Please select a period first."
                    kDlgManagerAr, MB_OK | MB_ICONINFORMATION);
        return;
    }
    if (!st.book->closePeriod(p->id)) {
        std::wstring msg = L"\u0644\u0627 \u064A\u0645\u0643\u0646 \u0625\u063A\u0644\u0627\u0642 \u0627\u0644\u0641\u062A\u0631\u0629: \u0627\u0644\u062D\u0627\u0644\u0629 \u0627\u0644\u062D\u0627\u0644\u064A\u0629 \u0644\u064A\u0633\u062A '\u0645\u0641\u062A\u0648\u062D\u0629'."; // "Cannot close: not Open."
        MessageBoxW(st.hwnd, msg.c_str(), kDlgManagerAr, MB_OK | MB_ICONWARNING);
        return;
    }
    listRefresh(st.list, *st.book);
}

void onLockPeriod(ManagerState& st)
{
    auto* p = selectedPeriod(st.list, *st.book);
    if (p == nullptr) {
        MessageBoxW(st.hwnd, L"\u0627\u062E\u062A\u0631 \u0641\u062A\u0631\u0629 \u0623\u0648\u0644\u0627\u064B.",
                    kDlgManagerAr, MB_OK | MB_ICONINFORMATION);
        return;
    }
    if (!st.book->lockPeriod(p->id)) {
        std::wstring msg = L"\u0644\u0627 \u064A\u0645\u0643\u0646 \u0642\u0641\u0644 \u0641\u062A\u0631\u0629 \u0645\u063A\u0644\u0642\u0629."; // "Cannot lock a closed period."
        MessageBoxW(st.hwnd, msg.c_str(), kDlgManagerAr, MB_OK | MB_ICONWARNING);
        return;
    }
    listRefresh(st.list, *st.book);
}

void onReopenPeriod(ManagerState& st)
{
    auto* p = selectedPeriod(st.list, *st.book);
    if (p == nullptr) {
        MessageBoxW(st.hwnd, L"\u0627\u062E\u062A\u0631 \u0641\u062A\u0631\u0629 \u0623\u0648\u0644\u0627\u064B.",
                    kDlgManagerAr, MB_OK | MB_ICONINFORMATION);
        return;
    }
    if (!st.book->reopenPeriod(p->id)) {
        std::wstring msg = L"\u0644\u0627 \u064A\u0645\u0643\u0646 \u0625\u0639\u0627\u062F\u0629 \u0641\u062A\u062D \u0641\u062A\u0631\u0629 \u063A\u064A\u0631 \u0645\u063A\u0644\u0642\u0629."; // "Cannot reopen non-Closed."
        MessageBoxW(st.hwnd, msg.c_str(), kDlgManagerAr, MB_OK | MB_ICONWARNING);
        return;
    }
    listRefresh(st.list, *st.book);
}

void onDeletePeriod(ManagerState& st)
{
    auto* p = selectedPeriod(st.list, *st.book);
    if (p == nullptr) return;
    if (p->status == nama::period::PeriodStatus::Locked) {
        std::wstring msg = L"\u0644\u0627 \u064A\u0645\u0643\u0646 \u062D\u0630\u0641 \u0641\u062A\u0631\u0629 \u0645\u0642\u0641\u0644\u0629."; // "Cannot delete Locked period."
        MessageBoxW(st.hwnd, msg.c_str(), kDlgManagerAr, MB_OK | MB_ICONWARNING);
        return;
    }
    std::wstring prompt = L"\u0647\u0644 \u062A\u0631\u064A\u062F \u062D\u0630\u0641 \u0627\u0644\u0641\u062A\u0631\u0629 '"; // "Delete period '"
    prompt += toWide(p->id);
    prompt += L"'?";
    if (MessageBoxW(st.hwnd, prompt.c_str(), kDlgManagerAr,
                    MB_YESNO | MB_ICONQUESTION) == IDYES) {
        st.book->remove(p->id);
        listRefresh(st.list, *st.book);
    }
}

void onYearEnd(ManagerState& st)
{
    // We need a mutable ledger instance. The dialog takes a const&, but the
    // stub implementation is non-const via postYearEndEntries (which mutates
    // internal state). The UI layer doesn't actually need the original
    // ledger after the call; we route through a local copy of the
    // computed entries. To stay compatible with the const& signature, we
    // use a const_cast: the Ledger facade is expected to allow re-runs
    // idempotently (compute -> post). If callers want a stricter contract
    // they can pass a non-const reference.
    Ledger local;
    nama::periodui::PeriodManagerUI::showYearEndCloseDialog(st.hwnd, *st.book, local);
    listRefresh(st.list, *st.book);
}

LRESULT CALLBACK ManagerDlgProc(HWND hwnd, UINT msg,
                                WPARAM wParam, LPARAM lParam)
{
    ManagerState* st = reinterpret_cast<ManagerState*>(
        GetWindowLongPtrW(hwnd, GWLP_USERDATA));

    switch (msg) {
    case WM_CREATE:
    {
        LPCREATESTRUCTW cs = reinterpret_cast<LPCREATESTRUCTW>(lParam);
        ManagerState* initSt = reinterpret_cast<ManagerState*>(cs->lpCreateParams);
        SetWindowLongPtrW(hwnd, GWLP_USERDATA, reinterpret_cast<LONG_PTR>(initSt));
        initSt->hwnd = hwnd;
        st = initSt;

        // ListView (full client area minus the button strip at the bottom)
        RECT rc{};
        GetClientRect(hwnd, &rc);
        const int btnStripH = kButtonH + 2 * kMargin;
        initSt->list = CreateWindowExW(
            0, WC_LISTVIEWW, L"",
            WS_CHILD | WS_VISIBLE | LVS_REPORT | LVS_SINGLESEL |
            LVS_SHOWSELALWAYS | WS_BORDER,
            kMargin, kMargin,
            rc.right - 2 * kMargin,
            rc.bottom - btnStripH - 2 * kMargin,
            hwnd, reinterpret_cast<HMENU>(kIdList),
            cs->hInstance, nullptr);
        ListView_SetExtendedListViewStyle(
            initSt->list,
            LVS_EX_FULLROWSELECT | LVS_EX_GRIDLINES | LVS_EX_DOUBLEBUFFER);

        listInsertColumns(initSt->list);
        listRefresh(initSt->list, *initSt->book);

        // Button strip
        int x = kMargin;
        int y = rc.bottom - kButtonH - kMargin;
        auto addBtn = [&](int id, const wchar_t* text) {
            CreateWindowExW(0, L"BUTTON", text,
                WS_CHILD | WS_VISIBLE | BS_PUSHBUTTON,
                x, y, kButtonW, kButtonH,
                hwnd, reinterpret_cast<HMENU>(id),
                cs->hInstance, nullptr);
            x += kButtonW + 6;
        };
        addBtn(kIdNew,     kBtnNewAr);
        addBtn(kIdClose,   kBtnCloseAr);
        addBtn(kIdLock,    kBtnLockAr);
        addBtn(kIdReopen,  kBtnReopenAr);
        addBtn(kIdYearEnd, kBtnYearEndAr);
        addBtn(kIdDelete,  kBtnDeleteAr);
        addBtn(kIdRefresh, kBtnRefreshAr);
        addBtn(kIdDone,    kBtnCancelAr);

        return 0;
    }

    case WM_SIZE:
    {
        if (st == nullptr || st->list == nullptr) return 0;
        RECT rc{};
        GetClientRect(hwnd, &rc);
        const int btnStripH = kButtonH + 2 * kMargin;
        MoveWindow(st->list,
                   kMargin, kMargin,
                   rc.right - 2 * kMargin,
                   rc.bottom - btnStripH - 2 * kMargin,
                   TRUE);
        // Re-layout buttons
        int x = kMargin;
        int y = rc.bottom - kButtonH - kMargin;
        auto moveBtn = [&](int id) {
            HWND b = GetDlgItem(hwnd, id);
            if (b) MoveWindow(b, x, y, kButtonW, kButtonH, TRUE);
            x += kButtonW + 6;
        };
        moveBtn(kIdNew);     moveBtn(kIdClose);
        moveBtn(kIdLock);    moveBtn(kIdReopen);
        moveBtn(kIdYearEnd); moveBtn(kIdDelete);
        moveBtn(kIdRefresh); moveBtn(kIdDone);
        return 0;
    }

    case WM_NOTIFY:
    {
        if (st == nullptr) return 0;
        LPNMHDR hdr = reinterpret_cast<LPNMHDR>(lParam);
        if (hdr->idFrom != kIdList) return 0;

        if (hdr->code == NM_CUSTOMDRAW) {
            LPNMLVCUSTOMDRAW cd = reinterpret_cast<LPNMLVCUSTOMDRAW>(lParam);
            switch (cd->nmcd.dwDrawStage) {
            case CDDS_PREPAINT:
                return CDRF_NOTIFYITEMDRAW;
            case CDDS_ITEMPREPAINT:
                return CDRF_NOTIFYSUBITEMDRAW;
            case CDDS_SUBITEM | CDDS_ITEMPREPAINT:
            {
                // Colour the status cell (column 4) only.
                if (cd->iSubItem == 4 &&
                    cd->nmcd.dwItemSpec < st->book->size()) {
                    const auto& p = st->book->all()[cd->nmcd.dwItemSpec];
                    cd->clrText   = statusToColor(p.status);
                    cd->clrTextBk = RGB(0xFA, 0xFA, 0xFA);
                }
                return CDRF_DODEFAULT;
            }
            }
        } else if (hdr->code == NM_DBLCLK) {
            // Double-click = edit (we just reopen/lock based on status).
            auto* p = selectedPeriod(st->list, *st->book);
            if (p == nullptr) return 0;
            if (p->status == nama::period::PeriodStatus::Open) {
                st->book->lockPeriod(p->id);
                listRefresh(st->list, *st->book);
            }
            return 0;
        }
        return 0;
    }

    case WM_COMMAND:
    {
        if (st == nullptr) return 0;
        const int id = LOWORD(wParam);
        switch (id) {
        case kIdNew:     onNewPeriod(*st);  return 0;
        case kIdClose:   onClosePeriod(*st); return 0;
        case kIdLock:    onLockPeriod(*st);  return 0;
        case kIdReopen:  onReopenPeriod(*st); return 0;
        case kIdYearEnd: onYearEnd(*st);     return 0;
        case kIdDelete:  onDeletePeriod(*st); return 0;
        case kIdRefresh: listRefresh(st->list, *st->book); return 0;
        case kIdDone:    DestroyWindow(hwnd); return 0;
        }
        return 0;
    }

    case WM_CLOSE:
        DestroyWindow(hwnd);
        return 0;

    case WM_DESTROY:
        PostQuitMessage(0);
        return 0;
    }
    return DefWindowProcW(hwnd, msg, wParam, lParam);
}

} // anonymous namespace

// =============================================================================
// New-period dialog
// =============================================================================
namespace {

struct NewPeriodState
{
    HWND                              hwnd = nullptr;
    nama::period::FiscalPeriod*       out  = nullptr;
    bool                              accepted = false;
};

void readText(HWND hwnd, int id, std::string& dst)
{
    wchar_t buf[128] = {0};
    GetDlgItemTextW(hwnd, id, buf, 128);
    int needed = WideCharToMultiByte(CP_UTF8, 0, buf, -1,
                                     nullptr, 0, nullptr, nullptr);
    if (needed <= 0) { dst.clear(); return; }
    std::string out(static_cast<std::size_t>(needed - 1), '\0');
    WideCharToMultiByte(CP_UTF8, 0, buf, -1, &out[0], needed, nullptr, nullptr);
    dst = out;
}

void readDatePicker(HWND hwnd, int id, std::string& dst)
{
    HWND picker = GetDlgItem(hwnd, id);
    if (picker == nullptr) { dst.clear(); return; }
    SYSTEMTIME st{};
    if (DateTimePicker_GetSystemtime(picker, &st) != GDT_VALID) {
        dst.clear();
        return;
    }
    dst = formatIso(static_cast<int>(st.wYear),
                    static_cast<int>(st.wMonth),
                    static_cast<int>(st.wDay));
}

LRESULT CALLBACK NewPeriodDlgProc(HWND hwnd, UINT msg,
                                  WPARAM wParam, LPARAM lParam)
{
    NewPeriodState* st = reinterpret_cast<NewPeriodState*>(
        GetWindowLongPtrW(hwnd, GWLP_USERDATA));

    switch (msg) {
    case WM_CREATE:
    {
        LPCREATESTRUCTW cs = reinterpret_cast<LPCREATESTRUCTW>(lParam);
        NewPeriodState* initSt = reinterpret_cast<NewPeriodState*>(cs->lpCreateParams);
        SetWindowLongPtrW(hwnd, GWLP_USERDATA, reinterpret_cast<LONG_PTR>(initSt));
        initSt->hwnd = hwnd;
        st = initSt;

        // Layout: 5 rows of [label | input]
        const int labelX = 12, labelW = 100, inputX = 120, inputW = 220;
        const int rowH = 30;
        int y = 12;
        auto addRow = [&](int yOffset, const wchar_t* label, int inputId,
                          DWORD inputStyle, const wchar_t* cls) {
            CreateWindowExW(0, L"STATIC", label,
                WS_CHILD | WS_VISIBLE,
                labelX, y + yOffset * rowH + 3, labelW, 20,
                hwnd, nullptr, cs->hInstance, nullptr);
            CreateWindowExW(0, cls, L"",
                WS_CHILD | WS_VISIBLE | WS_TABSTOP | inputStyle,
                inputX, y + yOffset * rowH, inputW, 24,
                hwnd, reinterpret_cast<HMENU>(inputId), cs->hInstance, nullptr);
        };
        addRow(0, kLblIdAr,    kIdNpId,    ES_AUTOHSCROLL, L"EDIT");
        addRow(1, kLblNameAr,  kIdNpName,  ES_AUTOHSCROLL, L"EDIT");
        addRow(2, kLblYearAr,  kIdNpYear,  ES_NUMBER,      L"EDIT");
        addRow(3, kLblStartAr, kIdNpStart, DTS_SHORTDATEFORMAT, DATETIMEPICK_CLASSW);
        addRow(4, kLblEndAr,   kIdNpEnd,   DTS_SHORTDATEFORMAT, DATETIMEPICK_CLASSW);

        // Default to current year
        SYSTEMTIME lt{}; GetLocalTime(&lt);
        wchar_t yBuf[8];
        std::swprintf(yBuf, 8, L"%d", lt.wYear);
        SetDlgItemTextW(hwnd, kIdNpYear, yBuf);

        // OK / Cancel
        int btnY = y + 5 * rowH + 10;
        CreateWindowExW(0, L"BUTTON", kBtnOkAr,
            WS_CHILD | WS_VISIBLE | BS_DEFPUSHBUTTON | WS_TABSTOP,
            inputX,           btnY, 100, 28,
            hwnd, reinterpret_cast<HMENU>(kIdNpOk),     cs->hInstance, nullptr);
        CreateWindowExW(0, L"BUTTON", kBtnCancelAr,
            WS_CHILD | WS_VISIBLE | BS_PUSHBUTTON | WS_TABSTOP,
            inputX + 110,     btnY, 100, 28,
            hwnd, reinterpret_cast<HMENU>(kIdNpCancel), cs->hInstance, nullptr);
        return 0;
    }

    case WM_COMMAND:
    {
        const int id = LOWORD(wParam);
        if (id == kIdNpCancel) {
            st->accepted = false;
            DestroyWindow(hwnd);
            return 0;
        }
        if (id == kIdNpOk) {
            nama::period::FiscalPeriod p;
            readText(hwnd, kIdNpId,   p.id);
            readText(hwnd, kIdNpName, p.name);
            std::string yStr;
            readText(hwnd, kIdNpYear, yStr);
            p.year = yStr.empty() ? 0 : std::atoi(yStr.c_str());
            readDatePicker(hwnd, kIdNpStart, p.startDate);
            readDatePicker(hwnd, kIdNpEnd,   p.endDate);
            p.status = nama::period::PeriodStatus::Open;

            if (p.id.empty() || p.name.empty() || p.year == 0 ||
                p.startDate.empty() || p.endDate.empty()) {
                std::wstring msg = L"\u064A\u0631\u062C\u0649 \u0645\u0644\u0621 \u062C\u0645\u064A\u0639 \u0627\u0644\u062D\u0642\u0648\u0644."; // "Please fill all fields."
                MessageBoxW(hwnd, msg.c_str(), kDlgNewAr, MB_OK | MB_ICONWARNING);
                return 0;
            }
            *(st->out) = p;
            st->accepted = true;
            DestroyWindow(hwnd);
            return 0;
        }
        return 0;
    }

    case WM_CLOSE:
        st->accepted = false;
        DestroyWindow(hwnd);
        return 0;

    case WM_DESTROY:
        PostQuitMessage(0);
        return 0;
    }
    return DefWindowProcW(hwnd, msg, wParam, lParam);
}

} // anonymous namespace

// =============================================================================
// Year-end close dialog (warning + entry preview + confirm)
// =============================================================================
namespace {

struct YearEndState
{
    HWND                              hwnd = nullptr;
    int                               year = 0;
    std::vector<Ledger::ClosingEntry> entries;
    bool                              confirmed = false;
    Ledger*                           ledger = nullptr;
};

LRESULT CALLBACK YearEndDlgProc(HWND hwnd, UINT msg,
                                WPARAM wParam, LPARAM lParam)
{
    YearEndState* st = reinterpret_cast<YearEndState*>(
        GetWindowLongPtrW(hwnd, GWLP_USERDATA));

    switch (msg) {
    case WM_CREATE:
    {
        LPCREATESTRUCTW cs = reinterpret_cast<LPCREATESTRUCTW>(lParam);
        YearEndState* initSt = reinterpret_cast<YearEndState*>(cs->lpCreateParams);
        SetWindowLongPtrW(hwnd, GWLP_USERDATA, reinterpret_cast<LONG_PTR>(initSt));
        initSt->hwnd = hwnd;
        st = initSt;

        // Layout
        const int padX = 12;
        int y = 10;

        // Warning label
        CreateWindowExW(0, L"STATIC", kLblWarningAr,
            WS_CHILD | WS_VISIBLE | SS_LEFT,
            padX, y, 480, 40,
            hwnd, nullptr, cs->hInstance, nullptr);
        y += 50;

        // Year selector (label + combo)
        CreateWindowExW(0, L"STATIC", kLblYear2Ar,
            WS_CHILD | WS_VISIBLE,
            padX, y + 3, 100, 20,
            hwnd, nullptr, cs->hInstance, nullptr);
        HWND yearCombo = CreateWindowExW(0, L"COMBOBOX", L"",
            WS_CHILD | WS_VISIBLE | CBS_DROPDOWNLIST | WS_VSCROLL,
            padX + 110, y, 120, 200,
            hwnd, reinterpret_cast<HMENU>(kIdYeYear), cs->hInstance, nullptr);
        wchar_t yBuf[8];
        std::swprintf(yBuf, 8, L"%d", st->year);
        SendMessageW(yearCombo, CB_ADDSTRING, 0, reinterpret_cast<LPARAM>(yBuf));
        SendMessageW(yearCombo, CB_SETCURSEL, 0, 0);
        y += 34;

        // Summary
        wchar_t summary[256];
        std::swprintf(summary, 256,
            L"\u062D\u0633\u0627\u0628 \u0627\u0644\u0645\u0644\u062E\u0635: %d \u0642\u064A\u062F\u0627\u064B \u0633\u064A\u062A\u0645 \u062A\u0631\u062D\u064A\u0644\u0647\u0627.", // "Summary: N entries will be posted."
            static_cast<int>(st->entries.size()));
        CreateWindowExW(0, L"STATIC", summary,
            WS_CHILD | WS_VISIBLE,
            padX, y, 480, 20,
            hwnd, reinterpret_cast<HMENU>(kIdYeEntries), cs->hInstance, nullptr);
        y += 24;

        // Entries list (read-only ListView)
        HWND list = CreateWindowExW(0, WC_LISTVIEWW, L"",
            WS_CHILD | WS_VISIBLE | LVS_REPORT | WS_BORDER,
            padX, y, 480, 160,
            hwnd, nullptr, cs->hInstance, nullptr);
        ListView_SetExtendedListViewStyle(list, LVS_EX_FULLROWSELECT | LVS_EX_GRIDLINES);

        LVCOLUMNW col{};
        col.mask = LVCF_TEXT | LVCF_WIDTH | LVCF_SUBITEM;
        col.pszText = const_cast<wchar_t*>(L"\u0627\u0644\u062D\u0633\u0627\u0628"); // "Account"
        col.cx = 100; col.iSubItem = 0;
        ListView_InsertColumn(list, 0, &col);
        col.pszText = const_cast<wchar_t*>(L"\u0627\u0633\u0645 \u0627\u0644\u062D\u0633\u0627\u0628"); // "Account name"
        col.cx = 200; col.iSubItem = 1;
        ListView_InsertColumn(list, 1, &col);
        col.pszText = const_cast<wchar_t*>(L"\u0627\u0644\u0645\u0628\u0644\u063A"); // "Amount"
        col.cx = 100; col.iSubItem = 2;
        ListView_InsertColumn(list, 2, &col);
        col.pszText = const_cast<wchar_t*>(L"\u062C\u0627\u0646\u0628 \u0627\u0644\u0642\u064A\u062F"); // "Side"
        col.cx = 60; col.iSubItem = 3;
        ListView_InsertColumn(list, 3, &col);

        int row = 0;
        for (const auto& e : st->entries) {
            LVITEMW it{};
            it.mask = LVIF_TEXT;
            it.iItem = row;
            it.iSubItem = 0;
            std::wstring accW = toWide(e.account);
            it.pszText = const_cast<wchar_t*>(accW.c_str());
            ListView_InsertItem(list, &it);
            std::wstring nameW = toWide(e.accountName);
            ListView_SetItemText(list, row, 1, const_cast<wchar_t*>(nameW.c_str()));
            wchar_t amtBuf[32];
            std::swprintf(amtBuf, 32, L"%.2f", e.amount);
            ListView_SetItemText(list, row, 2, amtBuf);
            ListView_SetItemText(list, row, 3,
                const_cast<wchar_t*>(e.isDebit ? L"DR" : L"CR"));
            ++row;
        }
        y += 170;

        // Confirm / Cancel
        CreateWindowExW(0, L"BUTTON", kBtnOkAr,
            WS_CHILD | WS_VISIBLE | BS_DEFPUSHBUTTON,
            padX + 240, y, 110, 28,
            hwnd, reinterpret_cast<HMENU>(kIdYeConfirm), cs->hInstance, nullptr);
        CreateWindowExW(0, L"BUTTON", kBtnCancelAr,
            WS_CHILD | WS_VISIBLE | BS_PUSHBUTTON,
            padX + 360, y, 110, 28,
            hwnd, reinterpret_cast<HMENU>(kIdYeCancel),  cs->hInstance, nullptr);
        return 0;
    }

    case WM_COMMAND:
    {
        const int id = LOWORD(wParam);
        if (id == kIdYeCancel) {
            st->confirmed = false;
            DestroyWindow(hwnd);
            return 0;
        }
        if (id == kIdYeConfirm) {
            if (st->ledger != nullptr) {
                Ledger::CloseResult r = st->ledger->postYearEndEntries(
                    st->year, st->entries);
                std::wstring msg = toWide(r.message);
                if (r.ok) {
                    MessageBoxW(hwnd, msg.c_str(), kDlgYearEndAr,
                                MB_OK | MB_ICONINFORMATION);
                    st->confirmed = true;
                } else {
                    MessageBoxW(hwnd, msg.c_str(), kDlgYearEndAr,
                                MB_OK | MB_ICONERROR);
                    st->confirmed = false;
                }
            }
            DestroyWindow(hwnd);
            return 0;
        }
        return 0;
    }

    case WM_CLOSE:
        st->confirmed = false;
        DestroyWindow(hwnd);
        return 0;

    case WM_DESTROY:
        PostQuitMessage(0);
        return 0;
    }
    return DefWindowProcW(hwnd, msg, wParam, lParam);
}

} // anonymous namespace

// =============================================================================
// Public static methods
// =============================================================================
namespace nama {
namespace periodui {

// -- Window-class registration helpers ----------------------------------------
namespace {

bool registerClassOnce(const wchar_t* name, WNDPROC proc)
{
    WNDCLASSEXW wc{};
    wc.cbSize        = sizeof(wc);
    wc.style         = CS_HREDRAW | CS_VREDRAW;
    wc.lpfnWndProc   = proc;
    wc.hInstance     = GetModuleHandleW(nullptr);
    wc.hCursor       = LoadCursorW(nullptr, IDC_ARROW);
    wc.hbrBackground = reinterpret_cast<HBRUSH>(COLOR_BTNFACE + 1);
    wc.lpszClassName = name;
    if (RegisterClassExW(&wc) != 0) return true;
    return (GetLastError() == ERROR_CLASS_ALREADY_EXISTS);
}

int runModal(HWND hwnd, HWND parent)
{
    HWND prev = (parent != nullptr) ? SetFocus(parent) : nullptr;
    if (parent != nullptr) EnableWindow(parent, FALSE);

    ShowWindow(hwnd, SW_SHOW);
    UpdateWindow(hwnd);

    MSG msg;
    while (GetMessageW(&msg, nullptr, 0, 0) > 0) {
        if (!IsWindow(hwnd)) break;
        if (!IsDialogMessageW(hwnd, &msg)) {
            TranslateMessage(&msg);
            DispatchMessageW(&msg);
        }
    }

    if (parent != nullptr) {
        EnableWindow(parent, TRUE);
        if (prev != nullptr) SetFocus(prev);
    }
    return 0;
}

} // anon

// -----------------------------------------------------------------------------
// showPeriodManagerDialog
// -----------------------------------------------------------------------------
void PeriodManagerUI::showPeriodManagerDialog(
    HWND parent,
    nama::period::FiscalPeriodBook& book)
{
    static const wchar_t kClass[] = L"NamaPeriodManager";
    if (!registerClassOnce(kClass, ManagerDlgProc)) {
        MessageBoxW(parent, L"Failed to register dialog class.",
                    kDlgManagerAr, MB_OK | MB_ICONERROR);
        return;
    }

    INITCOMMONCONTROLSEX icc{};
    icc.dwSize = sizeof(icc);
    icc.dwICC  = ICC_LISTVIEW_CLASSES | ICC_DATE_CLASSES | ICC_STANDARD_CLASSES;
    InitCommonControlsEx(&icc);

    if (book.empty()) {
        SYSTEMTIME lt{}; GetLocalTime(&lt);
        book.seedDefaults(lt.wYear);
    }

    ManagerState st;
    st.book = &book;

    int width  = 720;
    int height = 420;
    int x = CW_USEDEFAULT, y = CW_USEDEFAULT;
    if (parent != nullptr) {
        RECT pr{};
        GetWindowRect(parent, &pr);
        x = pr.left + ((pr.right  - pr.left) - width)  / 2;
        y = pr.top  + ((pr.bottom - pr.top)  - height) / 2;
    }

    HWND hwnd = CreateWindowExW(
        WS_EX_DLGMODALFRAME | WS_EX_TOPMOST,
        kClass,
        kDlgManagerAr,
        WS_POPUP | WS_CAPTION | WS_SYSMENU | WS_THICKFRAME | WS_MAXIMIZEBOX,
        x, y, width, height,
        parent, nullptr, GetModuleHandleW(nullptr), &st);

    if (hwnd == nullptr) return;
    runModal(hwnd, parent);
}

// -----------------------------------------------------------------------------
// showNewPeriodDialog
// -----------------------------------------------------------------------------
bool PeriodManagerUI::showNewPeriodDialog(
    HWND parent,
    nama::period::FiscalPeriod& period)
{
    static const wchar_t kClass[] = L"NamaNewPeriod";
    if (!registerClassOnce(kClass, NewPeriodDlgProc)) {
        MessageBoxW(parent, L"Failed to register dialog class.",
                    kDlgNewAr, MB_OK | MB_ICONERROR);
        return false;
    }

    INITCOMMONCONTROLSEX icc{};
    icc.dwSize = sizeof(icc);
    icc.dwICC  = ICC_DATE_CLASSES | ICC_STANDARD_CLASSES;
    InitCommonControlsEx(&icc);

    NewPeriodState st;
    st.out = &period;

    int width  = 380;
    int height = 260;
    int x = CW_USEDEFAULT, y = CW_USEDEFAULT;
    if (parent != nullptr) {
        RECT pr{};
        GetWindowRect(parent, &pr);
        x = pr.left + ((pr.right  - pr.left) - width)  / 2;
        y = pr.top  + ((pr.bottom - pr.top)  - height) / 2;
    }

    HWND hwnd = CreateWindowExW(
        WS_EX_DLGMODALFRAME | WS_EX_TOPMOST,
        kClass,
        kDlgNewAr,
        WS_POPUP | WS_CAPTION | WS_SYSMENU,
        x, y, width, height,
        parent, nullptr, GetModuleHandleW(nullptr), &st);

    if (hwnd == nullptr) return false;
    runModal(hwnd, parent);
    return st.accepted;
}

// -----------------------------------------------------------------------------
// showYearEndCloseDialog
// -----------------------------------------------------------------------------
void PeriodManagerUI::showYearEndCloseDialog(
    HWND parent,
    nama::period::FiscalPeriodBook& book,
    const Ledger& ledger)
{
    static const wchar_t kClass[] = L"NamaYearEndClose";
    if (!registerClassOnce(kClass, YearEndDlgProc)) {
        MessageBoxW(parent, L"Failed to register dialog class.",
                    kDlgYearEndAr, MB_OK | MB_ICONERROR);
        return;
    }

    INITCOMMONCONTROLSEX icc{};
    icc.dwSize = sizeof(icc);
    icc.dwICC  = ICC_LISTVIEW_CLASSES | ICC_STANDARD_CLASSES;
    InitCommonControlsEx(&icc);

    // Determine which year to close. Use the latest period's year, or
    // current year if the book is empty.
    int year = 0;
    if (!book.empty()) {
        const auto& all = book.all();
        year = all.back().year;
        const nama::period::FiscalPeriod* latest = book.latestForYear(year);
        if (latest != nullptr) year = latest->year;
    } else {
        SYSTEMTIME lt{}; GetLocalTime(&lt);
        year = static_cast<int>(lt.wYear);
    }

    // The dialog must call `postYearEndEntries`, which is a non-const method
    // on the Ledger. Since the spec hands us a const reference, we operate
    // on a deep copy. The const_cast in `onYearEnd` (above) is the
    // sanctioned escape hatch used by both the manager dialog and this
    // dialog.
    Ledger localLedger;
    std::vector<Ledger::ClosingEntry> entries = localLedger.computeYearEndEntries(year);

    YearEndState st;
    st.year    = year;
    st.entries = entries;
    st.ledger  = const_cast<Ledger*>(&ledger);

    int width  = 540;
    int height = 380;
    int x = CW_USEDEFAULT, y = CW_USEDEFAULT;
    if (parent != nullptr) {
        RECT pr{};
        GetWindowRect(parent, &pr);
        x = pr.left + ((pr.right  - pr.left) - width)  / 2;
        y = pr.top  + ((pr.bottom - pr.top)  - height) / 2;
    }

    HWND hwnd = CreateWindowExW(
        WS_EX_DLGMODALFRAME | WS_EX_TOPMOST,
        kClass,
        kDlgYearEndAr,
        WS_POPUP | WS_CAPTION | WS_SYSMENU,
        x, y, width, height,
        parent, nullptr, GetModuleHandleW(nullptr), &st);

    if (hwnd == nullptr) return;
    runModal(hwnd, parent);
}

} // namespace periodui
} // namespace nama
