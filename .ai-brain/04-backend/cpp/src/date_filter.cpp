// =============================================================================
// NamaInvest ERP — date_filter.cpp
// -----------------------------------------------------------------------------
// Implementation of the date-filter helpers and the modal date-range picker
// dialog. Pure C++17 + Win32 (USER32 + COMCTL32 v6). No external deps.
//
// Reference Unicode escapes used for any Arabic strings below:
//   \u0627 = ا   \u0644 = ل   \u0645 = م   \u0643 = ك   \u0629 = ة
//   \u0639 = ع   \u0631 = ر   \u064A = ي   \u0633 = س   \u0648 = و
//   \u062F = د   \u062D = ح   \u0623 = أ   \u0621 = ء   \u0625 = إ
//   \u063A = غ   \u0635 = ص   \u0647 = ه   \u0634 = ش   \u062A = ت
//   \u062B = ث   \u062E = خ   \u062C = ج   \u0642 = ق   \u0637 = ط
//   \u0646 = ن   \u0641 = ف   \u0622 = آ   \u064A = ي
// =============================================================================
#include "date_filter.h"

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
// identically under MSVC and MinGW. The shim returns void to match how
// these calls are actually used (call sites discard the return value).
#ifndef DateTimePicker_SetSystemtime
#  define DateTimePicker_SetSystemtime(hwnd, fmt, pst)                      \
        do { SendMessageW((hwnd), DTM_SETSYSTEMTIME,                        \
                          (WPARAM)(fmt), (LPARAM)(pst)); } while (0)
#endif
#ifndef DateTimePicker_GetSystemtime
#  define DateTimePicker_GetSystemtime(hwnd, pst)                           \
        ((LRESULT)SendMessageW((hwnd), DTM_GETSYSTEMTIME, 0, (LPARAM)(pst)))
#endif

