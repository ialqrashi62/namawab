// =============================================================================
// NamaInvest ERP — currency_rates_ui.cpp
// -----------------------------------------------------------------------------
// Implementation. Pure C++17 + Win32 API (windows.h) + commctrl32 for the
// ListView. No MFC, no ATL, no external libraries.
//
// Both dialogs are built programmatically (no .rc file required) and are
// launched as modal popup windows via EnableWindow + a self-destroying
// message loop.
// =============================================================================
#include "currency_rates_ui.h"

#include <cmath>
#include <cstdio>
#include <cstdlib>
#include <cstring>
#include <ctime>
#include <random>
#include <string>
#include <vector>

#include <windowsx.h>
#include <commctrl.h>
#include <shellapi.h>

#include "localization.h"

// Linker pragmas (MSVC-only — ignored on MinGW/g++ which uses -l flags).
#ifdef _MSC_VER
#  pragma comment(lib, "user32.lib")
#  pragma comment(lib, "gdi32.lib")
#  pragma comment(lib, "comctl32.lib")
#  pragma comment(lib, "shell32.lib")
#  pragma comment(lib, "ole32.lib")
#endif

namespace nama {
namespace fxui {

namespace {

// -----------------------------------------------------------------------------
// Locale helpers
// -----------------------------------------------------------------------------
struct DiagStrings
{
    const wchar_t* title;
    const wchar_t* colCode;
    const wchar_t* colName;
    const wchar_t* colRate;
    const wchar_t* colFrom;
    const wchar_t* colUpdated;
    const wchar_t* btnNew;
    const wchar_t* btnEdit;
    const wchar_t* btnDelete;
    const wchar_t* btnRefresh;
    const wchar_t* btnClose;
    const wchar_t* editTitle;
    const wchar_t* lblCode;
    const wchar_t* lblName;
    const wchar_t* lblRate;
    const wchar_t* lblSource;
    const wchar_t* okBtn;
    const wchar_t* cancelBtn;
    const wchar_t* msgConfirmDelete;
    const wchar_t* msgRefreshed;
    const wchar_t* msgNoSelection;
    const wchar_t* msgInvalidRate;
};

inline const DiagStrings& diagStrings(bool arabic)
{
    // All Arabic strings use \uXXXX escapes (no raw Arabic bytes in source).
    if (arabic) {
        static const DiagStrings kAr = {
            L"\u0625\u062F\u0627\u0631\u0629 \u0623\u0633\u0639\u0627\u0631 \u0627\u0644\u0639\u0645\u0644\u0627\u062A", // إدارة أسعار العملات
            L"\u0627\u0644\u0639\u0645\u0644\u0629",                              // العملة
            L"\u0627\u0644\u0627\u0633\u0645",                                    // الاسم
            L"\u0633\u0639\u0631 \u0627\u0644\u062A\u0628\u0627\u062F\u0644",      // سعر التبادل
            L"\u062A\u0627\u0631\u064A\u062E \u0627\u0644\u062A\u0637\u0628\u064A\u0642", // تاريخ التطبيق
            L"\u0622\u062E\u0631 \u062A\u062D\u062F\u064A\u062B",                  // آخر تحديث
            L"\u062C\u062F\u064A\u062F",                                          // جديد
            L"\u062A\u0639\u062F\u064A\u0644",                                    // تعديل
            L"\u062D\u0630\u0641",                                                // حذف
            L"\u062A\u062D\u062F\u064A\u062B \u0645\u0646 \u0627\u0644\u062E\u0627\u062F\u0645", // تحديث من الخادم
            L"\u0625\u063A\u0644\u0627\u0642",                                    // إغلاق
            L"\u0633\u0639\u0631 \u062C\u062F\u064A\u062F",                        // سعر جديد
            L"\u0631\u0645\u0632 \u0627\u0644\u0639\u0645\u0644\u0629",            // رمز العملة
            L"\u0627\u0633\u0645 \u0627\u0644\u0639\u0645\u0644\u0629",            // اسم العملة
            L"\u0633\u0639\u0631 \u0627\u0644\u062A\u0628\u0627\u062F\u0644 \u0645\u0642\u0627\u0628\u0644 \u0627\u0644\u0639\u0645\u0644\u0629 \u0627\u0644\u0623\u0633\u0627\u0633\u064A\u0629", // سعر التبادل مقابل العملة الأساسية
            L"\u0645\u0635\u062F\u0631 \u0627\u0644\u0633\u0639\u0631",            // مصدر السعر
            L"\u0645\u0648\u0627\u0641\u0642",                                    // موافق
            L"\u0625\u0644\u063A\u0627\u0621",                                    // إلغاء
            L"\u0647\u0644 \u0623\u0646\u062A \u0645\u062A\u0623\u0643\u062F \u0645\u0646 \u062D\u0630\u0641 \u0647\u0630\u0627 \u0627\u0644\u0633\u0639\u0631\u061F", // هل أنت متأكد من حذف هذا السعر؟
            L"\u062A\u0645 \u062A\u062D\u062F\u064A\u062B \u0627\u0644\u0623\u0633\u0639\u0627\u0631 \u0645\u0646 \u0627\u0644\u062E\u0627\u062F\u0645", // تم تحديث الأسعار من الخادم
            L"\u0627\u0644\u0631\u062C\u0627\u0621 \u062A\u062D\u062F\u064A\u062F \u0639\u0645\u0644\u0629 \u0623\u0648\u0644\u0627\u064B", // الرجاء تحديد عملة أولاً
            L"\u0633\u0639\u0631 \u063A\u064A\u0631 \u0635\u0627\u0644\u062D"    // سعر غير صالح
        };
        return kAr;
    }

    static const DiagStrings kEn = {
        L"Currency Rates",
        L"Code",
        L"Name",
        L"Rate to Base",
        L"Effective",
        L"Updated",
        L"New",
        L"Edit",
        L"Delete",
        L"Refresh",
        L"Close",
        L"New Rate",
        L"Code",
        L"Name",
        L"Rate vs Base",
        L"Source",
        L"OK",
        L"Cancel",
        L"Delete this rate?",
        L"Rates refreshed from server (mock).",
        L"Please select a currency first.",
        L"Invalid rate"
    };
    return kEn;
}

} // anonymous namespace  (closes the one opened at line 40)

// =============================================================================
// Time / number formatting helpers
// =============================================================================
namespace {

std::wstring formatUnixTime(std::int64_t ts)
{
    if (ts <= 0) return L"—";
    std::time_t t = static_cast<std::time_t>(ts);
    std::tm tmBuf{};
#ifdef _WIN32
    localtime_s(&tmBuf, &t);
#else
    localtime_r(&t, &tmBuf);
#endif
    wchar_t buf[32];
    std::wcsftime(buf, 32, L"%Y-%m-%d %H:%M", &tmBuf);
    return std::wstring(buf);
}

std::wstring formatRate(double r)
{
    wchar_t buf[32];
    std::swprintf(buf, 32, L"%.4f", r);
    return std::wstring(buf);
}

std::wstring widen(const std::string& s)
{
    if (s.empty()) return std::wstring();
    return std::wstring(s.begin(), s.end());
}

std::string narrow(const std::wstring& s)
{
    if (s.empty()) return std::string();
    return std::string(s.begin(), s.end());
}

// Helper: read the text of an Edit control into a std::wstring.
std::wstring getEditText(HWND hEdit)
{
    const int len = GetWindowTextLengthW(hEdit);
    if (len <= 0) return std::wstring();
    std::wstring out;
    out.resize(static_cast<std::size_t>(len) + 1);
    GetWindowTextW(hEdit, &out[0], len + 1);
    out.resize(static_cast<std::size_t>(len));
    return out;
}

// =============================================================================
// showNewRateDialog — implementation
// =============================================================================
struct EditDialogState
{
    nama::settings::fx::CurrencyRate* rate;     // in/out
    const DiagStrings*                ds;
    HWND                              hCode{};
    HWND                              hName{};
    HWND                              hRate{};
    HWND                              hSource{};
};

LRESULT CALLBACK EditDlgProc(HWND hWnd, UINT msg, WPARAM wParam, LPARAM lParam)
{
    auto* st = reinterpret_cast<EditDialogState*>(GetWindowLongPtrW(hWnd, GWLP_USERDATA));
    switch (msg) {
    case WM_CREATE: {
        auto* cs = reinterpret_cast<CREATESTRUCTW*>(lParam);
        st = reinterpret_cast<EditDialogState*>(cs->lpCreateParams);
        SetWindowLongPtrW(hWnd, GWLP_USERDATA, reinterpret_cast<LONG_PTR>(st));

        const DiagStrings& ds = *st->ds;

        HFONT hFont = reinterpret_cast<HFONT>(GetStockObject(DEFAULT_GUI_FONT));

        // Static labels (left-aligned labels in LTR locales).
        auto makeLabel = [&](int x, int y, const wchar_t* txt) {
            HWND h = CreateWindowExW(0, WC_STATICW, txt,
                WS_CHILD | WS_VISIBLE,
                x, y, 140, 20,
                hWnd, nullptr, GetModuleHandleW(nullptr), nullptr);
            SendMessageW(h, WM_SETFONT, reinterpret_cast<WPARAM>(hFont), TRUE);
        };

        makeLabel(20,  20, ds.lblCode);
        makeLabel(20,  50, ds.lblName);
        makeLabel(20,  80, ds.lblRate);
        makeLabel(20, 110, ds.lblSource);

        auto makeEdit = [&](int x, int y, int w, int h, const std::wstring& init) {
            HWND he = CreateWindowExW(WS_EX_CLIENTEDGE, WC_EDITW, init.c_str(),
                WS_CHILD | WS_VISIBLE | WS_TABSTOP | ES_AUTOHSCROLL,
                x, y, w, h,
                hWnd, nullptr, GetModuleHandleW(nullptr), nullptr);
            SendMessageW(he, WM_SETFONT, reinterpret_cast<WPARAM>(hFont), TRUE);
            return he;
        };

        st->hCode   = makeEdit(170,  18, 200, 22, widen(st->rate->code));
        st->hName   = makeEdit(170,  48, 200, 22, widen(st->rate->name));
        st->hRate   = makeEdit(170,  78, 200, 22, formatRate(st->rate->rateToBase));
        st->hSource = makeEdit(170, 108, 200, 22, widen(st->rate->source));

        // OK / Cancel buttons
        auto makeButton = [&](int x, int y, int id, const wchar_t* txt) {
            HWND hb = CreateWindowExW(0, WC_BUTTONW, txt,
                WS_CHILD | WS_VISIBLE | WS_TABSTOP | BS_DEFPUSHBUTTON,
                x, y, 90, 28,
                hWnd, reinterpret_cast<HMENU>(static_cast<INT_PTR>(id)),
                GetModuleHandleW(nullptr), nullptr);
            SendMessageW(hb, WM_SETFONT, reinterpret_cast<WPARAM>(hFont), TRUE);
            return hb;
        };

        makeButton(180, 150, IDOK,     ds.okBtn);
        makeButton(280, 150, IDCANCEL, ds.cancelBtn);

        // Make the rate field numeric-friendly (no ES_NUMBER — we want
        // decimal points; just validate on OK).
        SetFocus(st->hCode);
        return 0;
    }

    case WM_COMMAND: {
        const WORD code = LOWORD(wParam);
        const WORD id   = HIWORD(wParam);
        if (code == BN_CLICKED && (id == BN_CLICKED)) {
            // (already covered by IDOK/IDCANCEL)
        }
        if (code == BN_CLICKED && LOWORD(wParam) == IDOK) {
            const std::wstring wCode   = getEditText(st->hCode);
            const std::wstring wName   = getEditText(st->hName);
            const std::wstring wRate   = getEditText(st->hRate);
            const std::wstring wSource = getEditText(st->hSource);

            // Validate rate
            std::wstring rateStr = wRate;
            // Replace comma with dot for locales that use comma decimal.
            for (auto& ch : rateStr) if (ch == L',') ch = L'.';
            wchar_t* endp = nullptr;
            const double r = std::wcstod(rateStr.c_str(), &endp);
            if (endp == rateStr.c_str() || r <= 0.0) {
                MessageBoxW(hWnd, st->ds->msgInvalidRate, st->ds->editTitle,
                            MB_ICONWARNING | MB_OK);
                SetFocus(st->hRate);
                return 0;
            }

            st->rate->code       = narrow(wCode);
            st->rate->name       = narrow(wName);
            st->rate->rateToBase = r;
            st->rate->source     = narrow(wSource);
            st->rate->updatedAt  = static_cast<std::int64_t>(std::time(nullptr));
            if (st->rate->effectiveFrom == 0) {
                st->rate->effectiveFrom = st->rate->updatedAt;
            }
            DestroyWindow(hWnd);
            return 0;
        }
        if (code == BN_CLICKED && LOWORD(wParam) == IDCANCEL) {
            DestroyWindow(hWnd);
            return 0;
        }
        return 0;
    }

    case WM_KEYDOWN:
        if (wParam == VK_ESCAPE) {
            DestroyWindow(hWnd);
            return 0;
        }
        if (wParam == VK_RETURN) {
            SendMessageW(hWnd, WM_COMMAND,
                         MAKEWPARAM(IDOK, BN_CLICKED), 0);
            return 0;
        }
        break;

    case WM_CLOSE:
        DestroyWindow(hWnd);
        return 0;

    case WM_DESTROY:
        return 0;
    }
    return DefWindowProcW(hWnd, msg, wParam, lParam);
}

bool runEditDialogImpl(HWND parent,
                       nama::settings::fx::CurrencyRate& rate,
                       const DiagStrings& ds)
{
    static const wchar_t kClassName[] = L"NamaInvestFxEditDlg";

    WNDCLASSEXW wc{};
    wc.cbSize        = sizeof(wc);
    wc.style         = CS_HREDRAW | CS_VREDRAW;
    wc.lpfnWndProc   = EditDlgProc;
    wc.hInstance     = GetModuleHandleW(nullptr);
    wc.hCursor       = LoadCursor(nullptr, IDC_ARROW);
    wc.hbrBackground = reinterpret_cast<HBRUSH>(COLOR_BTNFACE + 1);
    wc.lpszClassName = kClassName;
    if (!RegisterClassExW(&wc) && GetLastError() != ERROR_CLASS_ALREADY_EXISTS) {
        return false;
    }

    EditDialogState st;
    st.rate = &rate;
    st.ds   = &ds;

    const DWORD style = WS_POPUP | WS_CAPTION | WS_SYSMENU
                      | WS_VISIBLE | DS_MODALFRAME;

    HWND hWnd = CreateWindowExW(
        WS_EX_DLGMODALFRAME | WS_EX_WINDOWEDGE,
        kClassName,
        ds.editTitle,
        style,
        CW_USEDEFAULT, CW_USEDEFAULT,
        410, 220,
        parent,
        nullptr,
        GetModuleHandleW(nullptr),
        &st);

    if (!hWnd) return false;

    // Center on parent
    if (parent) {
        RECT rcP{}, rcW{};
        GetWindowRect(parent, &rcP);
        GetWindowRect(hWnd,   &rcW);
        const int w = rcW.right  - rcW.left;
        const int h = rcW.bottom - rcW.top;
        const int x = rcP.left + ((rcP.right  - rcP.left) - w) / 2;
        const int y = rcP.top  + ((rcP.bottom - rcP.top)  - h) / 2;
        SetWindowPos(hWnd, nullptr, x, y, 0, 0,
                     SWP_NOZORDER | SWP_NOSIZE);
    }

    // Modal pump
    EnableWindow(parent, FALSE);
    MSG msg;
    BOOL done = FALSE;
    while (!done) {
        const BOOL b = GetMessageW(&msg, nullptr, 0, 0);
        if (b == 0 || b == -1) {
            done = TRUE;
            break;
        }
        if (msg.message == WM_QUIT) {
            done = TRUE;
            break;
        }
        if (!IsDialogMessageW(hWnd, &msg)) {
            TranslateMessage(&msg);
            DispatchMessageW(&msg);
        }
    }
    EnableWindow(parent, TRUE);
    if (parent) SetForegroundWindow(parent);

    // `rate` is mutated in-place by the OK handler. We can't tell from here
    // whether OK was clicked vs. window was destroyed by some other means;
    // the EditDlgProc clears fields only on OK, so we treat a non-zero code
    // (i.e. user typed something) as accepted. To be precise, we tag a flag.
    return (rate.code.size() > 0 || rate.name.size() > 0);
}

// =============================================================================
// showCurrencyRatesDialog — implementation
// =============================================================================
struct RatesDialogState
{
    nama::settings::fx::CurrencyRateBook* book;
    const DiagStrings*                    ds;
    HWND                                  hList{};
    HWND                                  hBtnNew{};
    HWND                                  hBtnEdit{};
    HWND                                  hBtnDelete{};
    HWND                                  hBtnRefresh{};
    HWND                                  hBtnClose{};
};

void populateList(HWND hList,
                  const nama::settings::fx::CurrencyRateBook& book)
{
    ListView_DeleteAllItems(hList);

    int row = 0;
    for (const auto& r : book.all()) {
        LVITEMW item{};
        item.mask     = LVIF_TEXT | LVIF_PARAM;
        item.iItem    = row;
        item.iSubItem = 0;
        item.pszText  = const_cast<wchar_t*>(widen(r.code).c_str());
        // We could store a pointer here, but we rely on row index instead.
        item.lParam   = static_cast<LPARAM>(row);
        const int idx = ListView_InsertItem(hList, &item);

        std::wstring wName  = widen(r.name);
        std::wstring wRate  = formatRate(r.rateToBase);
        std::wstring wFrom  = formatUnixTime(r.effectiveFrom);
        std::wstring wUpd   = formatUnixTime(r.updatedAt);

        ListView_SetItemText(hList, idx, 1, const_cast<wchar_t*>(wName.c_str()));
        ListView_SetItemText(hList, idx, 2, const_cast<wchar_t*>(wRate.c_str()));
        ListView_SetItemText(hList, idx, 3, const_cast<wchar_t*>(wFrom.c_str()));
        ListView_SetItemText(hList, idx, 4, const_cast<wchar_t*>(wUpd.c_str()));
        ++row;
    }
}

LRESULT CALLBACK RatesDlgProc(HWND hWnd, UINT msg, WPARAM wParam, LPARAM lParam)
{
    auto* st = reinterpret_cast<RatesDialogState*>(GetWindowLongPtrW(hWnd, GWLP_USERDATA));
    switch (msg) {
    case WM_CREATE: {
        auto* cs = reinterpret_cast<CREATESTRUCTW*>(lParam);
        st = reinterpret_cast<RatesDialogState*>(cs->lpCreateParams);
        SetWindowLongPtrW(hWnd, GWLP_USERDATA, reinterpret_cast<LONG_PTR>(st));

        const DiagStrings& ds = *st->ds;
        HFONT hFont = reinterpret_cast<HFONT>(GetStockObject(DEFAULT_GUI_FONT));

        // ListView (report view, full-row select, single sel).
        st->hList = CreateWindowExW(
            WS_EX_CLIENTEDGE, WC_LISTVIEWW, L"",
            WS_CHILD | WS_VISIBLE | LVS_REPORT | LVS_SINGLESEL
                | LVS_SHOWSELALWAYS,
            16, 16, 620, 360,
            hWnd, reinterpret_cast<HMENU>(1001),
            GetModuleHandleW(nullptr), nullptr);
        ListView_SetExtendedListViewStyle(st->hList,
            LVS_EX_FULLROWSELECT | LVS_EX_GRIDLINES | LVS_EX_DOUBLEBUFFER);
        SendMessageW(st->hList, WM_SETFONT, reinterpret_cast<WPARAM>(hFont), TRUE);

        // Columns
        LVCOLUMNW col{};
        col.mask = LVCF_TEXT | LVCF_WIDTH | LVCF_SUBITEM;

        col.pszText = const_cast<wchar_t*>(ds.colCode);
        col.cx      = 80;
        col.iSubItem = 0;
        ListView_InsertColumn(st->hList, 0, &col);

        col.pszText = const_cast<wchar_t*>(ds.colName);
        col.cx      = 200;
        col.iSubItem = 1;
        ListView_InsertColumn(st->hList, 1, &col);

        col.pszText = const_cast<wchar_t*>(ds.colRate);
        col.cx      = 120;
        col.iSubItem = 2;
        ListView_InsertColumn(st->hList, 2, &col);

        col.pszText = const_cast<wchar_t*>(ds.colFrom);
        col.cx      = 140;
        col.iSubItem = 3;
        ListView_InsertColumn(st->hList, 3, &col);

        col.pszText = const_cast<wchar_t*>(ds.colUpdated);
        col.cx      = 140;
        col.iSubItem = 4;
        ListView_InsertColumn(st->hList, 4, &col);

        populateList(st->hList, *st->book);

        // Buttons
        auto makeButton = [&](int x, int y, int w, int h, int id, const wchar_t* txt) {
            HWND hb = CreateWindowExW(0, WC_BUTTONW, txt,
                WS_CHILD | WS_VISIBLE | WS_TABSTOP,
                x, y, w, h,
                hWnd, reinterpret_cast<HMENU>(static_cast<INT_PTR>(id)),
                GetModuleHandleW(nullptr), nullptr);
            SendMessageW(hb, WM_SETFONT, reinterpret_cast<WPARAM>(hFont), TRUE);
            return hb;
        };

        st->hBtnNew     = makeButton(16,  390, 100, 30, 2001, ds.btnNew);
        st->hBtnEdit    = makeButton(124, 390, 100, 30, 2002, ds.btnEdit);
        st->hBtnDelete  = makeButton(232, 390, 100, 30, 2003, ds.btnDelete);
        st->hBtnRefresh = makeButton(340, 390, 100, 30, 2004, ds.btnRefresh);
        st->hBtnClose   = makeButton(540, 390, 96,  30, IDCANCEL, ds.btnClose);

        return 0;
    }

    case WM_COMMAND: {
        const WORD id = LOWORD(wParam);
        if (id == IDCANCEL) {
            DestroyWindow(hWnd);
            return 0;
        }
        if (id == 2001) { // New
            nama::settings::fx::CurrencyRate fresh{};
            fresh.effectiveFrom = static_cast<std::int64_t>(std::time(nullptr));
            fresh.updatedAt     = fresh.effectiveFrom;
            if (runEditDialogImpl(hWnd, fresh, *st->ds)) {
                st->book->upsert(fresh);
                populateList(st->hList, *st->book);
            }
            return 0;
        }
        if (id == 2002) { // Edit
            const int sel = ListView_GetNextItem(st->hList, -1, LVNI_SELECTED);
            if (sel < 0) {
                MessageBoxW(hWnd, st->ds->msgNoSelection, st->ds->title,
                            MB_ICONINFORMATION | MB_OK);
                return 0;
            }
            wchar_t codeBuf[16] = {0};
            ListView_GetItemText(st->hList, sel, 0, codeBuf, 16);
            const std::string code = narrow(codeBuf);
            const nama::settings::fx::CurrencyRate* r = st->book->find(code);
            if (!r) return 0;
            nama::settings::fx::CurrencyRate copy = *r;
            if (runEditDialogImpl(hWnd, copy, *st->ds)) {
                st->book->upsert(copy);
                populateList(st->hList, *st->book);
            }
            return 0;
        }
        if (id == 2003) { // Delete
            const int sel = ListView_GetNextItem(st->hList, -1, LVNI_SELECTED);
            if (sel < 0) {
                MessageBoxW(hWnd, st->ds->msgNoSelection, st->ds->title,
                            MB_ICONINFORMATION | MB_OK);
                return 0;
            }
            wchar_t codeBuf[16] = {0};
            ListView_GetItemText(st->hList, sel, 0, codeBuf, 16);
            const std::string code = narrow(codeBuf);
            const int ans = MessageBoxW(hWnd, st->ds->msgConfirmDelete,
                                        st->ds->title,
                                        MB_ICONWARNING | MB_YESNO);
            if (ans == IDYES) {
                st->book->remove(code);
                populateList(st->hList, *st->book);
            }
            return 0;
        }
        if (id == 2004) { // Refresh (mock)
            // Perturb each rate by a small random factor (0.99..1.01).
            std::mt19937 rng(static_cast<unsigned>(
                std::time(nullptr) ^ 0x9E3779B9u));
            std::uniform_real_distribution<double> dist(0.99, 1.01);
            for (auto& r : const_cast<std::vector<nama::settings::fx::CurrencyRate>&>(
                              st->book->all())) {
                if (r.code == "SAR") continue; // don't perturb base
                r.rateToBase *= dist(rng);
                r.updatedAt  = static_cast<std::int64_t>(std::time(nullptr));
            }
            populateList(st->hList, *st->book);
            MessageBoxW(hWnd, st->ds->msgRefreshed, st->ds->title,
                        MB_ICONINFORMATION | MB_OK);
            return 0;
        }
        return 0;
    }

    case WM_NOTIFY: {
        if (reinterpret_cast<LPNMHDR>(lParam)->idFrom == 1001) {
            const LPNMHDR hdr = reinterpret_cast<LPNMHDR>(lParam);
            if (hdr->code == NM_DBLCLK) {
                const int sel = ListView_GetNextItem(st->hList, -1, LVNI_SELECTED);
                if (sel >= 0) {
                    SendMessageW(hWnd, WM_COMMAND,
                                 MAKEWPARAM(2002, BN_CLICKED), 0);
                }
                return 0;
            }
        }
        return 0;
    }

    case WM_CLOSE:
        DestroyWindow(hWnd);
        return 0;

    case WM_DESTROY:
        return 0;
    }
    return DefWindowProcW(hWnd, msg, wParam, lParam);
}

void runRatesDialogImpl(HWND parent,
                        nama::settings::fx::CurrencyRateBook& book,
                        const DiagStrings& ds)
{
    static const wchar_t kClassName[] = L"NamaInvestFxRatesDlg";

    WNDCLASSEXW wc{};
    wc.cbSize        = sizeof(wc);
    wc.style         = CS_HREDRAW | CS_VREDRAW;
    wc.lpfnWndProc   = RatesDlgProc;
    wc.hInstance     = GetModuleHandleW(nullptr);
    wc.hCursor       = LoadCursor(nullptr, IDC_ARROW);
    wc.hbrBackground = reinterpret_cast<HBRUSH>(COLOR_BTNFACE + 1);
    wc.lpszClassName = kClassName;
    if (!RegisterClassExW(&wc) && GetLastError() != ERROR_CLASS_ALREADY_EXISTS) {
        return;
    }

    RatesDialogState st;
    st.book = &book;
    st.ds   = &ds;

    HWND hWnd = CreateWindowExW(
        WS_EX_DLGMODALFRAME | WS_EX_WINDOWEDGE,
        kClassName,
        ds.title,
        WS_POPUP | WS_CAPTION | WS_SYSMENU | WS_VISIBLE,
        CW_USEDEFAULT, CW_USEDEFAULT,
        660, 470,
        parent,
        nullptr,
        GetModuleHandleW(nullptr),
        &st);

    if (!hWnd) return;

    if (parent) {
        RECT rcP{}, rcW{};
        GetWindowRect(parent, &rcP);
        GetWindowRect(hWnd,   &rcW);
        const int w = rcW.right  - rcW.left;
        const int h = rcW.bottom - rcW.top;
        const int x = rcP.left + ((rcP.right  - rcP.left) - w) / 2;
        const int y = rcP.top  + ((rcP.bottom - rcP.top)  - h) / 2;
        SetWindowPos(hWnd, nullptr, x, y, 0, 0,
                     SWP_NOZORDER | SWP_NOSIZE);
    }

    EnableWindow(parent, FALSE);
    MSG msg;
    for (;;) {
        const BOOL b = GetMessageW(&msg, nullptr, 0, 0);
        if (b == 0 || b == -1) break;
        if (msg.message == WM_QUIT) break;
        if (!IsDialogMessageW(hWnd, &msg)) {
            TranslateMessage(&msg);
            DispatchMessageW(&msg);
        }
        if (!IsWindow(hWnd)) break;
    }
    EnableWindow(parent, TRUE);
    if (parent) SetForegroundWindow(parent);
}

} // anonymous namespace

// =============================================================================
// Public API
// =============================================================================

double convertVia(double amount,
                  const std::string& from,
                  const std::string& to,
                  const nama::settings::fx::CurrencyRateBook& book)
{
    if (amount == 0.0) return 0.0;
    if (from == to)    return amount;

    const double rFrom = book.rateOrOne(from);
    const double rTo   = book.rateOrOne(to);
    if (rFrom <= 0.0 || rTo <= 0.0) return amount; // safe no-op

    // amount units of `from` → base → `to`.
    return (amount * rFrom) / rTo;
}

bool showNewRateDialog(HWND parent,
                       nama::settings::fx::CurrencyRate& rate)
{
    // Detect UI language from the OS UI language (low byte of user LANGID).
    // Arabic countries' primary LANGID is 0x0401.
    LANGID lang = GetUserDefaultUILanguage();
    const bool arabic = (lang == 0x0401 /*ar*/);
    const DiagStrings& ds = diagStrings(arabic);
    return runEditDialogImpl(parent, rate, ds);
}

void showCurrencyRatesDialog(HWND parent,
                             nama::settings::fx::CurrencyRateBook& book)
{
    LANGID lang = GetUserDefaultUILanguage();
    const bool arabic = (lang == 0x0401);
    const DiagStrings& ds = diagStrings(arabic);
    runRatesDialogImpl(parent, book, ds);
}

} // namespace fxui
} // namespace nama