namespace nama {
namespace datefilter {

// =============================================================================
// Localized preset labels. English is the canonical form; Arabic mirrors are
// provided as \uXXXX so the source file stays pure ASCII.
// =============================================================================
namespace {

// English labels (also used as the canonical preset IDs for applyPreset).
inline const char* const kPresetTodayEn      = "Today";
inline const char* const kPresetThisWeekEn   = "This Week";
inline const char* const kPresetThisMonthEn  = "This Month";
inline const char* const kPresetThisQtrEn    = "This Quarter";
inline const char* const kPresetThisYearEn   = "This Year";
inline const char* const kPresetLast30En     = "Last 30 Days";
inline const char* const kPresetLast90En     = "Last 90 Days";
inline const char* const kPresetYtdEn        = "YTD";

// Arabic mirrors (used by the dialog labels and the combo box).
inline const wchar_t* const kPresetTodayAr =
    L"\u0627\u0644\u064A\u0648\u0645";
inline const wchar_t* const kPresetThisWeekAr =
    L"\u0647\u0630\u0627 \u0627\u0644\u0623\u0633\u0628\u0648\u0639";
inline const wchar_t* const kPresetThisMonthAr =
    L"\u0647\u0630\u0627 \u0627\u0644\u0634\u0647\u0631";
inline const wchar_t* const kPresetThisQtrAr =
    L"\u0647\u0630\u0627 \u0627\u0644\u0631\u0628\u0639";
inline const wchar_t* const kPresetThisYearAr =
    L"\u0647\u0630\u0627 \u0627\u0644\u0639\u0627\u0645";
inline const wchar_t* const kPresetLast30Ar =
    L"\u0622\u062E\u0631 30 \u064A\u0648\u0645";
inline const wchar_t* const kPresetLast90Ar =
    L"\u0622\u062E\u0631 90 \u064A\u0648\u0645";
inline const wchar_t* const kPresetYtdAr =
    L"\u0645\u0646\u0630 \u0628\u062F\u0627\u064A\u0629 \u0627\u0644\u0639\u0627\u0645";

// Dialog label strings (Arabic primary, English fallback in comments).
inline const wchar_t* const kLblFromAr  = L"\u0645\u0646 \u0627\u0644\u062A\u0627\u0631\u064A\u062E"; // "From date"
inline const wchar_t* const kLblToAr    = L"\u0625\u0644\u0649 \u0627\u0644\u062A\u0627\u0631\u064A\u062E";   // "To date"
inline const wchar_t* const kLblPresetAr= L"\u0641\u062A\u0631\u0629 \u062C\u0627\u0647\u0632\u0629";   // "Quick preset"
inline const wchar_t* const kBtnOkAr    = L"\u0645\u0648\u0627\u0641\u0642";                            // "OK"
inline const wchar_t* const kBtnCancelAr= L"\u0625\u0644\u063A\u0627\u0621";                            // "Cancel"
inline const wchar_t* const kBtnApplyAr = L"\u062A\u0637\u0628\u064A\u0642";                            // "Apply"
inline const wchar_t* const kDlgTitleAr = L"\u0627\u062E\u062A\u064A\u0627\u0631 \u0627\u0644\u0641\u062A\u0631\u0629"; // "Pick date range"

constexpr int kIdOk              = 1001;
constexpr int kIdCancel          = 1002;
constexpr int kIdApply           = 1003;
constexpr int kIdFrom            = 1004;
constexpr int kIdTo              = 1005;
constexpr int kIdPreset          = 1006;
constexpr int kIdFromLabel       = 1007;
constexpr int kIdToLabel         = 1008;
constexpr int kIdPresetLabel     = 1009;

constexpr int kPickerHeight      = 24;
constexpr int kLabelHeight       = 18;
constexpr int kMargin            = 12;
constexpr int kButtonWidth       = 90;
constexpr int kButtonHeight      = 28;
constexpr int kPickerWidth       = 160;
constexpr int kPresetWidth       = 200;
constexpr int kDialogMinWidth    = 360;
constexpr int kDialogMinHeight   = 220;

} // anonymous namespace

// =============================================================================
// Low-level conversions
// =============================================================================

bool DateFilter::parseIsoDate(const std::string& iso,
                              int& year, int& month, int& day)
{
    if (iso.size() != 10) return false;
    if (iso[4] != '-' || iso[7] != '-') return false;
    for (int i : {0, 1, 2, 3, 5, 6, 8, 9}) {
        if (iso[i] < '0' || iso[i] > '9') return false;
    }

    char buf[5] = { iso[0], iso[1], iso[2], iso[3], 0 };
    year  = std::atoi(buf);
    buf[0] = iso[5]; buf[1] = iso[6]; buf[2] = 0;
    month = std::atoi(buf);
    buf[0] = iso[8]; buf[1] = iso[9]; buf[2] = 0;
    day   = std::atoi(buf);

    if (year  < 1900 || year  > 9999) return false;
    if (month < 1    || month > 12)   return false;
    if (day   < 1    || day   > 31)   return false;
    return true;
}

std::string DateFilter::formatIsoDate(int year, int mon, int day)
{
    char buf[16];
    std::snprintf(buf, sizeof(buf), "%04d-%02d-%02d", year, mon + 1, day);
    return std::string(buf);
}

// =============================================================================
// getCurrentDate / addDays / month / year helpers
// =============================================================================

std::string DateFilter::getCurrentDate()
{
    std::time_t now = std::time(nullptr);
    std::tm     t{};
#if defined(_WIN32)
    localtime_s(&t, &now);
#else
    t = *std::localtime(&now);
#endif
    return formatIsoDate(1900 + t.tm_year, t.tm_mon, t.tm_mday);
}

std::string DateFilter::addDays(const std::string& date, int days)
{
    int y = 0, m = 0, d = 0;
    if (!parseIsoDate(date, y, m, d)) {
        return std::string();
    }

    std::tm t{};
    t.tm_year = y - 1900;
    t.tm_mon  = m - 1;
    t.tm_mday = d;
    t.tm_hour = 12;             // noon avoids DST edge cases when normalised
    t.tm_isdst = -1;            // let mktime decide

    std::time_t tt = std::mktime(&t);
    if (tt == static_cast<std::time_t>(-1)) {
        return std::string();
    }

    // 86400 seconds = 1 day. We use this constant rather than a chrono-based
    // path because mktime already accounts for local DST; adding whole days
    // is safe as long as we normalise at the end.
    static const std::time_t kSecondsPerDay = 86400;
    tt += static_cast<std::time_t>(days) * kSecondsPerDay;

    std::tm out{};
#if defined(_WIN32)
    localtime_s(&out, &tt);
#else
    out = *std::localtime(&tt);
#endif
    return formatIsoDate(1900 + out.tm_year, out.tm_mon, out.tm_mday);
}

std::string DateFilter::getFirstDayOfMonth(int year, int month)
{
    if (month < 1) month = 1;
    if (month > 12) month = 12;
    if (year < 1900) year = 1900;
    if (year > 9999) year = 9999;
    return formatIsoDate(year, month - 1, 1);
}

std::string DateFilter::getLastDayOfMonth(int year, int month)
{
    if (month < 1) month = 1;
    if (month > 12) month = 12;
    if (year < 1900) year = 1900;
    if (year > 9999) year = 9999;

    // Day 0 of next month = last day of this month (mktime normalises).
    std::tm t{};
    t.tm_year = year - 1900;
    t.tm_mon  = month;     // month is 0-based, so `month` here = next month
    t.tm_mday = 0;         // 0 -> last day of previous month
    t.tm_hour = 12;
    t.tm_isdst = -1;
    std::time_t tt = std::mktime(&t);
    if (tt == static_cast<std::time_t>(-1)) {
        return std::string();
    }
    std::tm out{};
#if defined(_WIN32)
    localtime_s(&out, &tt);
#else
    out = *std::localtime(&tt);
#endif
    return formatIsoDate(1900 + out.tm_year, out.tm_mon, out.tm_mday);
}

std::string DateFilter::getStartOfYear(int year)
{
    if (year < 1900) year = 1900;
    if (year > 9999) year = 9999;
    return formatIsoDate(year, 0, 1);
}

std::string DateFilter::getEndOfYear(int year)
{
    if (year < 1900) year = 1900;
    if (year > 9999) year = 9999;
    return formatIsoDate(year, 11, 31);
}

// =============================================================================
// isInRange
// =============================================================================

bool DateFilter::isInRange(const std::string& date, const DateRange& range)
{
    if (date.empty()) return false;
    if (!range.fromDate.empty() && date < range.fromDate)  return false;
    if (!range.toDate.empty()   && date > range.toDate)    return false;
    return true;
}

// =============================================================================
// quickPresets / applyPreset
// =============================================================================

std::vector<std::string> DateFilter::quickPresets()
{
    return {
        std::string(kPresetTodayEn),
        std::string(kPresetThisWeekEn),
        std::string(kPresetThisMonthEn),
        std::string(kPresetThisQtrEn),
        std::string(kPresetThisYearEn),
        std::string(kPresetLast30En),
        std::string(kPresetLast90En),
        std::string(kPresetYtdEn)
    };
}

DateRange DateFilter::applyPreset(int presetIndex)
{
    DateRange r;
    const std::string today = getCurrentDate();
    int y = 0, m = 0, d = 0;
    if (!parseIsoDate(today, y, m, d)) {
        return r; // empty
    }

    // Compute "now" components in a tm for convenience.
    std::time_t now = std::time(nullptr);
    std::tm     tnow{};
#if defined(_WIN32)
    localtime_s(&tnow, &now);
#else
    tnow = *std::localtime(&now);
#endif

    switch (presetIndex)
    {
    case 0: // Today
        r.fromDate = today;
        r.toDate   = today;
        r.period   = kPresetTodayEn;
        break;

    case 1: // This Week (Mon..Sun — ISO-style; adjust if locale requires Sun-start)
    {
        // tm_wday: 0 = Sunday, 1 = Monday, ... 6 = Saturday.
        // We treat Monday as the start of the week.
        int wday = tnow.tm_wday;
        int offsetToMon = (wday == 0) ? 6 : (wday - 1);
        r.fromDate = addDays(today, -offsetToMon);
        r.toDate   = addDays(r.fromDate, 6);
        r.period   = kPresetThisWeekEn;
        break;
    }

    case 2: // This Month
        r.fromDate = getFirstDayOfMonth(y, m);
        r.toDate   = getLastDayOfMonth(y, m);
        r.period   = kPresetThisMonthEn;
        break;

    case 3: // This Quarter
    {
        int qStartMonth = ((m - 1) / 3) * 3 + 1;   // 1, 4, 7, 10
        r.fromDate = getFirstDayOfMonth(y, qStartMonth);
        int qEndMonth = qStartMonth + 2;
        int qEndYear  = y;
        if (qEndMonth > 12) { qEndMonth -= 12; qEndYear += 1; }
        r.toDate = getLastDayOfMonth(qEndYear, qEndMonth);
        r.period = kPresetThisQtrEn;
        break;
    }

    case 4: // This Year
        r.fromDate = getStartOfYear(y);
        r.toDate   = getEndOfYear(y);
        r.period   = kPresetThisYearEn;
        break;

    case 5: // Last 30 Days
        r.fromDate = addDays(today, -29);
        r.toDate   = today;
        r.period   = kPresetLast30En;
        break;

    case 6: // Last 90 Days
        r.fromDate = addDays(today, -89);
        r.toDate   = today;
        r.period   = kPresetLast90En;
        break;

    case 7: // YTD (Year to date) — from Jan 1 of the current year to today
        r.fromDate = getStartOfYear(y);
        r.toDate   = today;
        r.period   = kPresetYtdEn;
        break;

    default:
        // Unknown preset: empty range (from == to == "").
        break;
    }
    return r;
}

// =============================================================================
// Date-range picker dialog (Win32)
// =============================================================================
namespace {

// Per-dialog state carried in the GWLP_USERDATA slot of the window.
struct DialogState
{
    HWND       hwnd       = nullptr;
    HWND       hFrom      = nullptr;
    HWND       hTo        = nullptr;
    HWND       hPreset    = nullptr;
    DateRange* pResult    = nullptr;
    bool       accepted   = false;
    std::wstring title;
};

void populatePresetCombo(HWND combo, int selectIndex)
{
    SendMessageW(combo, CB_RESETCONTENT, 0, 0);

    struct Pair { const wchar_t* ar; const char* en; };
    const Pair items[] = {
        { kPresetTodayAr,     kPresetTodayEn     },
        { kPresetThisWeekAr,  kPresetThisWeekEn  },
        { kPresetThisMonthAr, kPresetThisMonthEn },
        { kPresetThisQtrAr,   kPresetThisQtrEn   },
        { kPresetThisYearAr,  kPresetThisYearEn  },
        { kPresetLast30Ar,    kPresetLast30En    },
        { kPresetLast90Ar,    kPresetLast90En    },
        { kPresetYtdAr,       kPresetYtdEn       }
    };
    for (int i = 0; i < static_cast<int>(sizeof(items) / sizeof(items[0])); ++i) {
        SendMessageW(combo, CB_ADDSTRING, 0,
                     reinterpret_cast<LPARAM>(items[i].ar));
    }
    if (selectIndex >= 0 &&
        selectIndex < static_cast<int>(sizeof(items) / sizeof(items[0]))) {
        SendMessageW(combo, CB_SETCURSEL, selectIndex, 0);
    }
}

void setPickerFromIso(HWND picker, const std::string& iso)
{
    int y = 0, m = 0, d = 0;
    if (!DateFilter::parseIsoDate(iso, y, m, d)) {
        SYSTEMTIME st{};
        GetLocalTime(&st);
        DateTimePicker_SetSystemtime(picker, GDT_VALID, &st);
        return;
    }
    SYSTEMTIME st{};
    st.wYear  = static_cast<WORD>(y);
    st.wMonth = static_cast<WORD>(m);
    st.wDay   = static_cast<WORD>(d);
    DateTimePicker_SetSystemtime(picker, GDT_VALID, &st);
}

std::string pickerToIso(HWND picker)
{
    SYSTEMTIME st{};
    if (DateTimePicker_GetSystemtime(picker, &st) != GDT_VALID) {
        return std::string();
    }
    return DateFilter::formatIsoDate(static_cast<int>(st.wYear),
                                     static_cast<int>(st.wMonth) - 1,
                                     static_cast<int>(st.wDay));
}

void applyPresetToPickers(DialogState& st, int presetIndex)
{
    DateRange r = DateFilter::applyPreset(presetIndex);
    if (r.fromDate.empty() && r.toDate.empty()) return;
    setPickerFromIso(st.hFrom, r.fromDate);
    setPickerFromIso(st.hTo,   r.toDate);
}

void onOk(DialogState& st)
{
    if (st.pResult == nullptr) {
        st.accepted = false;
    } else {
        st.pResult->fromDate = pickerToIso(st.hFrom);
        st.pResult->toDate   = pickerToIso(st.hTo);
        // Read the currently selected preset (if any) for the period label.
        int sel = static_cast<int>(SendMessageW(st.hPreset, CB_GETCURSEL, 0, 0));
        if (sel >= 0) {
            DateRange r = DateFilter::applyPreset(sel);
            st.pResult->period = r.period;
        } else {
            st.pResult->period.clear();
        }
        st.accepted = true;
    }
    DestroyWindow(st.hwnd);
}

LRESULT CALLBACK DateFilterDlgProc(HWND hwnd, UINT msg,
                                   WPARAM wParam, LPARAM lParam)
{
    DialogState* st = reinterpret_cast<DialogState*>(
        GetWindowLongPtrW(hwnd, GWLP_USERDATA));

    switch (msg)
    {
    case WM_CREATE:
    {
        LPCREATESTRUCTW cs = reinterpret_cast<LPCREATESTRUCTW>(lParam);
        DialogState* initState = reinterpret_cast<DialogState*>(cs->lpCreateParams);
        SetWindowLongPtrW(hwnd, GWLP_USERDATA,
                          reinterpret_cast<LONG_PTR>(initState));
        initState->hwnd = hwnd;

        // Use a right-to-left reading order if the user's locale is Arabic
        // (simple heuristic: rely on system SetProcessDefaultLayout below).
        const int labelW = 80;
        const int xFromLbl = kMargin;
        const int xFrom    = xFromLbl + labelW;
        const int xToLbl   = kMargin;
        const int xTo      = xToLbl + labelW;
        const int xPresLbl = kMargin;
        const int xPres    = xPresLbl + labelW;
        const int y1 = kMargin;
        const int y2 = y1 + kPickerHeight + kMargin;
        const int y3 = y2 + kPickerHeight + kMargin;
        const int yBtnRow = y3 + kPickerHeight + kMargin;

        // -- "From" label + picker
        CreateWindowExW(0, L"STATIC", kLblFromAr,
            WS_CHILD | WS_VISIBLE,
            xFromLbl, y1 + 3, labelW, kLabelHeight,
            hwnd, reinterpret_cast<HMENU>(kIdFromLabel),
            cs->hInstance, nullptr);

        initState->hFrom = CreateWindowExW(0, DATETIMEPICK_CLASSW, L"",
            WS_CHILD | WS_VISIBLE | DTS_SHORTDATEFORMAT,
            xFrom, y1, kPickerWidth, kPickerHeight,
            hwnd, reinterpret_cast<HMENU>(kIdFrom),
            cs->hInstance, nullptr);

        // -- "To" label + picker
        CreateWindowExW(0, L"STATIC", kLblToAr,
            WS_CHILD | WS_VISIBLE,
            xToLbl, y2 + 3, labelW, kLabelHeight,
            hwnd, reinterpret_cast<HMENU>(kIdToLabel),
            cs->hInstance, nullptr);

        initState->hTo = CreateWindowExW(0, DATETIMEPICK_CLASSW, L"",
            WS_CHILD | WS_VISIBLE | DTS_SHORTDATEFORMAT,
            xTo, y2, kPickerWidth, kPickerHeight,
            hwnd, reinterpret_cast<HMENU>(kIdTo),
            cs->hInstance, nullptr);

        // -- "Preset" label + combo
        CreateWindowExW(0, L"STATIC", kLblPresetAr,
            WS_CHILD | WS_VISIBLE,
            xPresLbl, y3 + 3, labelW, kLabelHeight,
            hwnd, reinterpret_cast<HMENU>(kIdPresetLabel),
            cs->hInstance, nullptr);

        initState->hPreset = CreateWindowExW(0, L"COMBOBOX", L"",
            WS_CHILD | WS_VISIBLE | CBS_DROPDOWNLIST | WS_VSCROLL,
            xPres, y3, kPresetWidth, 200,
            hwnd, reinterpret_cast<HMENU>(kIdPreset),
            cs->hInstance, nullptr);

        populatePresetCombo(initState->hPreset, 2); // default: This Month

        // -- Buttons
        const int totalBtnW = (kButtonWidth * 3) + (kMargin * 2);
        const int cxClient = kDialogMinWidth;
        const int xStart   = (cxClient - totalBtnW) / 2;
        CreateWindowExW(0, L"BUTTON", kBtnOkAr,
            WS_CHILD | WS_VISIBLE | BS_DEFPUSHBUTTON,
            xStart, yBtnRow, kButtonWidth, kButtonHeight,
            hwnd, reinterpret_cast<HMENU>(kIdOk),
            cs->hInstance, nullptr);
        CreateWindowExW(0, L"BUTTON", kBtnApplyAr,
            WS_CHILD | WS_VISIBLE | BS_PUSHBUTTON,
            xStart + kButtonWidth + kMargin, yBtnRow, kButtonWidth, kButtonHeight,
            hwnd, reinterpret_cast<HMENU>(kIdApply),
            cs->hInstance, nullptr);
        CreateWindowExW(0, L"BUTTON", kBtnCancelAr,
            WS_CHILD | WS_VISIBLE | BS_PUSHBUTTON,
            xStart + 2 * (kButtonWidth + kMargin), yBtnRow, kButtonWidth, kButtonHeight,
            hwnd, reinterpret_cast<HMENU>(kIdCancel),
            cs->hInstance, nullptr);

        // Initialise pickers to "This Month".
        DateRange initR = DateFilter::applyPreset(2);
        setPickerFromIso(initState->hFrom, initR.fromDate);
        setPickerFromIso(initState->hTo,   initR.toDate);

        return 0;
    }

    case WM_COMMAND:
    {
        const int id        = LOWORD(wParam);
        const int notify    = HIWORD(wParam);
        if (id == kIdCancel) {
            st->accepted = false;
            DestroyWindow(hwnd);
            return 0;
        }
        if (id == kIdOk) {
            onOk(*st);
            return 0;
        }
        if (id == kIdApply) {
            int sel = static_cast<int>(SendMessageW(st->hPreset, CB_GETCURSEL, 0, 0));
            if (sel >= 0) applyPresetToPickers(*st, sel);
            return 0;
        }
        if (id == kIdPreset && notify == CBN_SELCHANGE) {
            int sel = static_cast<int>(SendMessageW(st->hPreset, CB_GETCURSEL, 0, 0));
            if (sel >= 0) applyPresetToPickers(*st, sel);
            return 0;
        }
        return 0;
    }

    case WM_CLOSE:
        if (st) st->accepted = false;
        DestroyWindow(hwnd);
        return 0;

    case WM_DESTROY:
        PostQuitMessage(0);
        return 0;
    }
    return DefWindowProcW(hwnd, msg, wParam, lParam);
}

} // anonymous namespace

bool showDateRangePicker(HWND         parent,
                         const wchar_t* title,
                         DateRange&   out)
{
    static bool classRegistered = false;
    static const wchar_t kClassName[] = L"NamaDateFilterPicker";

    if (!classRegistered) {
        WNDCLASSEXW wc{};
        wc.cbSize        = sizeof(wc);
        wc.style         = CS_HREDRAW | CS_VREDRAW;
        wc.lpfnWndProc   = DateFilterDlgProc;
        wc.hInstance     = GetModuleHandleW(nullptr);
        wc.hCursor       = LoadCursorW(nullptr, IDC_ARROW);
        wc.hbrBackground = reinterpret_cast<HBRUSH>(COLOR_BTNFACE + 1);
        wc.lpszClassName = kClassName;
        if (!RegisterClassExW(&wc)) {
            return false;
        }
        classRegistered = true;
    }

    DialogState st;
    st.pResult = &out;
    st.accepted = false;
    st.title    = title ? std::wstring(title) : std::wstring(kDlgTitleAr);

    INITCOMMONCONTROLSEX icc{};
    icc.dwSize = sizeof(icc);
    icc.dwICC  = ICC_DATE_CLASSES | ICC_STANDARD_CLASSES;
    InitCommonControlsEx(&icc);

    // Centre on parent (or screen if no parent).
    int width  = kDialogMinWidth;
    int height = kDialogMinHeight;
    int x = CW_USEDEFAULT;
    int y = CW_USEDEFAULT;
    if (parent != nullptr) {
        RECT pr{};
        GetWindowRect(parent, &pr);
        x = pr.left + ((pr.right  - pr.left) - width)  / 2;
        y = pr.top  + ((pr.bottom - pr.top)  - height) / 2;
    }

    HWND hwnd = CreateWindowExW(
        WS_EX_DLGMODALFRAME | WS_EX_TOPMOST,
        kClassName,
        st.title.c_str(),
        WS_POPUP | WS_CAPTION | WS_SYSMENU,
        x, y, width, height,
        parent, nullptr,
        GetModuleHandleW(nullptr),
        &st);

    if (hwnd == nullptr) {
        return false;
    }

    // Disable parent while modal.
    HWND prevFocus = (parent != nullptr) ? SetFocus(parent) : nullptr;
    if (parent != nullptr) EnableWindow(parent, FALSE);

    ShowWindow(hwnd, SW_SHOW);
    UpdateWindow(hwnd);

    MSG msg;
    while (GetMessageW(&msg, nullptr, 0, 0) > 0) {
        if (hwnd == nullptr || !IsDialogMessageW(hwnd, &msg)) {
            TranslateMessage(&msg);
            DispatchMessageW(&msg);
        }
        if (!IsWindow(hwnd)) break;
    }

    if (parent != nullptr) {
        EnableWindow(parent, TRUE);
        if (prevFocus != nullptr) SetFocus(prevFocus);
    }

    return st.accepted;
}

DateRange promptDateRange(HWND                parent,
                          const std::wstring& title)
{
    DateRange r;
    DateRange def = DateFilter::applyPreset(2); // This Month
    // Pre-populate (so cancel still gives a sensible default in the caller).
    r.fromDate = def.fromDate;
    r.toDate   = def.toDate;
    r.period   = def.period;

    if (!showDateRangePicker(parent, title.empty() ? kDlgTitleAr
                                                   : title.c_str(),
                             r)) {
        // On cancel, return a range equal to "today" (per spec) but keep
        // the `period` label descriptive.
        r.fromDate = DateFilter::getCurrentDate();
        r.toDate   = r.fromDate;
        r.period   = kPresetTodayEn;
    }
    return r;
}

} // namespace datefilter
} // namespace nama
